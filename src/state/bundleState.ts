import type {
  BundleCatalog,
  ProductId,
  SelectionKey,
  StepId,
  VariantId,
} from '../types/bundle'

export type BundleState = {
  activeStepId: StepId | null
  activeVariantByProduct: Partial<Record<ProductId, VariantId>>
  quantities: Partial<Record<SelectionKey, number>>
  selectedPlanId: string
}

export const createSelectionKey = (
  productId: ProductId,
  variantId?: VariantId,
): SelectionKey => (variantId ? `${productId}::${variantId}` : productId)

export const createInitialBundleState = (catalog: BundleCatalog): BundleState => ({
  activeStepId: catalog.initialConfiguration.activeStepId,
  activeVariantByProduct: {
    ...catalog.initialConfiguration.activeVariantByProduct,
  },
  quantities: {
    ...catalog.initialConfiguration.quantities,
  },
  selectedPlanId: catalog.initialConfiguration.selectedPlanId,
})
