# Magnetic Builds

Magnetic Builds is a private-first workspace for discovering, documenting, testing, and improving magnetic tile creations. This repository currently implements **Milestone 0 — Foundation** only.

## Prerequisites

- Node.js 22 or later
- npm 10 or later
- Cloudflare Wrangler

## Local setup

```bash
npm install
npm run db:migrate:local
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
# (requires the real database_id in wrangler.toml)
npm run db:migrate
```

Usable inventory is intentionally not persisted. It will be derived from owned sets, set contents, and inventory adjustments in a later milestone.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Cloudflare D1 setup

`wrangler.toml` declares a D1 database named `magnetic-builds-production` with binding `DB`.

Before the first remote migration or deployment:

1. Create the dedicated D1 database `magnetic-builds-production` in the Magnetic Builds Cloudflare project/account.
2. Replace `REPLACE_WITH_MAGNETIC_BUILDS_PRODUCTION_D1_ID` in `wrangler.toml` with that database's ID.
3. Run `npm run db:migrate` to apply the checked-in migrations remotely.
4. Keep all runtime database access on `drizzle-orm/d1` through the `DB` binding.

Do not point this project at an existing database or bucket belonging to another application.

## Foundation boundaries

The foundation includes the required Personal Alpha relational schema, checked-in Drizzle migrations, a minimal App Router shell, Cloudflare D1 configuration, and D1-first database access. Collection-management screens, authentication, R2, AI, comprehensive catalog data, and the optional `build_relationships` and `attempt_piece_usage` tables are intentionally deferred.
