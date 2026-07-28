# Bundle Builder Take-Home

A responsive React implementation of the EcomExperts Bundle Builder take-home. The app recreates the provided Wyze bundle-building flow with a data-driven catalog, synchronized review panel, reducer-backed state, local Figma assets, and explicit save/restore behavior.

## Features

- Four-step accessible accordion for cameras, plan, sensors, and extra protection.
- Data-driven product catalog backed by local JSON and typed TypeScript models.
- Independent quantities for each product variant using stable selection keys.
- Synchronized review panel with grouped Cameras, Sensors, Accessories, and Plan sections, plus a separate Shipping row.
- Distinct selected-product counts in accordion headers rather than unit totals.
- One-time and monthly pricing displayed and calculated separately.
- Minimum required quantity enforcement for the Wyze Sense Hub.
- Responsive desktop/mobile layout based on the supplied Figma references.
- Explicit `localStorage` save and restore via "Save my system for later".

## Tech Stack

- React
- TypeScript
- Vite
- CSS Modules
- `useReducer`
- Local JSON catalog

## Run Locally

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Architecture

The catalog layer lives in `src/data/bundle.json` and is loaded through `src/data/catalog.ts`, where readable local asset paths are resolved into bundled Vite asset URLs. Product data, accordion steps, review-only items, plans, shipping, metadata, and the initial configuration all come from the local catalog.

Bundle state is intentionally small: active step, active variant per product, source-of-truth quantities, and selected plan. The reducer validates step IDs, plan IDs, product variants, selection keys, and minimum quantities before applying updates.

Derived values are kept out of React state. Pure selectors build review sections, selected counts, pricing totals, savings, active product selection keys, and shipping data from the catalog plus reducer state.

`useBundleBuilder` is the focused integration point for React. It owns the reducer, exposes action helpers, derives selector results for rendering, and handles explicit save and restore from versioned `localStorage`.

The component structure is split by responsibility:

- `BundleBuilder` renders the accordion and builder content.
- `AccordionStep` handles step headers, expanded-state markup, and accessibility attributes.
- `ProductCard` renders catalog-driven camera cards and variant controls.
- `QuantityStepper` provides shared quantity controls.
- `ReviewPanel` renders synchronized review groups, totals, savings, checkout, and save controls.

All product images, variant thumbnails, icons, logos, and badges are local assets exported from the provided Figma reference.

## Important Behavior

Variant quantities remain independent. For products with variants, selection keys use `productId::variantId`; products without variants use the product ID directly.

Review steppers update the exact selected line item, so changing a review quantity updates the same source-of-truth quantity used by the product card.

The Wyze Sense Hub is required and cannot be reduced below one. The reducer enforces this rule across builder controls, review controls, and restored saved state.

`N selected` counts distinct selected products or items in each category, not total units. For example, two Wyze Cam Pan v3 units still count as one selected camera product.

Monthly plan totals are not combined with one-time hardware, accessory, or shipping totals. The review panel displays one-time and monthly totals separately.

## Responsive Behavior

Desktop Frame 1735 is the authoritative visual reference for layout, proportions, spacing, and visual hierarchy. The desktop layout uses the intended two-column composition with the builder beside the review panel.

Tablet behavior is treated as responsive guidance rather than a pixel-perfect target. Breakpoints are chosen around content needs so cards, controls, and prices remain readable.

On narrow screens, the layout stacks into a single column and moves the review panel below the builder. Product cards become one column, with no horizontal overflow at phone widths.

## Tradeoffs And Remaining Work

- No backend or API integration was added because it was optional for the prototype.
- Checkout is intentionally a placeholder button.
- No automated test suite was added under the submission deadline; validation used linting, a production build, and manual browser interaction checks.
- Proprietary Gilroy font files are not included. The CSS uses a Gilroy-first local and system fallback stack.

AI-assisted development tools were used for design inspection, scoped implementation support, and review, while the final architecture, validation, and submission decisions were manually reviewed and owned by the candidate.
