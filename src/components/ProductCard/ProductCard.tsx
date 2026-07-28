import { QuantityStepper } from '../QuantityStepper/QuantityStepper'
import { formatPrice } from '../../utils/formatCurrency'
import {
  selectActiveProductSelectionKey,
  selectActiveVariantId,
  selectQuantity,
} from '../../state/bundleSelectors'
import { createSelectionKey } from '../../state/bundleState'

import styles from './ProductCard.module.css'

import type { Product, VariantId } from '../../types/bundle'
import type { BundleState } from '../../state/bundleState'

type ProductCardProps = {
  product: Product
  state: BundleState
  onSelectVariant: (productId: string, variantId: VariantId) => void
  onIncrement: (selectionKey: string) => void
  onDecrement: (selectionKey: string) => void
}

export function ProductCard({
  product,
  state,
  onSelectVariant,
  onIncrement,
  onDecrement,
}: ProductCardProps) {
  const activeVariantId = selectActiveVariantId(state, product)
  const activeSelectionKey = selectActiveProductSelectionKey(state, product)
  const activeQuantity = activeSelectionKey ? selectQuantity(state, activeSelectionKey) : 0
  const isSelected = productHasQuantity(product, state)

  return (
    <article className={isSelected ? `${styles.card} ${styles.selected}` : styles.card}>
      <div className={styles.media}>
        <img className={styles.productImage} src={product.imagePath} alt="" />
        {product.discountLabel ? <span className={styles.badge}>{product.discountLabel}</span> : null}
      </div>

      <div className={styles.content}>
        <div className={styles.copy}>
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.description}>
            {product.description}{' '}
            <a className={styles.learnMore} href="#learn-more">
              {product.learnMoreLabel}
            </a>
          </p>
        </div>

        {product.variants ? (
          <div className={styles.variants} aria-label={`${product.name} color options`}>
            {product.variants.map((variant) => {
              const isActive = variant.id === activeVariantId

              return (
                <button
                  className={isActive ? `${styles.variant} ${styles.activeVariant}` : styles.variant}
                  type="button"
                  key={variant.id}
                  onClick={() => onSelectVariant(product.id, variant.id)}
                  aria-pressed={isActive}
                  aria-label={`Select ${variant.label} ${product.name}`}
                >
                  <img className={styles.variantImage} src={variant.thumbnailPath} alt="" />
                  <span>{variant.label}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        <div className={styles.actions}>
          <QuantityStepper
            quantity={activeQuantity}
            onIncrement={() => activeSelectionKey && onIncrement(activeSelectionKey)}
            onDecrement={() => activeSelectionKey && onDecrement(activeSelectionKey)}
            decrementDisabled={activeQuantity === 0}
            ariaLabel={`${product.name} quantity`}
          />
          <div className={styles.prices}>
            {product.compareAtPrice ? (
              <span className={styles.compareAt}>{formatPrice(product.compareAtPrice)}</span>
            ) : null}
            <span className={styles.activePrice}>{formatPrice(product.activePrice)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

const productHasQuantity = (product: Product, state: BundleState): boolean => {
  if (!product.variants) {
    return selectQuantity(state, product.id) > 0
  }

  return product.variants.some((variant) => {
    const selectionKey = createSelectionKey(product.id, variant.id)

    return selectQuantity(state, selectionKey) > 0
  })
}
