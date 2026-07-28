import { BundleBuilder } from './components/BundleBuilder/BundleBuilder'
import { ReviewPanel } from './components/ReviewPanel/ReviewPanel'
import { useBundleBuilder } from './hooks/useBundleBuilder'

import styles from './App.module.css'

function App() {
  const bundleBuilder = useBundleBuilder()

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <BundleBuilder
          catalog={bundleBuilder.catalog}
          state={bundleBuilder.state}
          reviewSections={bundleBuilder.reviewSections}
          getDistinctSelectedCountByCategory={bundleBuilder.getDistinctSelectedCountByCategory}
          setActiveStep={bundleBuilder.setActiveStep}
          setActiveVariant={bundleBuilder.setActiveVariant}
          incrementQuantity={bundleBuilder.incrementQuantity}
          decrementQuantity={bundleBuilder.decrementQuantity}
          selectPlan={bundleBuilder.selectPlan}
        />

        <ReviewPanel
          catalog={bundleBuilder.catalog}
          reviewSections={bundleBuilder.reviewSections}
          shippingOption={bundleBuilder.shippingOption}
          totals={bundleBuilder.totals}
          saveMessage={bundleBuilder.saveMessage}
          onIncrement={bundleBuilder.incrementQuantity}
          onDecrement={bundleBuilder.decrementQuantity}
          onSave={bundleBuilder.saveForLater}
        />
      </div>
    </main>
  )
}

export default App
