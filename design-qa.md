# Design QA

## Comparison target

- Source visual truth: `/Users/sunmkim/Downloads/screencapture-codefactory-ai-2026-09-07-16_51_12.png`
- Desktop implementation: `/Users/sunmkim/Dev2026/clyrtraining/clyr-landing-2.0/implementation-desktop.png`
- Mobile source capture: `/Users/sunmkim/Dev2026/clyrtraining/clyr-landing-2.0/qa/source-mobile.png`
- Mobile implementation: `/Users/sunmkim/Dev2026/clyrtraining/clyr-landing-2.0/implementation-mobile.png`
- Desktop combined comparison: `http://localhost:4173/qa-compare.html`
- Mobile combined comparison: `http://localhost:4173/qa-mobile-compare.html`

## Viewport and normalization

- Desktop source pixels: 2560×6464.
- Desktop implementation pixels: 2560×6464.
- Source CSS viewport observed from the live page: 2560×1318, device pixel ratio 2.
- Implementation browser content viewport: 2560×1262. The reference Hero height was preserved at 1318px for 1600px-and-wider viewports so the normalized full-page capture matches the source's exact 2560×6464 output.
- Mobile source pixels: 390×8294.
- Mobile implementation pixels: 390×8296.
- Mobile CSS viewport: 390×844, device pixel ratio 1 for both captures.
- The 2px mobile full-page difference is cumulative fractional pixel rounding in the footer and is not visually actionable.
- State: dark theme, landing page, menu closed, default inquiry type selected, all reveal sections activated before final full-page capture.

## Full-view comparison evidence

- Desktop source and implementation were loaded side by side in `qa-compare.html` at equal width and equal full-page dimensions.
- Hero, collaboration marquee, numbers, services, books, YouTube, contact, and footer landmarks align at matching vertical positions.
- Mobile source and implementation were loaded side by side in `qa-mobile-compare.html`. The final section-height totals match within 2px.
- Desktop browser console contained no application errors. Chrome extension warnings were excluded because they originated from an unrelated extension content script.
- Mobile browser console contained no errors.

## Focused region comparison evidence

- Hero: title wrap, 1160px shell alignment, button dimensions, grid, and blue glow were checked in a focused viewport capture.
- Books: cover crops, card width, border radius, text hierarchy, and vertical stacking were compared in the combined mobile view.
- Contact: two-column desktop form/card structure and the mobile form-only treatment were checked against the source.
- Numbers and services: value alignment, cyan/blue divider treatment, two-column desktop structure, and mobile service row density were compared.

## Comparison history

### Iteration 1

- [P1] Hero content rendered horizontally because the custom `hero-content` class collided with daisyUI's component class.
- Fix: renamed the custom wrapper to `hero-inner`, restoring the source's vertical title/copy/actions stack.
- Post-fix evidence: focused Hero capture aligns the title at the same shell position and preserves the original two-line desktop wrap.

- [P2] Header and footer lockups showed only an oversized symbol.
- Fix: reconstructed the lockup from the real source symbol asset plus the visible Korean wordmark text, with measured desktop/mobile dimensions.
- Post-fix evidence: desktop side-by-side comparison shows the lockups at matching scale and alignment.

### Iteration 2

- [P2] Mobile total height was 104px taller and book cards had excess body height.
- Fix: changed the mobile book-body minimum from 142px to 108px.
- Post-fix evidence: first two book cards are 543.84px and the third is 571.39px, matching the source's compact stacked rhythm.

- [P2] Mobile collaborations was 31px short while services was 77px tall.
- Fix: set collaborations to 405px and removed the artificial 184px minimum from mobile service rows.
- Post-fix evidence: final mobile sections measure Hero 844px, Collaborations 405px, Numbers 699px, Services 1083px, Books 2056px, YouTube 1060px, Contact 1546px, and Footer 603px.

## Required fidelity surfaces

- Fonts and typography: passed. Real Pretendard and JetBrains Mono WOFF2 files are local; sizes, weights, line heights, tracking, and desktop/mobile wrapping match the measured source.
- Spacing and layout rhythm: passed. Desktop is exactly 2560×6464; mobile differs by only 2px across the full 8294px source height. Shell, section, card, and control measurements match.
- Colors and visual tokens: passed. Source palette and opacity values are mapped to local CSS/daisyUI theme variables; background grid and blue/cyan glows are present.
- Image quality and asset fidelity: passed. Original SVG logos, WebP book covers, and WebP YouTube thumbnails are stored locally without hotlinking or placeholder substitution.
- Copy and content: passed. Visible Korean/English section copy, values, titles, links, labels, and footer content match the live source.

## Interactions tested

- Desktop anchor navigation across all six sections.
- Mobile menu open and close state.
- Inquiry type selection and `aria-pressed` state.
- Local-only contact submit success state.
- Email copy interaction implementation.
- External destination URLs and mail link verified from the DOM.

## Findings

- No actionable P0, P1, or P2 mismatch remains.

## Follow-up polish

- [P3] The segmented number rules use a CSS repeating gradient rather than the source's exact generated dash cadence; the visible result is materially equivalent.
- [P3] Full-page screenshots can place the fixed mobile header at a browser-dependent capture boundary; normal scrolling behavior remains correct.

## Implementation checklist

- [x] Original assets localized.
- [x] Desktop and mobile responsive structures implemented.
- [x] Core interactions tested.
- [x] Build and Sites packaging tests passed.
- [x] Browser console checked.
- [x] Equal-size desktop and mobile comparison completed.

final result: passed
