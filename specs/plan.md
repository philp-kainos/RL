# Freeman Firewood — backlog

Replace items as you learn more. Each item is roughly one Ralph iteration / one commit.
Order matters: do top-to-bottom.

---

## Phase 0 — Foundation

- [x] Scaffold Next.js 15 (App Router, TS, Tailwind, ESLint) into the repo root.
- [x] Add Vitest + @testing-library/react + jest-dom; one passing smoke test.
- [x] Add `pnpm typecheck` script (`tsc --noEmit`) and ensure CI gates pass.
- [x] Add `lib/env.ts` validating `process.env` with zod; export typed `env`.
- [x] Add `lib/db.ts` exporting a Drizzle client connected to `env.DATABASE_URL` (Supabase Postgres pooled connection string).
- [x] Add `lib/supabase/server.ts` and `lib/supabase/client.ts` helpers (server + browser clients, using `@supabase/ssr` with cookie-based auth).
- [x] Add brand tokens to `tailwind.config.ts` (warm wood palette: deep brown, cream, ember orange).
- [x] Add `components/Header.tsx` and `components/Footer.tsx`; wire into `app/layout.tsx`. Snapshot tests.
- [x] Add `app/healthz/route.ts` returning `{ status: "ok" }`; test.

## Phase 1 — Catalogue & marketing

- [x] Drizzle schema: `products` (id, slug, name, description, unitLabel, pricePence, imageUrl, stock, isActive).
- [x] Seed script with Freeman's real products: 0.9m³ kiln-dried hardwood bag (8"), 0.9m³ kiln-dried hardwood bag (10"), force-dried woodchip (POA flag).
- [x] `app/products/page.tsx` — grid of active products from DB. Test: empty state + populated.
- [x] `app/products/[slug]/page.tsx` — detail page; 404 if slug missing. Test both paths.
- [x] Replace marketing pages with Freeman-equivalent copy: `app/page.tsx` (home), `app/about/page.tsx`, `app/delivery/page.tsx`, `app/faqs/page.tsx`, `app/contact/page.tsx`.
- [ ] Add `app/sitemap.ts`, `app/robots.ts`, OG tags via metadata API.
- [ ] Create a public Supabase Storage bucket `product-images`; add an upload helper; replace seed `imageUrl`s with real uploads.

## Phase 2 — Shop & checkout

- [ ] Cart model: server-side cart in DB keyed by signed cookie for guests; merge to user on login.
- [ ] `addToCart` server action with zod validation. Test add, increment, remove.
- [ ] `app/basket/page.tsx` — line items, qty controls, subtotal.
- [ ] `postcodes` table + delivery zone schema: prefix → zonePence + leadDays.
- [ ] Seed delivery zones for Freeman's real coverage (HR, GL, WR postcodes etc. — use current `/delivery` page as source).
- [ ] Postcode entry on basket; show delivery price + earliest date.
- [ ] Stripe Checkout integration: create session server-side from basket; redirect; success/cancel routes.
- [ ] Stripe webhook handler: on `checkout.session.completed`, create `orders` + `order_lines`, decrement stock, mark cart consumed.
- [ ] Resend integration: order confirmation email template + send on order create. Test the template renders.
- [ ] `app/orders/success` confirmation page reading the order by Stripe session id.

## Phase 3 — Customer portal

- [ ] Wire up Supabase Auth with email magic-link (custom SMTP via Resend in the Supabase dashboard). Sign-in page at `/sign-in` calling `signInWithOtp`.
- [ ] Add `app/auth/callback/route.ts` to exchange the magic-link code for a session.
- [ ] Add Next.js middleware (`middleware.ts`) that refreshes the Supabase session and redirects anon users from `/account/**` and `/admin/**` to `/sign-in?next=...`.
- [ ] `app/account/page.tsx` — greeting + nav to orders, addresses, subscriptions.
- [ ] Addresses CRUD: list, add, edit, delete, set default.
- [ ] Order history list + detail under `/account/orders`.
- [ ] "Reorder" button on past orders → clones lines into current basket.
- [ ] Subscription schema: `subscriptions` (userId, frequencyDays, nextDeliveryAt, status, stripeSubId).
- [ ] Subscribe & Save flow at checkout: toggle to convert basket into a Stripe subscription instead of one-off.
- [ ] `/account/subscriptions` — list, pause, skip-next, cancel.
- [ ] Cron / scheduled function to send "your next delivery is in 5 days" reminder emails.

## Phase 4 — Delivery portal

- [ ] Add a `profiles` table keyed by `auth.users.id` with a `role` column (`customer | admin | driver`); add a trigger that inserts a profile on user signup; seed an admin profile.
- [ ] Add Row Level Security policies: customers see only their own orders/addresses/subscriptions; admins see all; drivers see only their assigned delivery runs.
- [ ] `/admin` layout with sidebar; protected by role check in middleware + RLS as defence in depth.
- [ ] `/admin/orders` — table with filters (date range, status, zone, postcode prefix). Pagination.
- [ ] `/admin/orders/[id]` — detail page; status transitions (pending → packed → out_for_delivery → delivered → returned). Audit log.
- [ ] `delivery_runs` schema: date, zone, driverId, ordered list of orderIds.
- [ ] `/admin/delivery-runs` — group unassigned orders by date+zone, drag to assign to a run.
- [ ] `/driver` — mobile-first list of today's drops in route order for the signed-in driver.
- [ ] Create a private Supabase Storage bucket `delivery-proof` with RLS so only the assigned driver and admins can upload/read.
- [ ] Driver "drop" actions: mark arrived, capture photo proof (upload to `delivery-proof`), capture notes, mark delivered.
- [ ] Public `app/track/[orderId]/page.tsx` — status timeline + ETA window. No auth, but unguessable id.
- [ ] Status-change emails: dispatched, out for delivery (with window), delivered (with photo).

## Phase 5 — Ops & launch

- [ ] DB-backed admin for marketing copy (home hero, about, delivery, FAQs) — single `pages` table with markdown body.
- [ ] `/admin/reports` — today's orders count, week revenue, top 5 products.
- [ ] Cookie-consent banner + analytics gating (Plausible or GA4).
- [ ] Privacy policy + T&Cs pages from supplied copy.
- [ ] Lighthouse: 90+ on home, product, basket, account. Fix biggest regressions.
- [ ] Axe accessibility pass on the same four pages; fix all serious issues.
- [ ] Production env: Supabase prod project (separate from dev), Stripe live keys, Resend prod domain verified, Vercel project + custom domain `freemanfirewood.co.uk`.
- [ ] Supabase: enable point-in-time recovery on the prod project; document restore procedure.
- [ ] Pre-launch checklist: DNS, SSL, error monitoring (Sentry), DB backups verified, RLS policies audited, runbook in `docs/runbook.md`.
- [ ] Cutover plan: redirect old freemanfirewood.co.uk to new app; preserve high-value URLs.

---

## Notes for the agent

- When an item says "test", that means red-green-refactor — write the failing test first if practical.
- "Real products" / "real coverage" — read `app/about/page.tsx`, `app/delivery/page.tsx`, etc. once they exist; don't invent details Freeman wouldn't recognise.
- Never store Stripe or Supabase service-role secrets in the repo. Always read via `lib/env.ts`.
- Use the Supabase **anon key** in browser/server-component code; reserve the **service role key** for trusted server actions and webhooks only.
- Every new table needs RLS enabled before merge. If a table genuinely needs to be public, document why in the migration.
- Photo proof images are user-uploaded — sanitise filenames, validate mime, cap size at 8 MB.
