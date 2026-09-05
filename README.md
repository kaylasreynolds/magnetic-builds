# Magnetic Builds

Magnetic Builds is a private-first workspace for discovering, documenting, testing, and improving magnetic tile creations. The repository currently implements **Milestone 0 — Foundation** and intentionally keeps non-breaking future-ready schema in place for later Personal Alpha milestones.

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

# Seed the small verified Personal Alpha catalog locally
npm run db:seed:local

# Seed the same catalog into production D1
npm run db:seed

# Verify seeded catalog rows locally / remotely
npm run db:verify:local
npm run db:verify
```

The seed catalog is deliberately small and manufacturer-verified. It is expected to grow incrementally as additional owned sets are added. Unknown catalog information should remain unknown rather than being guessed.

Usable inventory is intentionally not persisted. It will be derived from owned sets, set contents, and inventory adjustments in Milestone 1.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Cloudflare D1 setup

`wrangler.toml` declares a D1 database named `magnetic-builds-production` with binding `DB`.

The production database is already configured and deployed through the OpenNext/Cloudflare Worker pipeline. Runtime access should remain on `drizzle-orm/d1` through the `DB` binding.

Do not point this project at an existing database or bucket belonging to another application.

## Foundation boundaries

The foundation includes the required Personal Alpha relational schema, checked-in Drizzle migrations, a minimal App Router shell, Cloudflare D1 configuration, D1-first database access, seed/verification tooling, and basic application error handling.

Some schema for later Personal Alpha milestones is intentionally present now because it is non-breaking and preserves upgrade paths. Those tables do not imply the corresponding user-facing workflows are implemented yet.

Collection-management screens, authentication, R2, AI, comprehensive catalog data, and optional advanced tables remain deferred until their milestones require them.
