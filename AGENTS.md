# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable prototype decisions

- CloudBoard app policies live at `/apps/cloudboard/privacy` and `/apps/cloudboard/delete-account`, independent of portfolio content, without animation or login. Use email requests to `vividxxxxx@gmail.com` and clipboard feedback; do not connect them to Resend or claim automatic deletion. Do not publish unverified retention, backup, operator, or international-transfer claims. Current review-only release blockers are recorded in `docs/cloudboard-policy-release.md`.

- Count-up motion must not change the original number typography: preserve off-white color, Pretendard font, and 30px mobile / up to 46px desktop sizing. Scope stat label styles to direct children so they cannot affect animated number spans.

- Include `clyrtraining.ai` as an additional portfolio project: a gym/coach member-management CRM and operational admin, not merely a landing page. Describe member/membership, program, training record, and feedback management. Link to `https://clyrtraining.vercel.app/` (the project name is not a verified custom domain). The current thumbnail is its public landing page; retain it until an admin screenshot is supplied.

- The user welcomes an overall responsive design polish and subtle animation. Preserve portfolio content and the dark blue visual direction; respect reduced-motion preferences.

- Use shadcn/ui components in `src/components/ui` with Tailwind CSS; daisyUI has been removed. Preserve the established custom portfolio styling when updating these components.

- The portfolio owner name is `클리어데브` (`CLYRDEV`).
- Preserve the current cards, imagery, interactions, density, and visual styling unless the user explicitly requests otherwise. The former YouTube/build-log section has been intentionally removed.
- Content should read as a personal vibe-coding and AI product-builder portfolio. Prefer confident, curious, builder-oriented language without inventing career claims, clients, or performance statistics.
- Section 01 is `COLLABORATIONS` and presents XON TRAINING, AMOR LAB, and the official 본투윈 / BRN GYM logo from `https://www.brngym.co.kr/`. Do not restore other previous brand logos unless requested.
- Include `BRN GYM · 본투윈` as a portfolio project: a fitness meetup service plus member-management CRM, with its real public screenshot and `https://www.brngym.co.kr/` link. Only list verified technologies.
- Section 02 uses the latest user-provided proof points: 300+ active members, 7 live services, 4 published apps, and 50+ monthly updates. Do not replace them with portfolio-derived metrics. Keep count-up animation: play once on entering view, preserve plus signs, and show final values immediately with reduced motion.
- Section 03 contains only three offerings: AI prototype, service build, and AI automation. The former build-log offering has been intentionally removed.
- Section 04 presents XON Training, Amor Lab, CloudBoard StationD, and KKOL STUDIO as portfolio projects. Use the supplied imagery for XON and Amor, a captured projects-page visual and live link for KKOL STUDIO, include each project's description, role, stack, and real service links, and present CloudBoard as in development until a visual or public URL is supplied. Do not restore the previous book content.
- Use `vividxxxxx@gmail.com` as the portfolio contact email and `https://github.com/hyroxseouldev` as the only visible social profile. Show GitHub and email under `FIND ME ONLINE` and in the footer; keep all former CodeFactory social links hidden.
- Do not display the former supplied `logo.svg`; it is not the portfolio owner's logo. Use the text-only `클리어데브` brand lockup until the user supplies a replacement logo.
- Keep the header as a simple responsive flex row: the text-only brand grows on the left and desktop/mobile actions stay content-sized and right-aligned within symmetric shell gutters.
- The contact form sends validated inquiries to `vividxxxxx@gmail.com` through a Vercel Function and Resend, with loading, success, failure, and honeypot states. Keep `RESEND_API_KEY` server-only.
