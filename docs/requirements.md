# Assignment Requirements

## Goal

Build a React prototype for the EcomExperts bundle builder take-home. The app should recreate the provided Figma design as a production-quality, responsive, data-driven UI.

## Core Experience

- Build a two-column desktop layout with a bundle builder on the left and a live review panel on the right.
- On smaller screens, keep the experience usable and visually coherent down to phone sizes.
- Step 1, "Choose your cameras", is expanded on initial load.
- The builder is a four-step accordion:
  - Step 1: Choose your cameras
  - Step 2: Choose your plan
  - Step 3: Choose your sensors
  - Step 4: Add extra protection
- Each accordion header shows:
  - `STEP X OF 4`
  - An icon
  - The step title
  - A selected-count indicator
  - Up/down chevron based on expanded state
- Each expanded step ends with a `Next: ...` button that advances to the following step.

## Product Cards

- Render product cards from local JSON data.
- Each card may include:
  - Optional discount badge
  - Product image
  - Product title
  - Short description
  - `Learn More` link
  - Optional variant selector
  - Quantity stepper
  - Optional compare-at price
  - Active price
- Cards with quantity greater than zero use the selected visual state.
- Product-card markup must be reusable and data-driven.

## Variant Behavior

- Each product variant has its own independent quantity.
- The active variant determines which quantity the card stepper reads and edits.
- Switching variants must not erase or alter quantities on other variants.
- The review panel lists each selected variant as its own line item.
- Products without variants use the product ID as their selection key.

## Review Panel

- The review panel updates live from the same quantity state used by product cards.
- Selected items are grouped by:
  - Cameras
  - Sensors
  - Accessories
  - Plan
- Each review line includes:
  - Thumbnail
  - Name
  - Quantity stepper where applicable
  - Pricing
- The panel also includes:
  - Shipping row
  - Satisfaction-guarantee badge
  - Financing line
  - Total with compare-at total struck through
  - Savings callout
  - Checkout button
  - `Save my system for later` link

## State And Data

- Use a local JSON source for the catalog.
- Seed the initial state so the app loads matching the supplied design.
- Keep one source of truth for quantities.
- Do not store derived values in React state.
- Derive review items, selected counts, totals, and savings through pure selector functions.
- Use `useReducer` inside a focused custom hook for bundle state.
- Keep product-card and review-panel steppers synchronized through the same reducer state.

## Persistence

- `Save my system for later` must persist the shopper configuration with client-side storage.
- Reloading or returning to the page after saving should restore the configuration exactly.

## Accessibility

- Use semantic HTML.
- Use real buttons for interactive controls.
- Provide keyboard-accessible controls.
- Provide visible focus states.
- Add useful `aria` labels where visual-only controls need accessible names.

## Deliverable

- Public GitHub repository.
- React source code.
- Local JSON catalog data.
- Clear README run instructions.
- Short README notes covering decisions, tradeoffs, and unfinished work.
- The app must install, lint, build, and run from a clean clone.
