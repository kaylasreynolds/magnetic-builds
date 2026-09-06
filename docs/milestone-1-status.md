# Milestone 1 — My Collection

**Status: complete, production-verified, and real-world usability validated**

Milestone 1 is complete. The user can add actual magnetic tile sets, see the resulting derived piece inventory, correct inaccurate quantities, add loose pieces, and retain the collection across refresh/restart without creating a second inventory source of truth.

Real-world hands-on testing surfaced usability defects, those defects were repaired in the Milestone 1 usability pass, and the workflow was successfully retested after deployment.

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

## Slice 5: Add loose pieces — complete and production-verified

Implemented:
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

## Real-world usability validation — complete

Hands-on use identified and verified fixes for:
- dark-mode collection and piece-edit sheets
- add-set hover, press, animation, and success feedback
- clearer `Add 1` wording with current ownership shown separately
- safe duplicate-copy removal without deleting the full owned-set row
- less repetitive piece labels
- explicit `Edit count` controls instead of entire rows acting as hidden edit buttons
- redundant duplicate color labels such as `Green` / `green`

The repaired workflow was retested successfully after deployment. Milestone 1 is therefore considered **real-world usability validated**.

## Milestone 1 acceptance verification

The Milestone 1 acceptance criteria in `docs/implementation_plan.md` are satisfied:

1. The application opens and the collection workflow is available.
2. The user can add actual seeded magnetic tile sets and change owned copy counts.
3. Owned set contents are translated into derived piece quantities.
4. The user can correct inaccurate quantities and add loose pieces.
5. Collection ownership and adjustments persist in D1 across refresh/restart.
6. The collection is presented through user-facing set and piece inventory views without requiring raw database inspection.

Nice-to-have items such as piece imagery, collection search/filtering, and contribution tracing remain non-blocking by definition.

Deferred beyond Milestone 1:
- authentication/user-specific collection resolution
- broad catalog ingestion beyond the curated seeded piece/set library
- user-created custom piece definitions
