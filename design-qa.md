# Design QA — selected blueprint concept

## Comparison target

- Source visual truth: `output/design/creative-concepts-2026-10-07/concept-2.png` (user selected concept 2 on 2026-10-07).
- Implementation: `http://localhost:5173/`, running through pnpm/Vite.
- Source pixels: 1422 × 1106. Planned desktop comparison: 1422 × 1106 CSS pixels at device scale factor 1.
- Planned responsive checks: 1280, 1024, 768, 390, and 320 CSS pixel widths.
- State: light theme, top of landing page, menu closed, default content, then reduced-motion and navigation states.
- Implementation screenshot path: unavailable; a saved browser permission setting blocks access.
- Density normalization: not performed because no implementation capture is available.

## Findings

- [P1 / verification gap] Browser access to localhost:5173 was initially rejected because the user declined permission. After the user indicated completion of the permission step, the retry was rejected because a saved user permission setting still blocks the URL. The in-app browser was also unavailable. No alternate browser automation or indirect capture has been attempted to bypass that refusal. The user subsequently explicitly requested publishing the changes to `main`; this proceeds with the visual verification gap recorded.
- No visual fidelity verdict has been made from code, asset inspection, the source mock, or build success alone.

## Full-view and focused comparison evidence

The selected source image was opened. The implementation could not yet be captured. Neither a combined full-view comparison nor focused comparisons of the heading, construction model, right-hand copy, and service strip are available.

## Required fidelity surfaces

- Fonts and typography: local Pretendard and JetBrains Mono retained; visual sizes, wrapping, and weights await browser comparison.
- Spacing and layout rhythm: three-part desktop hero and responsive stacking implemented; viewport measurements and overflow checks await browser access.
- Colors and visual tokens: existing off-white, dark typography, and cobalt tokens retained; rendered comparison pending.
- Image quality and asset fidelity: original construction illustration retained; generated transparent blueprint underlay inspected as an asset and delivered as 196 KB desktop / 79 KB mobile WebP. Its placement behind the building awaits rendered verification.
- Copy and content: selected headline and side heading are shared CMS-compatible defaults. Actual service descriptions, project content, partners, proof points, and contact behavior are retained. Rendered copy comparison pending.

## Automated validation

- pnpm production build passed; required Sites build artifacts emitted.
- 16 tests passed: 7 CMS/schema checks, 1 first-render test including the actual landing, 4 contact API tests, and 4 Sites worker tests.
- CMS compatibility test covers legacy documents, edited blueprint copy round-trip, and rejected invalid/unknown fields.
- Actual landing renders the selected headline, project content, service navigation, and contact section before any content fetch completes.
- Existing contact API tests use a mocked transport; no inquiry was sent.
- Git whitespace check passed.

## Interactions and console

Browser checks pending: desktop anchors, service links, mobile menu/Escape behavior, animation pause/reduced motion, contact validation/loading/error states, and console errors. Live email submission and CMS content writes are not needed for visual QA.

## Comparison history

No browser comparison iterations yet. The previous QA report concerned an older, superseded design and is not evidence for this implementation.

## Implementation checklist

- [x] Selected visual target recorded in AGENTS.md.
- [x] Central construction composition and service strip implemented.
- [x] Native copy, links, controls, and CMS editability retained.
- [x] Desktop and mobile raster assets included.
- [x] Responsive and reduced-motion styles implemented.
- [x] Production build and 16 automated tests passed.
- [ ] Obtain permission for localhost browser verification.
- [ ] Capture and compare desktop/mobile implementation with source.
- [ ] Verify primary interactions and browser console; fix any visual findings.

final result: blocked
