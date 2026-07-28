import styles from './AccordionStep.module.css'

import type { BundleStep } from '../../types/bundle'
import type { ReactNode } from 'react'

type AccordionStepProps = {
  step: BundleStep
  isOpen: boolean
  selectedCount: number
  chevronPath: string
  onOpen: () => void
  children: ReactNode
}

export function AccordionStep({
  step,
  isOpen,
  selectedCount,
  chevronPath,
  onOpen,
  children,
}: AccordionStepProps) {
  const bodyId = `${step.id}-body`

  return (
    <section className={isOpen ? `${styles.step} ${styles.open}` : styles.step}>
      <div className={styles.eyebrow}>{step.eyebrowLabel}</div>
      <button
        className={styles.header}
        type="button"
        onClick={onOpen}
        aria-expanded={isOpen}
        aria-controls={bodyId}
      >
        <span className={styles.headingGroup}>
          <img className={styles.icon} src={step.iconPath} alt="" />
          <span className={styles.title}>{step.title}</span>
        </span>
        <span className={styles.meta}>
          {selectedCount > 0 ? <span>{selectedCount} selected</span> : null}
          <img className={styles.chevron} src={chevronPath} alt="" />
        </span>
      </button>
      {isOpen ? (
        <div className={styles.body} id={bodyId}>
          {children}
        </div>
      ) : null}
    </section>
  )
}
