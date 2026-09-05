# Magnetic Builds

Magnetic Builds is a private-first workspace for discovering, documenting, testing, and improving magnetic tile creations. This repository currently implements **Milestone 0 — Foundation** only.

## Prerequisites

- Node.js 22 or later
- npm 10 or later

## Local setup

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The JSON endpoint at `http://localhost:3000/api/health` verifies database access and reports counts for the seeded reference records. It returns a useful `503` response if the local database is missing or unavailable.

The seed is idempotent and contains only fictional records labeled **Development Sample**. It is infrastructure test data, not verified manufacturer catalog data.

## Database workflow

Local development uses SQLite through libSQL's local-file client. `src/db/schema.ts` is the shared Drizzle SQLite schema and is compatible with D1; runtime adapter selection remains isolated in `src/db/client.ts`.

```bash
# Generate a migration after editing the schema
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Load/reload idempotent sample records
npm run db:seed

# Delete only the configured local file, migrate, and seed it again
npm run db:reset
```

`db:reset` deliberately refuses non-`file:` database URLs. It cannot modify a remote database.

Usable inventory is intentionally not persisted. It will be derived from owned sets, set contents, and inventory adjustments in a later milestone.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

For a full clean-database check, run `npm run db:reset`, start the app with `npm run dev`, and request `curl --fail http://localhost:3000/api/health`.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `file:local.db` | Local SQLite/libSQL connection URL. |

Keep `.env.local` private. No authentication, object storage, AI service, or remote resource is configured in this milestone.

## Cloudflare preparation

`wrangler.toml` reserves only the Magnetic Builds application and D1 names. Before a future deployment:

1. Explicitly create a new D1 database named `magnetic-builds-production`.
2. Replace the placeholder database ID in `wrangler.toml` with that new database's ID.
3. Add the Cloudflare/OpenNext runtime adapter as a dedicated deployment change and construct Drizzle with `drizzle-orm/d1` using the `DB` binding.
4. Apply the checked-in migrations to that newly created database.

Do not point this project at an existing database or bucket. This repository does not create, mutate, or deploy any remote Cloudflare resource automatically.

## Foundation boundaries

The foundation includes the complete required Personal Alpha relational schema, migration and sample seed tooling, a minimal App Router shell, and a database diagnostic. Collection-management screens, authentication, R2, AI, comprehensive catalog data, and the optional `build_relationships` and `attempt_piece_usage` tables are intentionally deferred.
