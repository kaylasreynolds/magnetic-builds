# Milestone 1 — My Collection

## Slice 1: Collection overview — complete

Established the functional collection read path:
- Cloudflare binding access during local Next.js development
- primary collection read model
- owned-set summaries from D1
- derived inventory from owned set contents
- inventory adjustments folded into usable inventory, including adjustment-only pieces
- Personal Alpha seed ownership for the confirmed starter sets
- verification queries for collection and derived inventory inputs

## Slice 2: Mobile collection experience — complete and locked

Locked reference:
- current mobile `/collection` implementation
- contained-shell behavior introduced in commit `7adb23f9`

The Slice 2 visual/layout implementation should not be changed unless the slice is explicitly reopened.

## Slice 3: Collection editing — in progress

Scope:
- add seeded/catalog sets to the primary collection
- add another copy of an already-owned set by incrementing quantity
- change quantity owned for an existing set
- remove a set from the collection
- immediately reflect ownership changes in the existing derived inventory calculation
- persist edits in D1 across refresh/restart

Implementation rule:
- `owned_sets` remains the ownership source of truth
- piece inventory remains derived from owned set contents plus inventory adjustments
- no separate persistent inventory total is introduced

Still deferred beyond Slice 3:
- inventory-adjustment controls
- authentication/user-specific collection resolution
- broad catalog ingestion beyond the curated seeded set library
