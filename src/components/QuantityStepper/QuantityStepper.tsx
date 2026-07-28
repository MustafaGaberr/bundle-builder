import minusPath from '../../assets/icons/minus.svg'
import plusPath from '../../assets/icons/plus.svg'
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
  return (
    <div
      className={compact ? `${styles.stepper} ${styles.compact}` : styles.stepper}
      aria-label={ariaLabel}
    >
      <button
        className={styles.button}
        type="button"
        onClick={onDecrement}
        disabled={decrementDisabled}
        aria-label={`Decrease ${ariaLabel}`}
      >
        <img src={minusPath} alt="" aria-hidden="true" />
      </button>
      <span className={styles.quantity} aria-live="polite">
        {quantity}
      </span>
      <button
        className={styles.button}
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${ariaLabel}`}
      >
        <img src={plusPath} alt="" aria-hidden="true" />
      </button>
    </div>
  )
}
