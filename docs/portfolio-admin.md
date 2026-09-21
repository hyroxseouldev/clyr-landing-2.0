# Portfolio CMS

The landing page and `/admin` share one Neon project and database. There is no development/production branch split, as requested.

- Neon project: `clyrdev-portfolio` (`wispy-credit-01058438`), Singapore.
- UploadThing app: `clyrdev-portfolio` (`jkx7bcn77z`), free plan.
- Better Auth: email/password sessions stored in Postgres, public registration disabled.
- Drizzle: versioned migrations in `drizzle/`, schema in `server/db/schema.js`.
- Admin access: authenticated email must match the server-only `ADMIN_EMAIL` for every content and upload request.

## Editing

Open `/admin`, sign in, select a section and edit its fields. Project/brand images accept existing asset paths, HTTPS URLs, or an authenticated UploadThing upload (PNG/JPG/WebP, up to 8MB). Each section supports saving independently. Collection items support add, reorder, hide and delete. New items start hidden. Deleted items can be recovered with **변경 취소** until saved. Files remain in UploadThing when a card is removed, so other references are not broken.

Changes remain in memory while switching sections. Leaving the page with unsaved changes triggers a warning. Concurrent saves from a second tab fail with a conflict instead of overwriting newer content. Successful saves appear on the next public page load. Account settings support password changes and revoke other sessions.

The contact form continues to use Resend. Editing the display contact email does not change the server's `CONTACT_TO_EMAIL` recipient. CloudBoard policy pages are independent of this CMS.

## Local setup and commands

`npm run dev` starts Vite and the actual API on port 5173. `npm run preview` uses that same port and API after a build; stop the dev process first. Both use `.env.local`, then `.env`. Only one server should run on port 5173. The account bootstrap script writes the generated initial password to ignored `.local/admin-credentials.txt` with mode 0600, never to source control. It will not reset an existing account. The initial password should be changed in the account page.

- `npm run db:generate`: generate migrations from the Drizzle schema.
- `npm run db:migrate`: apply committed migrations with the direct DB URL.
- `npm run db:seed`: insert missing content sections without overwriting edits.
- `npm run admin:create`: bootstrap only the configured admin email through Better Auth.
- `npm run test:admin`: data validation and public visibility tests.
- `node scripts/check-admin.mjs`: integration checks against the running localhost server. Uses the initial credential file; after changing the password, pass `ADMIN_TEST_PASSWORD` in the shell environment. Re-saves unchanged stats to test locking; increments their version without changing copy.

Content is stored in five validated, versioned JSONB section documents (`settings`, `projects`, `partners`, `stats`, `services`), supporting atomic section saves. Auth tables and upload metadata are separate tables. Drizzle handles all reads/writes and migrations.

## Vercel deployment

The existing Vercel project is `clyr-landing-2.0`, connected to the GitHub repository’s `main` branch. Its canonical production origin is `https://clyr-landing-20.vercel.app`; the admin is available at `/admin`. Production environment variables are registered in Vercel. Keep these server-only values configured when redeploying:

- `DATABASE_URL`: pooled Neon URL.
- `DATABASE_URL_UNPOOLED`: direct URL, used only by migration tooling.
- `BETTER_AUTH_SECRET`: the local stable random secret (or intentionally rotate it, which invalidates sessions).
- `BETTER_AUTH_URL`: the actual canonical HTTPS site origin; localhost is only for local preview.
- `ADMIN_EMAIL`: `vividxxxxx@gmail.com`.
- `UPLOADTHING_TOKEN`: token from the portfolio UploadThing app.
- Existing `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL` remain server-only.

Never prefix secrets with `VITE_`. The deploy uses the same DB and upload app. `/api/auth.js`, `/api/admin/content.js`, `/api/content.js`, `/api/uploadthing.js` are Vercel Functions. Nested `/api/auth/*` URLs are explicitly forwarded to `/api/auth.js`; routing then checks filesystem/API routes before the SPA fallback. Signed UploadThing callbacks are validated by its SDK; user session authorization is applied in the upload initiation middleware, not to the callbacks. Upload metadata is idempotent by file key. Vercel `waitUntil` keeps SDK background tasks alive.

The preserved Sites worker remains a **static** fallback and does not run these Node APIs. Sites packaging and existing tests remain intact, but a Sites deployment alone will display the bundled content snapshot and will not provide a working CMS/auth API. Use Vercel for the full stack implemented here.

## References

- [Better Auth Drizzle adapter](https://better-auth.com/docs/adapters/drizzle)
- [UploadThing Fetch adapter](https://docs.uploadthing.com/backend-adapters/fetch)
- [Vercel Node runtime](https://vercel.com/docs/functions/runtimes/node-js)
