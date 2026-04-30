# Standing rules — Freeman Firewood build

## Stack
- Next.js 15 (App Router, Server Components by default) — deployed to Vercel
- TypeScript, strict mode
- Tailwind CSS + shadcn/ui
- **Supabase** — Postgres, Auth, Storage (one project per environment)
- Drizzle ORM for typed DB access (against the Supabase pooled connection string)
- Stripe Checkout + Subscriptions for payments
- Resend for transactional email (also used as Supabase Auth SMTP provider)
- Vitest + @testing-library/react for unit/component tests
- pnpm as package manager

## Code rules
- App Router only; no `pages/` directory.
- Server Components by default. `"use client"` only when state, effects, or browser APIs are needed.
- No `any` without a `// reason:` comment on the same line.
- Co-locate component tests: `Foo.tsx` + `Foo.test.tsx`.
- Tailwind classes only — no inline styles, no CSS modules unless asked.
- Server actions live in `app/**/actions.ts`. Always validate input with zod.
- Env vars are read **only** through `lib/env.ts` (zod-validated, typed re-export).

## Supabase rules
- Two clients only: `lib/supabase/server.ts` (server components / server actions / route handlers) and `lib/supabase/client.ts` (client components). Never import the JS SDK directly from anywhere else.
- Use the **anon key** in user-context code. The **service role key** is only allowed in:
  - Stripe webhook handlers
  - Cron jobs / scheduled functions
  - Seed scripts under `scripts/`
- **Every new table must have RLS enabled before the migration is committed.** Add the policies in the same migration. If a table is genuinely public, write a one-line comment in the migration explaining why.
- Drizzle owns the schema. Migrations go in `drizzle/`. Never edit Supabase tables via the dashboard — change the schema in code.
- Storage buckets: `product-images` (public read, admin write), `delivery-proof` (private; driver writes their own assigned drops, admins read all).

## Testing rules
- Every new component, server action, or route handler gets at least one test.
- Tests must be deterministic — no real network, no real DB. Use `vi.mock` at the module boundary.
- A failing test must be fixed in the same iteration; never skip or `.todo` to move on.

## Git rules
- Work on the currently checked-out branch (the human picks it).
- Commit message format: `<area>: <change>` (e.g. `cart: persist guest basket via cookie`).
- One backlog item per commit. Never force-push. Never push to `main`.

## Off-limits
- Don't edit `pnpm-lock.yaml` by hand.
- Don't modify `.devcontainer/`, `ralph.sh`, `PROMPT.md`, `AGENT.md`, or `specs/plan.md` unless an item explicitly says so.
- Don't delete tests or weaken assertions to make a build pass.
- Don't fabricate Freeman business details (delivery zones, prices, lead times). If an item depends on a real-world value you can't verify, leave a `TODO(freeman):` comment with the question and stop the iteration cleanly — better to surface the gap than invent.
