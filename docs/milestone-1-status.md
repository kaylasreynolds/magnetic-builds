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

## Slice 3: Collection editing — complete and production-verified

Implemented:
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

## Slice 4: Manual inventory adjustments — complete and production-verified

Implemented:
- correct the actual quantity of an existing piece from `/collection/pieces`
- preserve the calculated set-derived quantity
- store only the correction delta in `inventory_adjustments`
- immediately refresh collection and inventory totals after a correction
- keep correction history additive rather than overwriting prior adjustments

## Slice 5: Add loose pieces — in progress

Scope:
- add loose or individually purchased pieces from `/collection/pieces`
- select from known piece definitions already in the Magnetic Builds catalog
- optionally record a color
- enter a positive quantity
- persist the quantity as a positive `inventory_adjustments` entry with source type `loose_piece`
- immediately include the new pieces in collection and inventory totals

Implementation rule:
- loose pieces do not create fake owned sets
- loose pieces remain additive adjustments to the derived inventory model
- user-created piece definitions remain out of scope for Personal Alpha

Still deferred beyond Slice 5:
- authentication/user-specific collection resolution
- broad catalog ingestion beyond the curated seeded piece/set library
- user-created custom piece definitions
