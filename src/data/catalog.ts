import rawBundleCatalog from './bundle.json' with { type: 'json' }

import type { BundleCatalog } from '../types/bundle'

const rawCatalog: BundleCatalog = rawBundleCatalog

const assetUrls = import.meta.glob<string>(
  [
    '../assets/badges/**/*.{png,svg}',
    '../assets/icons/**/*.{png,svg}',
    '../assets/products/**/*.{png,svg}',
    '../assets/variants/**/*.{png,svg}',
  ],
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
)

const toGlobKey = (assetPath: string): string => assetPath.replace(/^src\/assets\//, '../assets/')

const resolveAssetPath = (assetPath: string): string => {
  const assetUrl = assetUrls[toGlobKey(assetPath)]

  if (!assetUrl) {
    throw new Error(`Catalog asset could not be resolved: ${assetPath}`)
  }

  return assetUrl
}

export const catalog: BundleCatalog = {
  ...rawCatalog,
  steps: rawCatalog.steps.map((step) => ({
    ...step,
    iconPath: resolveAssetPath(step.iconPath),
  })),
  products: rawCatalog.products.map((product) => ({
    ...product,
    imagePath: resolveAssetPath(product.imagePath),
    variants: product.variants?.map((variant) => ({
      ...variant,
      thumbnailPath: resolveAssetPath(variant.thumbnailPath),
    })),
  })),
  reviewOnlyItems: rawCatalog.reviewOnlyItems.map((item) => ({
    ...item,
    imagePath: resolveAssetPath(item.imagePath),
  })),
  plans: rawCatalog.plans.map((plan) => ({
    ...plan,
    logoPath: resolveAssetPath(plan.logoPath),
  })),
  shippingOptions: rawCatalog.shippingOptions.map((shippingOption) => ({
    ...shippingOption,
    iconPath: resolveAssetPath(shippingOption.iconPath),
  })),
  reviewMetadata: {
    ...rawCatalog.reviewMetadata,
    satisfactionGuaranteeBadgePath: resolveAssetPath(
      rawCatalog.reviewMetadata.satisfactionGuaranteeBadgePath,
    ),
  },
}
