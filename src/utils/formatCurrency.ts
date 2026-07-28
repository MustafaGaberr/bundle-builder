import type { Price } from '../types/bundle'

export const formatCurrency = (amountCents: number): string => {
  if (amountCents === 0) {
    return 'FREE'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100)
}

export const formatPrice = (price: Price): string => {
  const formattedPrice = formatCurrency(price.amountCents)

  if (price.billingPeriod === 'monthly' && price.amountCents > 0) {
    return `${formattedPrice}/mo`
  }

  return formattedPrice
}
