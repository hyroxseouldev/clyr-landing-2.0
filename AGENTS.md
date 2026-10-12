# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `pnpm run build` and `pnpm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable prototype decisions

- Hero correction (2026-10-12): after selecting Studio concept 3, the user said the 3D image does not fit and explicitly delegated the hero redesign. Remove the construction building and its interaction controls from the public hero; this supersedes earlier requirements to retain it. Keep the expressive Studio typography, bright canvas and cobalt accent, and lead with the real BRN GYM / KKOL website images plus a clear Korean service introduction and inquiry action. Do not substitute other decorative 3D imagery. The unused building implementation may remain in the repository, but the public landing must not load its runtime.

- Selected Studio direction (2026-10-12): the user chose the third displayed image, `output/design/studio-concepts-2026-10-12/concept-3-playground.png`. This supersedes the architectural blueprint layout: use oversized black/cobalt SMALL / WEBSITES. / BIG ENERGY. typography, a pale canvas, tilted real BRN GYM and KKOL work samples around the interactive construction building, Korean service introduction, open three-column service strip, and an understated contact invitation. Keep actual CMS-managed projects/copy, 3D controls/reduced-motion behavior, the working inquiry form, and real project imagery. Preserve source-image proportions on desktop; reflow the exhibition and text for mobile without hiding controls or distorting screenshots.

- Studio exploration refresh (2026-10-12): the user again requests a Studio-style redesign using Studio search results from Refero. The new concepts in `output/design/studio-concepts-2026-10-12/` apply the approved small-website/sports-event positioning and real BRN GYM / KKOL STUDIO imagery. BUTT STUDIO, Studio Emmerer, and TWOMUCH.STUDIO were inspected as distinct visual references. These are exploratory images awaiting selection; they do not replace the deployed layout until the user chooses a direction.

- Small-site and sports-event focus (2026-10-12): the user wants to start with smaller website projects and especially showcase running/sports event pages, plus simple pages with database-backed features. Emphasize the existing BRN GYM fitness meetup, participation application, and member-management CRM as relevant proof. Explain database-backed work through concrete tasks such as receiving applications and managing participant lists. Do not infer additional event features, event-organizing experience, or market-demand claims from this preference.

- Website positioning implementation (2026-10-12): the user approved applying this direction to the website. Keep the architectural hero and existing functionality, but lead with small websites, running/sports event pages, and application/operations management. These three offerings supersede the earlier AI prototype/service build/AI automation labels. Order projects BRN GYM, KKOL STUDIO, clyrtraining.ai, XON Training, Amor Lab, then CloudBoard; keep all real assets, links, roles, stacks, and development status. Use creation-inquiry language in CTAs and the contact form. CMS copy remains editable in the existing shared database.

- Refero redesign exploration (2026-10-09): the user requests a new website direction inspired by `https://styles.refero.design/` and specifically asks to also explore references whose names include `Studio`. Inspect actual Studio references when developing concepts; this is an exploration preference, with the final visual direction still awaiting selection. Preserve the existing real portfolio content, interactive construction building, CMS and contact behavior.

- Rotating hero building (2026-10-07): the user wants the construction building to rotate in 3D. Retain the selected white building, cobalt glass/crane and blueprint composition. Use real geometry with slow automatic rotation, drag/keyboard rotation, pause and reset; show the existing optimized image immediately while loading the 3D enhancement. Disable automatic motion with reduced motion and stop rendering off-screen or in hidden tabs.

- Service copy (2026-10-07): include small paid tasks within the existing three offerings: website/contact/payment/mobile error fixes under service builds; order Excel cleanup, supplier-specific purchase-order files, missing/duplicate checks, and estimates/reports in existing document templates under automation. Invite inquiries for one small recurring task and quote after reviewing sample files or symptoms. The suggested prices and third-party demand examples in the conversation are not approved public pricing or portfolio claims.

- Motion portfolio planning (2026-10-07): the user is interested in making outputs with Remotion/HyperFrames, but does not want promotional videos of their existing services as the proposed direction. Choose the motion-work concept before implementing a new portfolio section.

- Package management (2026-10-07): use pnpm, with the version pinned in `package.json` and `pnpm-lock.yaml` committed. Use `pnpm install --frozen-lockfile` for reproducible installs and `pnpm run <script>` for project commands. Do not add npm or Yarn lockfiles.

- Creative refresh request (2026-10-07): the user wants the main portfolio website to feel more creative. Explore more distinctive composition and typography while retaining the latest bright palette, blue accent, construction-themed hero, real portfolio content, and working CMS/contact behavior; apply a specific new visual direction once selected.

- Selected creative direction (2026-10-07): the user chose concept 2, `output/design/creative-concepts-2026-10-07/concept-2.png`. Use its architectural drafting composition as the visual source: off-white canvas, cobalt accents, large Korean headline on the left, central white building/blue crane with fine blueprint annotations, small right-hand explanation, and a three-column service strip under the hero. Keep the actual portfolio/CMS/contact functionality. Hero blueprint copy uses optional `settings.heroBlueprint` with shared defaults so existing content documents remain valid without rewriting the shared database.

- Main website redesign (2026-10-03): the user requests a bright visual direction and a 3D building-under-construction object in the hero. This supersedes the earlier dark-blue landing direction. Use an off-white/white canvas, dark typography and a clear blue accent; retain Pretendard, CMS-backed content, real project imagery and the working contact form. Keep the hero fast with an optimized 3D-rendered illustration and lightweight motion, plus reduced-motion support. These website changes do not change either PDF's separate design preferences.

- CloudBoard policy copy uses user-approved 7-day deletion after identity verification and 30-day retention of completed support/deletion-request records. Keep internal review notes out of public page copy. Verified Firebase settings: Firestore/Storage Seoul, Realtime Database Singapore, Storage soft delete 7 days, Firestore PITR disabled with 1-hour version retention. Do not confuse these with all provider backup deletion times.

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

- The portfolio CMS uses Better Auth, Drizzle ORM, Neon Postgres, and UploadThing. Use one shared database; the user explicitly does not want separate development/production environments. `/admin` edits landing content while preserving the existing public design. Public sign-up is disabled; server-side `ADMIN_EMAIL` authorization protects content writes and image uploads. Keep credentials server-only.

- Prioritize first-screen speed on `/`: render the build-time public content snapshot immediately, revalidate from Neon in the background, and keep usable content on API failure. Do not restore a full-page loading/error text gate. Show the hero immediately without an entrance fade; retain lower-section motion and reduced-motion support.

- For the separate portfolio PDF, use the user-selected STACKER reference (https://notefolio.net/sungseung/383412): large real product visuals and feature-by-feature storytelling. The latest user preference for neutral white/gray/black with rounded corners supersedes previous palette choices. Keep it separate from the resume and public landing design; do not invent research, performance outcomes, or unavailable product screens.

- Visual portfolio PDF preference (user clarified the target): use embedded Pretendard Regular/Bold, rounded cards and image corners, a neutral white/gray/black palette without pastel accents. The no-pastel preference applies to both the resume and visual portfolio PDFs. Apply this to the 11-page visual portfolio; the earlier interpretation as a resume change was incorrect. Preserve project facts and real product imagery.

- Latest PDF correction: restore the visual portfolio to the original dark charcoal/mint presentation with square-edged cards and images; retain only the embedded Pretendard font change. The resume remains neutral without pastel colors. This supersedes earlier rounded/pastel visual-portfolio preferences.

- Resume PDF latest correction: retain embedded Pretendard and the latest supplied portrait, remove all rounded cards, pills, and photo corners, and use the original plain layout with thin dividers. Keep its neutral no-pastel palette.
