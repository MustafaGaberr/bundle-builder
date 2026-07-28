# Implementation Plan

## 1. Design Analysis And Asset Inventory

- Review the desktop, tablet, and mobile references for layout, spacing, typography, color, and interaction states.
- Inventory product imagery, icons, badges, and review-panel assets.
- Use original product assets where available; do not use screenshots as UI backgrounds.

## 2. Data Model And Typed Catalog

- Define simple React and TypeScript-friendly types for steps, products, variants, categories, and prices.
- Create a local JSON catalog that drives accordion steps, product cards, review groups, and seeded initial selections.
- Use a composite product-and-variant key, such as productId::variantId, for products with variants.
- Use product IDs as selection keys for products without variants.

## 3. State Management And Pure Selectors

- Manage bundle state with `useReducer` inside a focused custom hook.
- Keep one source of truth for quantities, keyed by product or variant selection key.
- Track active variants separately from quantities.
- Derive selected counts, review lines, totals, savings, and selected card states with pure selector functions.
- Avoid storing derived values in React state.

## 4. Component Implementation

- Build the accordion, product cards, variant selectors, quantity steppers, and review panel from catalog data.
- Keep product-card and review-panel steppers synchronized through the same reducer state.
- Keep components focused without excessive splitting.
- Use Context only if prop passing becomes meaningfully noisy.

## 5. Responsive Styling And Accessibility

- Implement styling with CSS Modules and global design tokens.
- Match the desktop design closely while keeping tablet and mobile layouts usable.
- Use semantic HTML, keyboard-accessible buttons, visible focus states, and clear `aria` labels.
- Ensure text, controls, and prices do not overlap or clip at supported viewport sizes.

## 6. Persistence

- Implement `Save my system for later` with `localStorage`.
- Save the current configuration explicitly when the shopper clicks the save link.
- Restore saved quantities, active variants, and accordion state on a return visit.

## 7. Testing, Verification, And Documentation

- Run `npm run lint`.
- Run `npm run build`.
- Manually verify accordion navigation, variant-specific quantities, synchronized steppers, total recalculation, persistence, and responsive layouts.
- Update the README with install/run instructions, implementation decisions, tradeoffs, and any remaining issues.
