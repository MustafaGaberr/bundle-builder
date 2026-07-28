import styles from './QuantityStepper.module.css'

type QuantityStepperProps = {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  decrementDisabled?: boolean
  ariaLabel: string
  compact?: boolean
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  decrementDisabled = false,
  ariaLabel,
  compact = false,
}: QuantityStepperProps) {
  const stepperClassName = [styles.stepper, compact ? styles.compact : ''].filter(Boolean).join(' ')

  return (
    <div className={stepperClassName} aria-label={ariaLabel}>
      <button
        className={`${styles.button} ${styles.decrementButton}`}
        type="button"
        onClick={onDecrement}
        disabled={decrementDisabled}
        aria-label={`Decrease ${ariaLabel}`}
      >
        <span className={`${styles.icon} ${styles.minusIcon}`} aria-hidden="true" />
      </button>
      <span className={styles.quantity} aria-live="polite">
        {quantity}
      </span>
      <button
        className={`${styles.button} ${styles.incrementButton}`}
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${ariaLabel}`}
      >
        <span className={`${styles.icon} ${styles.plusIcon}`} aria-hidden="true" />
      </button>
    </div>
  )
}
