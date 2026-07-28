export type CategoryId = string

export type StepId = string

export type ProductId = string

export type VariantId = string

export type SelectionKey = string

export type BillingPeriod = string

export type Price = {
  amountCents: number
  currency: string
  billingPeriod: BillingPeriod
}

export type BundleStep = {
  id: StepId
  order: number
  title: string
  eyebrowLabel: string
  iconPath: string
  categoryId: CategoryId
  nextStepLabel?: string
}

export type ProductVariant = {
  id: VariantId
  label: string
  thumbnailPath: string
}

export type Product = {
  id: ProductId
  categoryId: CategoryId
  name: string
  description: string
  imagePath: string
  learnMoreLabel: string
  discountLabel?: string
  compareAtPrice?: Price
  activePrice: Price
  variants?: ProductVariant[]
}

export type ReviewOnlyItem = {
  id: string
  categoryId: CategoryId
  name: string
  imagePath: string
  activePrice: Price
  compareAtPrice?: Price
  required?: boolean
  minimumQuantity?: number
}

export type Plan = {
  id: string
  categoryId: CategoryId
  name: string
  logoPath: string
  compareAtPrice: Price
  activePrice: Price
}

export type ShippingOption = {
  id: string
  categoryId: CategoryId
  name: string
  iconPath: string
  compareAtPrice: Price
  activePrice: Price
}

export type InitialConfiguration = {
  activeStepId: StepId
  activeVariantByProduct: Partial<Record<ProductId, VariantId>>
  quantities: Partial<Record<SelectionKey, number>>
  selectedPlanId: Plan['id']
}

export type ReviewMetadata = {
  satisfactionGuaranteeBadgePath: string
  financingLabel: string
  checkoutLabel: string
  saveForLaterLabel: string
}

export type BundleCatalog = {
  steps: BundleStep[]
  products: Product[]
  reviewOnlyItems: ReviewOnlyItem[]
  plans: Plan[]
  shippingOptions: ShippingOption[]
  reviewMetadata: ReviewMetadata
  initialConfiguration: InitialConfiguration
}
