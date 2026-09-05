# Magnetic Builds

Magnetic Builds is a private-first workspace for discovering, documenting, testing, and improving magnetic tile creations. **Milestone 0 — Foundation** is complete, and **Milestone 1 — My Collection** is now in progress. Non-breaking future-ready schema remains in place for later Personal Alpha milestones.

## Prerequisites

- Node.js 22 or later
- npm 10 or later
- Cloudflare Wrangler

## Local setup

```bash
npm install
npm run db:migrate:local
npm run db:seed:local
npm run db:verify:local
npm run dev
```

Open `http://localhost:3000`. The JSON endpoint at `http://localhost:3000/api/health` verifies the application is running and reports the intended Cloudflare D1 binding name.

The first read-only Milestone 1 collection slice is available at:

```text
http://localhost:3000/collection
```

It reads the primary collection from D1 and derives usable piece inventory from owned sets, set contents, and inventory adjustments. The page is intentionally a functional skeleton; final visual design and editing controls are deferred to later Milestone 1 slices.

## Database architecture

Magnetic Builds is Cloudflare-first. The application schema is defined with Drizzle and the runtime database is Cloudflare D1 through the `DB` binding declared in `wrangler.toml`.

There is no libSQL client and no file-backed `local.db` application database. Local D1 development uses Wrangler's local D1 emulation so the development path matches the production database model.

`src/db/client.ts` constructs Drizzle with `drizzle-orm/d1` from a supplied `D1Database` binding.

```bash
# Generate a migration after editing the schema
npm run db:generate

# Apply pending migrations to Wrangler's local D1 database
npm run db:migrate:local

# Apply pending migrations to the production D1 database
npm run db:migrate

# Seed the small verified Personal Alpha catalog/collection locally
npm run db:seed:local

# Seed the same data into production D1
npm run db:seed

# Verify catalog and collection rows locally / remotely
npm run db:verify:local
npm run db:verify
```

The seed data is deliberately small and manufacturer-verified. It is expected to grow incrementally as additional owned sets are added. Unknown catalog information should remain unknown rather than being guessed.

Usable inventory is not persisted. It is derived from owned sets, set contents, and inventory adjustments.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Cloudflare deployment

Production deploys through the pinned OpenNext adapter:

```bash
npm run deploy:cloudflare
```

That command builds the OpenNext Worker first and then deploys it. `wrangler.toml` keeps the production D1 binding as `DB`.

## Current boundaries

Milestone 1 currently includes the collection read model, owned-set summaries, derived inventory, starter ownership seed data, and a minimal `/collection` verification page.

Add/remove/update collection controls, final visual design, authentication, R2, AI, comprehensive catalog data, and later build workflows remain intentionally deferred until their milestone requires them.
