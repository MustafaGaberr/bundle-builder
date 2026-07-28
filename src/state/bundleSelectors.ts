import { createSelectionKey } from './bundleState'

import type {
  BillingPeriod,
  BundleCatalog,
  BundleStep,
  CategoryId,
  Price,
  Product,
  ProductVariant,
  ReviewOnlyItem,
  ShippingOption,
  VariantId,
} from '../types/bundle'
import type { BundleState } from './bundleState'

export type ReviewLine = {
  id: string
  selectionKey: string
  sourceItemId: string
  categoryId: CategoryId
  name: string
  variantLabel?: string
  imageUrl: string
  quantity: number
  activeUnitPrice: Price
  compareAtUnitPrice?: Price
  billingPeriod: BillingPeriod
  required?: boolean
  minimumQuantity?: number
}

export type ReviewSections = {
  cameras: ReviewLine[]
  sensors: ReviewLine[]
  accessories: ReviewLine[]
  plan: ReviewLine[]
}

export type BundleTotals = {
  oneTimeActiveTotalCents: number
  oneTimeCompareAtTotalCents: number
  oneTimeSavingsCents: number
  monthlyPlanActiveTotalCents: number
  monthlyPlanCompareAtTotalCents: number
  monthlyPlanSavingsCents: number
}

export const selectActiveStep = (
  catalog: BundleCatalog,
  state: BundleState,
): BundleStep | undefined => catalog.steps.find((step) => step.id === state.activeStepId)

export const selectActiveVariantId = (
  state: BundleState,
  product: Product,
): VariantId | undefined => state.activeVariantByProduct[product.id] ?? product.variants?.[0]?.id

export const selectQuantity = (state: BundleState, selectionKey: string): number =>
  state.quantities[selectionKey] ?? 0

export const selectActiveProductSelectionKey = (
  state: BundleState,
  product: Product,
): string | undefined => {
  const activeVariantId = selectActiveVariantId(state, product)

  if (product.variants && activeVariantId) {
    return createSelectionKey(product.id, activeVariantId)
  }

  if (!product.variants) {
    return createSelectionKey(product.id)
  }

  return undefined
}

export const selectDistinctSelectedProductCountByCategory = (
  catalog: BundleCatalog,
  state: BundleState,
  categoryId: CategoryId,
): number => {
  let selectedProductCount = 0

  for (const product of catalog.products) {
    if (product.categoryId !== categoryId) {
      continue
    }

    if (productHasSelectedQuantity(product, state)) {
      selectedProductCount += 1
    }
  }

  return selectedProductCount
}

export const selectReviewSections = (
  catalog: BundleCatalog,
  state: BundleState,
): ReviewSections => ({
  cameras: selectCameraReviewLines(catalog, state),
  sensors: selectReviewOnlyLinesByCategory(catalog, state, 'sensors'),
  accessories: selectReviewOnlyLinesByCategory(catalog, state, 'accessories'),
  plan: selectPlanReviewLines(catalog, state),
})

export const selectShippingOption = (catalog: BundleCatalog): ShippingOption | undefined =>
  catalog.shippingOptions[0]

export const selectBundleTotals = (catalog: BundleCatalog, state: BundleState): BundleTotals => {
  let oneTimeActiveTotalCents = 0
  let oneTimeCompareAtTotalCents = 0

  for (const product of catalog.products) {
    for (const selectedVariant of getProductSelectionKeys(product)) {
      const quantity = selectQuantity(state, selectedVariant.selectionKey)

      if (quantity === 0) {
        continue
      }

      oneTimeActiveTotalCents += product.activePrice.amountCents * quantity
      oneTimeCompareAtTotalCents += getCompareAtPrice(product.activePrice, product.compareAtPrice).amountCents * quantity
    }
  }

  for (const item of catalog.reviewOnlyItems) {
    const quantity = selectQuantity(state, item.id)

    if (quantity === 0) {
      continue
    }

    oneTimeActiveTotalCents += item.activePrice.amountCents * quantity
    oneTimeCompareAtTotalCents += getCompareAtPrice(item.activePrice, item.compareAtPrice).amountCents * quantity
  }

  const shippingOption = selectShippingOption(catalog)

  if (shippingOption) {
    oneTimeActiveTotalCents += shippingOption.activePrice.amountCents
    oneTimeCompareAtTotalCents += getCompareAtPrice(
      shippingOption.activePrice,
      shippingOption.compareAtPrice,
    ).amountCents
  }

  const selectedPlan = catalog.plans.find((plan) => plan.id === state.selectedPlanId)
  const monthlyPlanActiveTotalCents = selectedPlan?.activePrice.amountCents ?? 0
  const monthlyPlanCompareAtTotalCents = selectedPlan
    ? getCompareAtPrice(selectedPlan.activePrice, selectedPlan.compareAtPrice).amountCents
    : 0

  return {
    oneTimeActiveTotalCents,
    oneTimeCompareAtTotalCents,
    oneTimeSavingsCents: Math.max(oneTimeCompareAtTotalCents - oneTimeActiveTotalCents, 0),
    monthlyPlanActiveTotalCents,
    monthlyPlanCompareAtTotalCents,
    monthlyPlanSavingsCents: Math.max(monthlyPlanCompareAtTotalCents - monthlyPlanActiveTotalCents, 0),
  }
}

type ProductSelection = {
  selectionKey: string
  variant?: ProductVariant
}

const getCompareAtPrice = (activePrice: Price, compareAtPrice?: Price): Price =>
  compareAtPrice ?? activePrice

const getProductSelectionKeys = (product: Product): ProductSelection[] => {
  if (!product.variants) {
    return [
      {
        selectionKey: createSelectionKey(product.id),
      },
    ]
  }

  return product.variants.map((variant) => ({
    selectionKey: createSelectionKey(product.id, variant.id),
    variant,
  }))
}

const productHasSelectedQuantity = (product: Product, state: BundleState): boolean => {
  for (const selectedVariant of getProductSelectionKeys(product)) {
    if (selectQuantity(state, selectedVariant.selectionKey) > 0) {
      return true
    }
  }

  return false
}

const selectCameraReviewLines = (catalog: BundleCatalog, state: BundleState): ReviewLine[] => {
  const lines: ReviewLine[] = []

  for (const product of catalog.products) {
    for (const selectedVariant of getProductSelectionKeys(product)) {
      const quantity = selectQuantity(state, selectedVariant.selectionKey)

      if (quantity === 0) {
        continue
      }

      lines.push({
        id: selectedVariant.selectionKey,
        selectionKey: selectedVariant.selectionKey,
        sourceItemId: product.id,
        categoryId: product.categoryId,
        name: product.name,
        variantLabel: selectedVariant.variant?.label,
        imageUrl: selectedVariant.variant?.thumbnailPath ?? product.imagePath,
        quantity,
        activeUnitPrice: product.activePrice,
        compareAtUnitPrice: product.compareAtPrice,
        billingPeriod: product.activePrice.billingPeriod,
      })
    }
  }

  return lines
}

const selectReviewOnlyLinesByCategory = (
  catalog: BundleCatalog,
  state: BundleState,
  categoryId: CategoryId,
): ReviewLine[] => {
  const lines: ReviewLine[] = []

  for (const item of catalog.reviewOnlyItems) {
    if (item.categoryId !== categoryId) {
      continue
    }

    const quantity = selectQuantity(state, item.id)

    if (quantity === 0) {
      continue
    }

    lines.push(createReviewOnlyLine(item, quantity))
  }

  return lines
}

const createReviewOnlyLine = (item: ReviewOnlyItem, quantity: number): ReviewLine => ({
  id: item.id,
  selectionKey: item.id,
  sourceItemId: item.id,
  categoryId: item.categoryId,
  name: item.name,
  imageUrl: item.imagePath,
  quantity,
  activeUnitPrice: item.activePrice,
  compareAtUnitPrice: item.compareAtPrice,
  billingPeriod: item.activePrice.billingPeriod,
  required: item.required,
  minimumQuantity: item.minimumQuantity,
})

const selectPlanReviewLines = (catalog: BundleCatalog, state: BundleState): ReviewLine[] => {
  const selectedPlan = catalog.plans.find((plan) => plan.id === state.selectedPlanId)

  if (!selectedPlan) {
    return []
  }

  return [
    {
      id: selectedPlan.id,
      selectionKey: selectedPlan.id,
      sourceItemId: selectedPlan.id,
      categoryId: selectedPlan.categoryId,
      name: selectedPlan.name,
      imageUrl: selectedPlan.logoPath,
      quantity: 1,
      activeUnitPrice: selectedPlan.activePrice,
      compareAtUnitPrice: selectedPlan.compareAtPrice,
      billingPeriod: selectedPlan.activePrice.billingPeriod,
    },
  ]
}
