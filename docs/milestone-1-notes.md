# Milestone 1 validation notes

Before merging the collection overview slice:

```bash
npm run db:migrate:local
npm run db:seed:local
npm run db:verify:local
npm run typecheck
npm run lint
npm run build
```

After merge, re-run the production seed so the confirmed starter ownership rows are added, then verify `/collection` against production D1.

No substantial visual styling is part of this slice.
