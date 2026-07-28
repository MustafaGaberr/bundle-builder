import { createSelectionKey } from './bundleState'

import type { BundleCatalog, Product, ProductId, SelectionKey, StepId, VariantId } from '../types/bundle'
import type { BundleState } from './bundleState'

export type BundleAction =
  | {
      type: 'set-active-step'
      stepId: StepId | null
    }
  | {
      type: 'set-active-variant'
      productId: ProductId
      variantId: VariantId
    }
  | {
      type: 'set-quantity'
      selectionKey: SelectionKey
      quantity: number
    }
  | {
      type: 'increment-quantity'
      selectionKey: SelectionKey
    }
  | {
      type: 'decrement-quantity'
      selectionKey: SelectionKey
    }
  | {
      type: 'select-plan'
      planId: string
    }

type BundleReducer = (state: BundleState, action: BundleAction) => BundleState

const hasVariant = (product: Product, variantId: VariantId): boolean =>
  product.variants?.some((variant) => variant.id === variantId) ?? false

const isValidStepId = (catalog: BundleCatalog, stepId: StepId): boolean =>
  catalog.steps.some((step) => step.id === stepId)

const isValidPlanId = (catalog: BundleCatalog, planId: string): boolean =>
  catalog.plans.some((plan) => plan.id === planId)

const isValidProductVariant = (
  catalog: BundleCatalog,
  productId: ProductId,
  variantId: VariantId,
): boolean => {
  const product = catalog.products.find((catalogProduct) => catalogProduct.id === productId)

  if (!product?.variants) {
    return false
  }

  return hasVariant(product, variantId)
}

const createValidSelectionKeys = (catalog: BundleCatalog): Set<SelectionKey> => {
  const selectionKeys = new Set<SelectionKey>()

  for (const product of catalog.products) {
    if (product.variants) {
      for (const variant of product.variants) {
        selectionKeys.add(createSelectionKey(product.id, variant.id))
      }
    } else {
      selectionKeys.add(createSelectionKey(product.id))
    }
  }

  for (const item of catalog.reviewOnlyItems) {
    selectionKeys.add(item.id)
  }

  return selectionKeys
}

const getMinimumQuantity = (catalog: BundleCatalog, selectionKey: SelectionKey): number => {
  const reviewOnlyItem = catalog.reviewOnlyItems.find((item) => item.id === selectionKey)

  return reviewOnlyItem?.minimumQuantity ?? 0
}

const normalizeQuantity = (quantity: number, minimumQuantity: number): number | undefined => {
  if (!Number.isFinite(quantity)) {
    return undefined
  }

  return Math.max(Math.floor(quantity), minimumQuantity)
}

const updateQuantity = (
  catalog: BundleCatalog,
  validSelectionKeys: Set<SelectionKey>,
  state: BundleState,
  selectionKey: SelectionKey,
  nextQuantity: number,
): BundleState => {
  if (!validSelectionKeys.has(selectionKey)) {
    return state
  }

  const minimumQuantity = getMinimumQuantity(catalog, selectionKey)
  const normalizedQuantity = normalizeQuantity(nextQuantity, minimumQuantity)

  if (normalizedQuantity === undefined || state.quantities[selectionKey] === normalizedQuantity) {
    return state
  }

  return {
    ...state,
    quantities: {
      ...state.quantities,
      [selectionKey]: normalizedQuantity,
    },
  }
}

export const createBundleReducer = (catalog: BundleCatalog): BundleReducer => {
  const validSelectionKeys = createValidSelectionKeys(catalog)

  return (state: BundleState, action: BundleAction): BundleState => {
    switch (action.type) {
      case 'set-active-step':
        if (action.stepId === null) {
          if (state.activeStepId === null) {
            return state
          }

          return {
            ...state,
            activeStepId: null,
          }
        }

        if (!isValidStepId(catalog, action.stepId) || state.activeStepId === action.stepId) {
          return state
        }

        return {
          ...state,
          activeStepId: action.stepId,
        }

      case 'set-active-variant':
        if (
          !isValidProductVariant(catalog, action.productId, action.variantId) ||
          state.activeVariantByProduct[action.productId] === action.variantId
        ) {
          return state
        }

        return {
          ...state,
          activeVariantByProduct: {
            ...state.activeVariantByProduct,
            [action.productId]: action.variantId,
          },
        }

      case 'set-quantity':
        return updateQuantity(catalog, validSelectionKeys, state, action.selectionKey, action.quantity)

      case 'increment-quantity':
        return updateQuantity(
          catalog,
          validSelectionKeys,
          state,
          action.selectionKey,
          (state.quantities[action.selectionKey] ?? 0) + 1,
        )

      case 'decrement-quantity':
        return updateQuantity(
          catalog,
          validSelectionKeys,
          state,
          action.selectionKey,
          (state.quantities[action.selectionKey] ?? 0) - 1,
        )

      case 'select-plan':
        if (!isValidPlanId(catalog, action.planId) || state.selectedPlanId === action.planId) {
          return state
        }

        return {
          ...state,
          selectedPlanId: action.planId,
        }
    }

    return state
  }
}
