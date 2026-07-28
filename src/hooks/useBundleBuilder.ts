import { useReducer, useState } from 'react'

import { catalog } from '../data/catalog'
import { createBundleReducer } from '../state/bundleReducer'
import {
  createInitialBundleState,
  createSelectionKey,
  type BundleState,
} from '../state/bundleState'
import {
  selectBundleTotals,
  selectDistinctSelectedProductCountByCategory,
  selectReviewSections,
  selectShippingOption,
} from '../state/bundleSelectors'

import type { ProductId, SelectionKey, StepId, VariantId } from '../types/bundle'

const STORAGE_KEY = 'bundle-builder:bundle-state:v1'

const bundleReducer = createBundleReducer(catalog)

type StoredBundleState = {
  activeStepId?: unknown
  activeVariantByProduct?: unknown
  quantities?: unknown
  selectedPlanId?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const restoreBundleState = (): BundleState => {
  const initialState = createInitialBundleState(catalog)

  if (typeof window === 'undefined') {
    return initialState
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  if (!storedValue) {
    return initialState
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)

    if (!isRecord(parsedValue)) {
      return initialState
    }

    const storedState: StoredBundleState = parsedValue
    let restoredState = initialState

    if (storedState.activeStepId === null || typeof storedState.activeStepId === 'string') {
      restoredState = bundleReducer(restoredState, {
        type: 'set-active-step',
        stepId: storedState.activeStepId,
      })
    }

    if (typeof storedState.selectedPlanId === 'string') {
      restoredState = bundleReducer(restoredState, {
        type: 'select-plan',
        planId: storedState.selectedPlanId,
      })
    }

    if (isRecord(storedState.activeVariantByProduct)) {
      for (const [productId, variantId] of Object.entries(storedState.activeVariantByProduct)) {
        if (typeof variantId !== 'string') {
          continue
        }

        restoredState = bundleReducer(restoredState, {
          type: 'set-active-variant',
          productId,
          variantId,
        })
      }
    }

    if (isRecord(storedState.quantities)) {
      for (const [selectionKey, quantity] of Object.entries(storedState.quantities)) {
        if (typeof quantity !== 'number') {
          continue
        }

        restoredState = bundleReducer(restoredState, {
          type: 'set-quantity',
          selectionKey,
          quantity,
        })
      }
    }

    return restoredState
  } catch {
    return initialState
  }
}

export const useBundleBuilder = () => {
  const [state, dispatch] = useReducer(bundleReducer, undefined, restoreBundleState)
  const [saveMessage, setSaveMessage] = useState('')

  const reviewSections = selectReviewSections(catalog, state)
  const totals = selectBundleTotals(catalog, state)
  const shippingOption = selectShippingOption(catalog)

  const getDistinctSelectedCountByCategory = (categoryId: string): number => {
    if (categoryId === 'sensors') {
      return reviewSections.sensors.length
    }

    if (categoryId === 'extra-protection') {
      return reviewSections.accessories.length
    }

    if (categoryId === 'plan') {
      return reviewSections.plan.length
    }

    return selectDistinctSelectedProductCountByCategory(catalog, state, categoryId)
  }

  const setActiveStep = (stepId: StepId | null): void => {
    dispatch({ type: 'set-active-step', stepId })
  }

  const setActiveVariant = (productId: ProductId, variantId: VariantId): void => {
    dispatch({ type: 'set-active-variant', productId, variantId })
  }

  const incrementQuantity = (selectionKey: SelectionKey): void => {
    dispatch({ type: 'increment-quantity', selectionKey })
  }

  const decrementQuantity = (selectionKey: SelectionKey): void => {
    dispatch({ type: 'decrement-quantity', selectionKey })
  }

  const selectPlan = (planId: string): void => {
    dispatch({ type: 'select-plan', planId })
  }

  const saveForLater = (): void => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    setSaveMessage('Saved')
    window.setTimeout(() => setSaveMessage(''), 1800)
  }

  return {
    catalog,
    state,
    reviewSections,
    totals,
    shippingOption,
    saveMessage,
    createSelectionKey,
    getDistinctSelectedCountByCategory,
    setActiveStep,
    setActiveVariant,
    incrementQuantity,
    decrementQuantity,
    selectPlan,
    saveForLater,
  }
}
