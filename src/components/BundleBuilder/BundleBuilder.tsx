import { AccordionStep } from '../AccordionStep/AccordionStep'
import { ProductCard } from '../ProductCard/ProductCard'
import { QuantityStepper } from '../QuantityStepper/QuantityStepper'
import { formatPrice } from '../../utils/formatCurrency'

import chevronDownPath from '../../assets/icons/chevron-down.svg'
import chevronUpPath from '../../assets/icons/chevron-up.svg'
import styles from './BundleBuilder.module.css'

import type { BundleCatalog, ProductId, SelectionKey, VariantId } from '../../types/bundle'
import type { BundleState } from '../../state/bundleState'
import type { ReviewSections } from '../../state/bundleSelectors'

type BundleBuilderProps = {
  catalog: BundleCatalog
  state: BundleState
  reviewSections: ReviewSections
  getDistinctSelectedCountByCategory: (categoryId: string) => number
  setActiveStep: (stepId: string) => void
  setActiveVariant: (productId: ProductId, variantId: VariantId) => void
  incrementQuantity: (selectionKey: SelectionKey) => void
  decrementQuantity: (selectionKey: SelectionKey) => void
  selectPlan: (planId: string) => void
}

export function BundleBuilder({
  catalog,
  state,
  reviewSections,
  getDistinctSelectedCountByCategory,
  setActiveStep,
  setActiveVariant,
  incrementQuantity,
  decrementQuantity,
  selectPlan,
}: BundleBuilderProps) {
  const sortedSteps = [...catalog.steps].sort((firstStep, secondStep) => firstStep.order - secondStep.order)

  const goToNextStep = (currentStepId: string): void => {
    const currentIndex = sortedSteps.findIndex((step) => step.id === currentStepId)
    const nextStep = sortedSteps[currentIndex + 1]

    if (nextStep) {
      setActiveStep(nextStep.id)
    }
  }

  return (
    <div className={styles.builder}>
      {sortedSteps.map((step) => {
        const isOpen = state.activeStepId === step.id

        return (
          <AccordionStep
            key={step.id}
            step={step}
            isOpen={isOpen}
            selectedCount={getDistinctSelectedCountByCategory(step.categoryId)}
            chevronPath={isOpen ? chevronUpPath : chevronDownPath}
            onOpen={() => setActiveStep(step.id)}
          >
            {step.categoryId === 'cameras' ? (
              <CameraStep
                catalog={catalog}
                state={state}
                onSelectVariant={setActiveVariant}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
              />
            ) : null}
            {step.categoryId === 'plan' ? (
              <PlanStep catalog={catalog} selectedPlanId={state.selectedPlanId} onSelectPlan={selectPlan} />
            ) : null}
            {step.categoryId === 'sensors' ? (
              <SummaryStep
                title="Included sensors"
                lines={reviewSections.sensors}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
              />
            ) : null}
            {step.categoryId === 'extra-protection' ? (
              <SummaryStep
                title="Extra protection"
                lines={reviewSections.accessories}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
              />
            ) : null}

            {step.nextStepLabel ? (
              <div className={styles.nextWrap}>
                <button className={styles.nextButton} type="button" onClick={() => goToNextStep(step.id)}>
                  {step.nextStepLabel}
                </button>
              </div>
            ) : null}
          </AccordionStep>
        )
      })}
    </div>
  )
}

type CameraStepProps = {
  catalog: BundleCatalog
  state: BundleState
  onSelectVariant: (productId: ProductId, variantId: VariantId) => void
  onIncrement: (selectionKey: SelectionKey) => void
  onDecrement: (selectionKey: SelectionKey) => void
}

function CameraStep({
  catalog,
  state,
  onSelectVariant,
  onIncrement,
  onDecrement,
}: CameraStepProps) {
  return (
    <div className={styles.productGrid}>
      {catalog.products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          state={state}
          onSelectVariant={onSelectVariant}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      ))}
    </div>
  )
}

type PlanStepProps = {
  catalog: BundleCatalog
  selectedPlanId: string
  onSelectPlan: (planId: string) => void
}

function PlanStep({ catalog, selectedPlanId, onSelectPlan }: PlanStepProps) {
  return (
    <div className={styles.optionList}>
      {catalog.plans.map((plan) => (
        <button
          key={plan.id}
          className={plan.id === selectedPlanId ? `${styles.optionCard} ${styles.optionSelected}` : styles.optionCard}
          type="button"
          onClick={() => onSelectPlan(plan.id)}
          aria-pressed={plan.id === selectedPlanId}
        >
          <span className={styles.optionMain}>
            <img className={styles.optionIcon} src={plan.logoPath} alt="" />
            <span>
              <strong>{plan.name}</strong>
              <span>Unlimited camera cloud protection is selected for this bundle.</span>
            </span>
          </span>
          <span className={styles.optionPrice}>
            <span>{formatPrice(plan.compareAtPrice)}</span>
            <strong>{formatPrice(plan.activePrice)}</strong>
          </span>
        </button>
      ))}
    </div>
  )
}

type SummaryStepProps = {
  title: string
  lines: ReviewSections['sensors']
  onIncrement: (selectionKey: SelectionKey) => void
  onDecrement: (selectionKey: SelectionKey) => void
}

function SummaryStep({ title, lines, onIncrement, onDecrement }: SummaryStepProps) {
  return (
    <div className={styles.summaryStep}>
      <h3>{title}</h3>
      {lines.length > 0 ? (
        <div className={styles.summaryRows}>
          {lines.map((line) => {
            const minimumQuantity = line.minimumQuantity ?? 0

            return (
              <div className={styles.summaryRow} key={line.id}>
                <span className={styles.summaryItem}>
                  <img src={line.imageUrl} alt="" />
                  <span>
                    <strong>{line.name}</strong>
                    {line.required ? <small>Required</small> : null}
                  </span>
                </span>
                <QuantityStepper
                  quantity={line.quantity}
                  onIncrement={() => onIncrement(line.selectionKey)}
                  onDecrement={() => onDecrement(line.selectionKey)}
                  decrementDisabled={line.quantity <= minimumQuantity}
                  ariaLabel={`${line.name} quantity`}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <p className={styles.emptyText}>No extra items are selected yet.</p>
      )}
    </div>
  )
}
