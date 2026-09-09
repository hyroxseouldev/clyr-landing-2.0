# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable prototype decisions

- The portfolio owner name is `클리어데브` (`CLYRDEV`).
- Preserve the current cards, imagery, interactions, density, and visual styling unless the user explicitly requests otherwise. The former YouTube/build-log section has been intentionally removed.
- Content should read as a personal vibe-coding and AI product-builder portfolio. Prefer confident, curious, builder-oriented language without inventing career claims, clients, or performance statistics.
- Section 01 is `COLLABORATIONS` and presents only the supplied XON TRAINING and AMOR LAB logos; do not restore the previous brand logos unless requested.
- Section 02 uses the user-approved proof points: 200+ active members, 5 live services, 3 published apps, and 10+ monthly updates.
- Section 03 contains only three offerings: AI prototype, service build, and AI automation. The former build-log offering has been intentionally removed.
- Section 04 presents XON Training, Amor Lab, and CloudBoard StationD as portfolio projects. Use the supplied imagery for XON and Amor, include each project's description, role, stack, and real service links, and present CloudBoard as in development until a visual or public URL is supplied. Do not restore the previous book content.
- Use `vividxxxxx@gmail.com` as the portfolio contact email and `https://github.com/hyroxseouldev` as the only visible social profile. Show GitHub and email under `FIND ME ONLINE` and in the footer; keep all former CodeFactory social links hidden.
- Do not display the former supplied `logo.svg`; it is not the portfolio owner's logo. Use the text-only `클리어데브` brand lockup until the user supplies a replacement logo.
- Keep the header as a simple responsive flex row: the text-only brand grows on the left and desktop/mobile actions stay content-sized and right-aligned within symmetric shell gutters.
