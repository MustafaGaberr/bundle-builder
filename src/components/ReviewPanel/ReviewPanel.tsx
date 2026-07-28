import { useState } from 'react'

import { QuantityStepper } from '../QuantityStepper/QuantityStepper'
import { formatCurrency, formatPrice } from '../../utils/formatCurrency'

import styles from './ReviewPanel.module.css'

import type { BundleCatalog, ShippingOption } from '../../types/bundle'
import type { BundleTotals, ReviewLine, ReviewSections } from '../../state/bundleSelectors'

type ReviewPanelProps = {
  catalog: BundleCatalog
  reviewSections: ReviewSections
  shippingOption?: ShippingOption
  totals: BundleTotals
  saveMessage: string
  onIncrement: (selectionKey: string) => void
  onDecrement: (selectionKey: string) => void
  onSave: () => void
}

export function ReviewPanel({
  catalog,
  reviewSections,
  shippingOption,
  totals,
  saveMessage,
  onIncrement,
  onDecrement,
  onSave,
}: ReviewPanelProps) {
  const [checkoutMessage, setCheckoutMessage] = useState('')

  const confirmCheckout = (): void => {
    setCheckoutMessage('Order confirmed. Secure payment is the next step.')
  }

  return (
    <aside className={styles.panel} aria-label="Bundle review">
      <div className={styles.eyebrow}>Review</div>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2>Your security system</h2>
          <p>Review your personalized protection system designed to keep what matters most safe.</p>
        </header>

        <div className={styles.sections}>
          <ReviewSection
            label="Cameras"
            lines={reviewSections.cameras}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
          <ReviewSection
            label="Sensors"
            lines={reviewSections.sensors}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
          <ReviewSection
            label="Accessories"
            lines={reviewSections.accessories}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
          <ReviewSection
            label="Plan"
            lines={reviewSections.plan}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />

          {shippingOption ? <ShippingRow shippingOption={shippingOption} /> : null}
        </div>

        <div className={styles.summary}>
          <img
            className={styles.badge}
            src={catalog.reviewMetadata.satisfactionGuaranteeBadgePath}
            alt="Satisfaction guarantee"
          />
          <div className={styles.totals}>
            <span className={styles.financing}>{catalog.reviewMetadata.financingLabel}</span>
            <div className={styles.totalRow} aria-label="One-time total">
              <span className={styles.totalPrices}>
                <span className={styles.totalCompareAt}>
                  {formatCurrency(totals.oneTimeCompareAtTotalCents)}
                </span>
                <span className={styles.totalActive}>
                  {formatCurrency(totals.oneTimeActiveTotalCents)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <p className={styles.savings}>
          Congrats! You are saving {formatCurrency(totals.oneTimeSavingsCents)} today and{' '}
          {formatCurrency(totals.monthlyPlanSavingsCents)}/mo.
        </p>

        <button className={styles.checkout} type="button" onClick={confirmCheckout}>
          {catalog.reviewMetadata.checkoutLabel}
        </button>
        <button className={styles.save} type="button" onClick={onSave}>
          {catalog.reviewMetadata.saveForLaterLabel}
        </button>
        <div className={styles.checkoutMessage} role="status" aria-live="polite">
          {checkoutMessage}
        </div>
        <div className={styles.saveMessage} role="status" aria-live="polite">
          {saveMessage}
        </div>
      </div>
    </aside>
  )
}

type ReviewSectionProps = {
  label: string
  lines: ReviewLine[]
  onIncrement: (selectionKey: string) => void
  onDecrement: (selectionKey: string) => void
}

function ReviewSection({ label, lines, onIncrement, onDecrement }: ReviewSectionProps) {
  if (lines.length === 0) {
    return null
  }

  const selectedVariantCountByProduct = getSelectedVariantCountByProduct(lines)

  return (
    <section className={styles.reviewSection}>
      <h3>{label}</h3>
      <div className={styles.reviewLines}>
        {lines.map((line) => (
          <ReviewLineRow
            key={line.id}
            line={line}
            showVariantLabel={Boolean(
              line.variantLabel && (selectedVariantCountByProduct[line.sourceItemId] ?? 0) > 1,
            )}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        ))}
      </div>
    </section>
  )
}

type ReviewLineRowProps = {
  line: ReviewLine
  showVariantLabel: boolean
  onIncrement: (selectionKey: string) => void
  onDecrement: (selectionKey: string) => void
}

function ReviewLineRow({ line, showVariantLabel, onIncrement, onDecrement }: ReviewLineRowProps) {
  const showQuantityControls = line.categoryId !== 'plan'
  const compareAtPrice = line.compareAtUnitPrice ?? line.activeUnitPrice
  const compareAtLineTotal = compareAtPrice.amountCents * line.quantity
  const activeLineTotal = line.activeUnitPrice.amountCents * line.quantity
  const minimumQuantity = line.minimumQuantity ?? 0
  const compareAtLabel = formatLinePrice(compareAtLineTotal, line.activeUnitPrice.billingPeriod)
  const activeLabel = formatLinePrice(activeLineTotal, line.activeUnitPrice.billingPeriod)
  const quantityControlLabel = line.variantLabel
    ? `${line.name} ${line.variantLabel} quantity`
    : `${line.name} quantity`

  return (
    <div className={line.categoryId === 'plan' ? `${styles.reviewLine} ${styles.planLine}` : styles.reviewLine}>
      <div className={styles.itemMain}>
        <div className={line.categoryId === 'plan' ? `${styles.thumbnail} ${styles.planThumbnail}` : styles.thumbnail}>
          <img src={line.imageUrl} alt="" />
        </div>
        <div className={styles.itemText}>
          <p>{line.name}</p>
          {showVariantLabel ? <span>{line.variantLabel}</span> : null}
          {line.required ? <span>Required</span> : null}
        </div>
      </div>

      {showQuantityControls ? (
        <QuantityStepper
          quantity={line.quantity}
          onIncrement={() => onIncrement(line.selectionKey)}
          onDecrement={() => onDecrement(line.selectionKey)}
          decrementDisabled={line.quantity <= minimumQuantity}
          ariaLabel={quantityControlLabel}
          compact
        />
      ) : null}

      <div className={styles.linePrice}>
        {compareAtLineTotal !== activeLineTotal ? (
          <span className={styles.lineCompareAt}>{compareAtLabel}</span>
        ) : null}
        <span className={styles.lineActive}>{activeLabel}</span>
      </div>
    </div>
  )
}

const getSelectedVariantCountByProduct = (lines: ReviewLine[]): Partial<Record<string, number>> => {
  const selectedVariantCountByProduct: Partial<Record<string, number>> = {}

  for (const line of lines) {
    if (!line.variantLabel) {
      continue
    }

    selectedVariantCountByProduct[line.sourceItemId] = (selectedVariantCountByProduct[line.sourceItemId] ?? 0) + 1
  }

  return selectedVariantCountByProduct
}

function formatLinePrice(amountCents: number, billingPeriod: ReviewLine['activeUnitPrice']['billingPeriod']): string {
  const formattedPrice = formatCurrency(amountCents)

  if (billingPeriod === 'monthly' && amountCents > 0) {
    return `${formattedPrice}/mo`
  }

  return formattedPrice
}

function ShippingRow({ shippingOption }: { shippingOption: ShippingOption }) {
  return (
    <section className={styles.reviewSection}>
      <div className={`${styles.reviewLine} ${styles.shippingLine}`}>
        <div className={styles.itemMain}>
          <div className={styles.thumbnail}>
            <img src={shippingOption.iconPath} alt="" />
          </div>
          <div className={styles.itemText}>
            <p>{shippingOption.name}</p>
          </div>
        </div>
        <div className={styles.linePrice}>
          <span className={styles.lineCompareAt}>{formatPrice(shippingOption.compareAtPrice)}</span>
          <span className={styles.lineActive}>{formatPrice(shippingOption.activePrice)}</span>
        </div>
      </div>
    </section>
  )
}
