# Bundle Builder Design Spec

## Figma frames inspected

- Desktop authority: `Frame 1735`, node `68:9663`, 1440 x 1077.
- Tablet guidance: `Frame 1736`, node `70:14135`, 1440 x 1606.
- Mobile reference: `iPhone 13 & 14 - 35`, node `74:19845`, 390 x 1252.

## Design authority and intentional differences

- Desktop `Frame 1735` is the implementation authority. Match its layout, spacing, proportions, typography, colors, borders, radii, and component states as closely as possible.
- The tablet frame is responsive guidance only. Do not reproduce tablet product-image sizes or product-card alignment pixel-perfectly; they are inconsistent with the desktop authority.
- The mobile frame is a responsive visual reference. It defines the stacked order and compact accordion/review behavior, but desktop remains the source for component styling.
- Written interaction requirements override static screenshots: Step 1 must be open on initial load, and Step 1's Next button must advance to `Choose your plan`.
- The target project should express the design with React, TypeScript, CSS Modules, and CSS design tokens. Do not paste generated Tailwind reference code.

## Desktop layout

- Page frame: 1440 x 1077, white background.
- Main top offset: about 49 px.
- Left page margin to builder: 122 px.
- Right page margin after review panel: 122 px.
- Builder width: 768 px.
- Review panel outer width: 399 px.
- Column gap between builder and review: 29 px.
- Builder x/y: 122 / 49.36.
- Review x/y: 919 / 49.4.

## Builder accordion

- Builder stack width: 768 px, height: 978 px.
- Step 1 open section: 768 x 695.
- Step 1 eyebrow row: x 0, y 15, width 768, height 12, inner text x 15.
- Step 1 open body: x 0, y 32, width 768, height 663.
- Step 1 body padding: 15 px horizontal, 20 px top before title row.
- Step title row: 738 x 26, icon 26 x 26, 8 px gap to title, selected count block 83 x 16.
- Open body background: light blue `#EDF4FF`.
- Open accordion radius: 10 px at the outer blue container.
- Closed steps: full width 768 px; Step 2 is 82 px high, Steps 3 and 4 are about 81 px high.
- Closed step label row: 10 px high with 15 px horizontal inset.
- Closed step body: about 66-67 px high, 15 px horizontal padding, 20 px vertical title placement.
- Closed step borders: 0.5 px top and bottom, `#1F1F1F`.
- Closed step icon sizes: 26 x 26 or 26 x 27.
- Accordion vertical gaps: about 13 px between desktop sections.
- Chevron icons: 12 x 12; open uses carrot-up, closed uses carrot-down.

## Product-card grid

- Product grid container: x 15, y 61, width 738, height 347.
- Grid columns: 2 columns at 361.5 px each.
- Column gap: 15 px.
- Row gap: 15 px.
- Row 1 card size: 361.5 x 159.
- Row 2 card size: 361.5 x 173.
- Fifth centered card: x 204, y 423, width 360, height 166.
- Card background: white.
- Card radius: 10 px.
- Card padding: 11 px.
- Horizontal card content gap: 13 px.
- Primary product image area in two-column cards: about 101 x 137 for top-row cards.
- Square product images: 101 x 101 for doorbell and battery camera.
- Text column width: generally 205 px to 219.5 px.
- Product title: 16 px, Gilroy SemiBold, `#1F1F1F`, 16 px line box unless wrapped.
- Product description: 12 px, Gilroy Medium, `rgba(31,31,31,0.75)`, 1.3 line-height.
- Learn More link: blue, underlined.
- Discount badge: purple pill, about 63-65 x 19, 6 px horizontal text inset, 10-11 px text.

## Variant chips

- Chip component name in Figma: `Label paints`.
- Standard chip size: 65 x 26; one grey chip is 63 x 26.
- Chip border: 0.5 px `#CCCCCC`.
- Chip radius: 2 px.
- Chip padding: 1 px vertical with 3-5 px horizontal depending on thumbnail width.
- Thumbnail sizes: 22 x 22, 23 x 22, 24 x 25, or 28 x 28 depending on product variant asset.
- Chip label: 10 px Gilroy Medium, `#1F1F1F`, 0.6 px letter spacing, single line.
- Use a composite product-and-variant selection key, such as `productId::variantId`, so each variant has an independent quantity without ID collisions.

## Quantity steppers

- Builder product-card stepper container: usually 80 px wide and 28-35 px high.
- Button size: 20 x 20.
- Icon size: minus 8 x 9.6, plus 8 x 8.
- Quantity text: 16 px Gilroy Medium, `#0B0D10`, 20 px line-height.
- Builder minus button: white background with `#E6EBF0` border when shown in the product cards.
- Builder plus button: `#F0F4F7` background.
- Review stepper container: 72 x 28.
- Review stepper buttons: 20 x 20, white background, 4 px radius.
- Required/locked review item controls: `#F1F1F2` background, 1 px `#CED6DE` border, 4 px radius.
- Disabled or locked controls should remain keyboard focusable only if they perform an action; otherwise expose disabled semantics.

## Review panel

- Outer review panel: x 919, y 49.4, width 399, height 855, background `#EDF4FF`, radius 10.
- Review eyebrow row: y 15, width 399, height 12, 15 px horizontal inset.
- Inner review content frame: x 0, y 32, width 390, height 823.
- Inner padding: 20 px left/right, 20 px top, 31 px bottom.
- Review content width: 350 px.
- Review header group: 350 x 63, 5 px gap.
- Review title: 22 px Gilroy SemiBold, `#1F1F1F`.
- Review description: 14 px Gilroy Medium, `rgba(31,31,31,0.75)`, 1.3 line-height.
- Review item section border: 1 px top border `#CED6DE`.
- Review section label: 12 px Gilroy Regular, uppercase, `#A8B2BD`, 0.36 px letter spacing, 16 px line-height.
- Review item row image: 41 x 41, white background, 5 px radius.
- Review item name: 14 px Gilroy Medium, `#0B0D10`, 16 px line-height.
- Review price text: 14 px; old price `#6F7882` with line-through, current price `#4E2FD2` Gilroy SemiBold.
- Plan row uses the home monitoring logo at 20 x 23.7 on desktop review.
- Fast shipping row uses a 41 x 41 white tile with delivery icon about 29 x 29.
- Satisfaction badge: 78 x 78 in desktop review.
- Monthly payment pill: 113 x 18, purple background, white text.
- Total row: old total 60 x 20, new total 77 x 32.
- Savings message: 350 x 12, green text.
- Checkout button: 350 x 48, purple background, white label.
- Save-for-later link: 350 x 17, underlined, centered.

## Typography

- Primary typeface used in the Figma reference: Gilroy.
- Weights observed: Regular, Medium, SemiBold.
- Step eyebrow: 10-12 px Gilroy Medium, uppercase, `#484848`, 1.6 px letter spacing.
- Accordion titles: 22 px Gilroy SemiBold on desktop, 18 px on mobile, `#0B0D10`.
- Tablet suggested accordion title: 28 px line box in the wide tablet frame.
- Product title: 16 px Gilroy SemiBold.
- Product body copy: 12 px Gilroy Medium, 1.3 line-height.
- Variant chip label: 10 px Gilroy Medium, 0.6 px letter spacing.
- Quantity text: 16 px Gilroy Medium in cards; 14 px Gilroy SemiBold in review.
- Review panel title: 22 px Gilroy SemiBold.
- Review item labels and prices: 14 px, 16 px line-height.
- Primary button label: 18 px Gilroy SemiBold, 24 px line-height.
- Do not commit proprietary font files.
- Use Gilroy only if it is available through a properly licensed source.
- Otherwise use a close system fallback stack and document the limitation in the README.

## Colors

- `Gray-C/Obsidian`: `#0B0D10`.
- `Gray-C/White`, `utility/white`: `#FFFFFF`.
- `Gray-C/500`: `#A8B2BD`.
- `Gray-C/600`: `#6F7882`.
- `Gray-C/700`: `#525963`.
- `Gray-C/400`: `#CED6DE`.
- `Gray-C/300`: `#E6EBF0`.
- `Gray-C/200`: `#F0F4F7`.
- `utility/gray-70`: `#575757`.
- `New/CP-CPP/Purple 01`, `core/wyze purple`, `Old/CP-CPP/Purple 01`: `#4E2FD2`.
- Body heading dark: `#1F1F1F`.
- Body secondary: `rgba(31,31,31,0.75)`.
- Product old sale price red: `#D8392B`.
- Chip border: `#CCCCCC`.
- Open panel surface: `#EDF4FF`.
- Required disabled control surface: `#F1F1F2`.
- Link blue: `#0000EE`.

## Spacing and radii

- Desktop page side margins around the two-column layout: 122 px.
- Desktop layout column gap: 29 px.
- Builder body inner horizontal padding: 15 px.
- Review body horizontal padding: 20 px.
- Product-card padding: 11 px.
- Product-card content gap: 13 px.
- Product grid gap: 15 px.
- Product title/body vertical gap: 8 px.
- Product body to variants gap: about 10-18 px depending on copy height.
- Variant chip gap: 6 px.
- Quantity-to-price gap inside card action row: 46 px.
- Product-card radius: 10 px.
- Review panel radius: 10 px.
- Review item image radius: 5 px.
- Stepper button radius: 4 px.
- Variant chip radius: 2 px.
- Next button radius: 7 px.

## Borders

- Collapsed accordion rows: 0.5 px top and bottom border, `#1F1F1F`.
- Product selected-card border: purple `#4E2FD2`; visible on selected camera cards.
- Product unselected-card border: none visible; white card on blue surface.
- Stepper inactive/outlined button: 2 px `#E6EBF0` on white in product cards.
- Required/locked review stepper buttons: 1 px `#CED6DE`.
- Variant chips: 0.5 px `#CCCCCC`.
- Review sections: top border `#CED6DE`.
- Next button: 1 px `#4E2FD2`, transparent/blue-surface background.

## Buttons

- Step 1 desktop Next button: x 263, y 604 inside Step 1 body, 242 x 39.
- Button padding: 24 px horizontal, 5 px vertical.
- Button radius: 7 px.
- Button border/text: `#4E2FD2`.
- Button label: `Next: Choose your plan`, 18 px Gilroy SemiBold, 24 px line-height.
- Written behavior: this button advances from Step 1 to `Choose your plan`, regardless of any conflicting static tablet text.
- Checkout button in review: 350 x 48, purple fill, centered white label.

## Responsive layout behavior

- Desktop: use a two-column layout with builder fixed at 768 px and review fixed at 399 px, separated by 29 px, centered within a 1196 px content span.
- Desktop review remains to the right of the builder and starts aligned with the builder top.
- Tablet: the tablet frame is non-authoritative guidance only.
- Choose responsive breakpoints based on content rather than exact tablet-frame measurements.
- Product cards should reflow into a coherent grid without copying the tablet frame's inconsistent image sizing or alignment.
- Desktop fidelity and general responsive usability are the scoring priorities.
- Mobile: use a single-column 390 px reference. Top title `Let's get started!` appears at x 21, y 31, width 348, height 35.
- Mobile accordions stack above review. Accordion width is 390 px with 15 px horizontal content inset.
- Mobile compact step rows are 75-85 px high before review.
- Mobile review starts after the accordion stack at y 320 and uses the same 390 px review frame width with 20 px inner padding.
- Mobile review item rows keep 41 px thumbnails and 72 px steppers, with tighter text widths.

## Required images, icons, logos, and badges for later asset-download stage

- Product image: Wyze Cam v4 main camera.
- Product image: Wyze Cam Pan v3 main camera.
- Product image: Wyze Cam Floodlight v2 main camera.
- Product image: Wyze Duo Cam Doorbell main camera.
- Product image: Wyze Battery Cam Pro main camera.
- Product image: Wyze Sense Motion Sensor.
- Product image: Wyze Sense Hub.
- Product image: Wyze MicroSD Card 256GB.
- Variant thumbnails: Wyze Cam v4 White, Grey, Black.
- Variant thumbnails: Wyze Cam Pan v3 White, Black.
- Variant thumbnails: Wyze Cam Floodlight v2 White, Black.
- Variant thumbnails: Wyze Battery Cam Pro White, Black.
- Icon: 12/minus.
- Icon: 12/add.
- Icon: 12/carrot-up.
- Icon: 12/carrot-down.
- Icon: camera livestream for Step 1.
- Icon/logo: home monitoring shield/logo for Step 2 and review plan row.
- Icon: sensors for Step 3.
- Icon: extra protection for Step 4.
- Icon: delivery truck for Fast Shipping.
- Badge/image: Satisfaction Badge-05 1.
- Text badges to render in CSS: Save 22%, Save 12%, monthly payment pill, savings message.
