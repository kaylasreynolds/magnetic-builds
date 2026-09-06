# Tileable — Initial Database Schema

## Purpose

This document translates the conceptual model in `data_model.md` into the first practical database schema for Tileable.

The initial schema should support the Personal Alpha while preserving a reasonable path toward the broader product vision.

This schema is intentionally smaller than the complete conceptual data model.

Some future concepts may initially be represented through:

- Nullable fields
- JSON
- Derived values
- Application logic
- Simplified relationships

The goal is not to build every future table now.

The goal is to avoid early decisions that make important future distinctions difficult to support.

## Initial Scope

The first database should support:

- Brands
- Magnetic tile sets
- Piece families
- Manufacturer-specific piece definitions
- Set contents
- A personal collection
- Owned sets
- Inventory adjustments
- Inspiration
- Builds
- Build versions
- Build piece requirements
- Build attempts
- Results
- Modifications
- Photos and other media
- Source and confidence information

The first schema does not need to fully implement:

- Public community publishing
- Creator profiles
- Moderation
- Public contributions
- Open build problems
- Advanced 3D modeling
- Piece-to-piece connection graphs
- Community-derived knowledge
- Creator monetization

Those concepts remain represented in the broader data model and can be added as later product horizons require them.

## Database Conventions

### IDs

Primary records should use stable unique identifiers.

The implementation may use UUIDs or another globally unique identifier format appropriate to the chosen database.

IDs should not contain user-facing meaning.

### Timestamps

Major records should include:

- `created_at`
- `updated_at`

where useful.

Records representing events may also contain their own event-specific timestamps such as:

- `attempted_at`
- `completed_at`
- `captured_at`

### Nullable Values

A nullable value should be preferred over fabricated information.

For example:

- Unknown piece color → `NULL`
- Unknown brand → `NULL`
- Unknown build time → `NULL`
- Unknown exact quantity → `NULL` or an explicit range where supported

`NULL` should mean:

**Not currently known**

rather than:

**No**

Boolean values should therefore only be used when true/false is genuinely known.

### Controlled Values

Fields representing known states should use controlled values rather than arbitrary free text where practical.

Examples include:

- Confidence
- Build status
- Attempt result
- Requirement strictness
- Media type
- Source type

The implementation method may be:

- Database constraints
- Application-level enums
- Lookup tables

The exact mechanism can be chosen based on simplicity and maintainability.

### Flexible Metadata

JSON may be used for information that:

- Is expected to evolve frequently
- Is optional
- Does not yet need relational querying
- Would otherwise require premature schema complexity

Core relationships and quantities should not be hidden inside JSON when the application needs to query them regularly.

## Core Reference Tables

### `brands`

Represents a magnetic tile brand or product ecosystem.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `name` | Text | Yes | Example: MAGNA-TILES |
| `manufacturer` | Text | No | Manufacturer/company name |
| `website_url` | Text | No | Official website |
| `notes` | Text | No | General notes |
| `metadata_json` | JSON | No | Future brand characteristics |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

Brand names should not necessarily be assumed unique forever because manufacturers may reuse or reorganize product lines.

### `piece_families`

Represents the generic type of a magnetic tile piece independent of manufacturer.

Examples:

- Standard Square
- Large Square
- Equilateral Triangle
- Right Triangle
- Car Base
- Reinforced Panel

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `name` | Text | Yes | Human-readable family name |
| `category` | Text | No | Tile, structural, functional, decorative, specialty |
| `shape` | Text | No | Square, triangle, rectangle, etc. |
| `description` | Text | No | |
| `metadata_json` | JSON | No | Future geometric/functional properties |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

A Piece Family describes the general requirement.

It does not imply that every Piece Definition within the family is directly compatible.

### `piece_definitions`

Represents one manufacturer-specific physical component.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `piece_family_id` | ID | Yes | References `piece_families` |
| `brand_id` | ID | No | References `brands`; nullable for unidentified/generic pieces |
| `name` | Text | Yes | Product-specific or descriptive name |
| `manufacturer_identifier` | Text | No | SKU/part number if available |
| `width_mm` | Decimal | No | |
| `height_mm` | Decimal | No | |
| `depth_mm` | Decimal | No | |
| `classification_json` | JSON | No | Structural, functional, specialty, etc. |
| `properties_json` | JSON | No | Magnet/connection/structural properties |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

Color should generally not define a separate Piece Definition.

For example:

**Blue MAGNA-TILES Standard Square**

and

**Red MAGNA-TILES Standard Square**

should normally reference the same Piece Definition unless color has a functional difference.

Color can instead be represented where it is actually known or relevant.

### `sets`

Represents a packaged manufacturer product.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `brand_id` | ID | Yes | References `brands` |
| `name` | Text | Yes | |
| `set_identifier` | Text | No | Manufacturer set/SKU identifier |
| `advertised_piece_count` | Integer | No | Manufacturer-advertised total |
| `release_year` | Integer | No | |
| `product_url` | Text | No | Source or manufacturer page |
| `color_description` | Text | No | Example: Multicolor |
| `notes` | Text | No | |
| `metadata_json` | JSON | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

Exact color quantities are not required.

### `set_contents`

Joins a Set to its expected Piece Definitions.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `set_id` | ID | Yes | References `sets` |
| `piece_definition_id` | ID | Yes | References `piece_definitions` |
| `quantity` | Integer | No | Nullable when exact quantity is unknown |
| `color` | Text | No | Only when specifically known |
| `source_type` | Text | No | Manufacturer-confirmed, imported, estimated, etc. |
| `confidence` | Text | No | Confirmed, high, medium, low, unknown |
| `source_url` | Text | No | |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

A unique constraint should normally prevent duplicate rows for the same:

`set_id + piece_definition_id + color`

when color is meaningfully specified.

Unknown color should not create artificial duplicate records.

## Collection Tables

### `user_collections`

Represents a physical magnetic tile collection.

The Personal Alpha may contain only one collection, but it should still exist as its own entity rather than attaching inventory directly to a User.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `user_id` | ID | No initially | Future reference to user account |
| `name` | Text | Yes | Example: Home Collection |
| `description` | Text | No | |
| `is_primary` | Boolean | Yes | Default true in Personal Alpha |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

The Personal Alpha may use a seeded or local owner rather than implementing full authentication immediately.

### `owned_sets`

Represents known sets that belong to a User Collection.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `user_collection_id` | ID | Yes | References `user_collections` |
| `set_id` | ID | Yes | References `sets` |
| `quantity` | Integer | Yes | Default 1 |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

A user owning two identical sets should generally be represented by one Owned Set row with:

`quantity = 2`

unless later product requirements make individual set instances useful.

### `inventory_adjustments`

Represents deviations from the inventory expected from Owned Sets.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `user_collection_id` | ID | Yes | References `user_collections` |
| `piece_definition_id` | ID | Yes | References `piece_definitions` |
| `quantity_delta` | Integer | Yes | Positive or negative |
| `reason` | Text | No | Lost, damaged, extra, replacement, manual count, etc. |
| `color` | Text | No | Optional |
| `source_type` | Text | No | User-confirmed, photo-estimated, etc. |
| `confidence` | Text | No | |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

Examples:

Lost one square:

`quantity_delta = -1`

Added two individually purchased triangles:

`quantity_delta = +2`

### Calculated Inventory

The first implementation does not require a permanent `inventory_items` table if usable inventory can be calculated reliably from:

- Owned Sets
- Set Contents
- Inventory Adjustments

Conceptually:

`usable quantity = set-derived quantity + adjustment total`

This should initially be treated as a derived value.

If performance or future inventory workflows make a materialized inventory table useful later, one can be added without changing the conceptual model.

This avoids maintaining two competing sources of truth during the Personal Alpha.

## Build & Inspiration Tables

### `inspirations`

Represents a saved idea or reference that may later lead to a Build.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `user_id` | ID | No initially | Future account reference |
| `title` | Text | No | Optional for quick save |
| `description` | Text | No | |
| `source_url` | Text | No | Original source |
| `source_platform` | Text | No | Pinterest, manufacturer site, etc. |
| `creator_name` | Text | No | When known |
| `original_title` | Text | No | When known |
| `source_type` | Text | No | External, own-photo, manufacturer, etc. |
| `analysis_status` | Text | No | Not analyzed, partial, analyzed |
| `analysis_json` | JSON | No | Early AI/structure findings |
| `notes` | Text | No | Private user notes |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

An Inspiration record may exist with very little information.

A quick save may contain only:

- One image
- Optional title
- Optional source URL

This supports the product principle that saving should be easier than fully documenting.

### `builds`

Represents the long-lived identity of a build or project.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `owner_user_id` | ID | No initially | Future account reference |
| `source_inspiration_id` | ID | No | References `inspirations` |
| `title` | Text | No | Optional during quick save |
| `description` | Text | No | |
| `status` | Text | Yes | Planned, in progress, successful, etc. |
| `category` | Text | No | |
| `visibility` | Text | Yes | Default private |
| `preferred_version_id` | ID | No | References `build_versions` after creation |
| `metadata_json` | JSON | No | Tags, play context, other evolving data |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

A Build should not be replaced when the structure changes.

It remains the parent identity for its Build Versions and Attempts.

### `build_relationships`

Represents relationships between separate Builds.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `from_build_id` | ID | Yes | References `builds` |
| `to_build_id` | ID | Yes | References `builds` |
| `relationship_type` | Text | Yes | Revision, variation, remix, adaptation, inspired_by |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |

This table supports branching build lineage without forcing every change into one linear version history.

### `build_versions`

Represents one specific configuration of a Build.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `build_id` | ID | Yes | References `builds` |
| `parent_version_id` | ID | No | Optional previous version within same Build |
| `label` | Text | No | Human-readable label if useful |
| `version_order` | Integer | No | Internal ordering |
| `status` | Text | No | Draft, current, superseded, experimental |
| `summary` | Text | No | What changed or what this version represents |
| `brand_notes` | Text | No | Brand assumptions or tested context |
| `known_limitations` | Text | No | |
| `geometry_status` | Text | No | None, partial, complete, inferred |
| `metadata_json` | JSON | No | Dimensions, reinforcement summary, etc. |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

The Personal Alpha does not need to expose version numbers prominently.

A Build may simply have one current Build Version until a meaningful modification is saved.

### `build_piece_requirements`

Represents the pieces expected or required for one Build Version.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `build_version_id` | ID | Yes | References `build_versions` |
| `piece_family_id` | ID | No | Generic requirement |
| `piece_definition_id` | ID | No | Exact manufacturer-specific requirement |
| `quantity` | Integer | No | Exact quantity when known |
| `minimum_quantity` | Integer | No | Minimum required if flexible |
| `maximum_quantity` | Integer | No | Optional range support |
| `strictness` | Text | No | Exact, family, preferred, optional |
| `role` | Text | No | Structural, functional, decorative, reinforcement |
| `color` | Text | No | Only if meaningful/known |
| `source_type` | Text | No | User-confirmed, photo-estimated, model-derived, etc. |
| `confidence` | Text | No | Confirmed, high, medium, low, unknown |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

At least one of:

- `piece_family_id`
- `piece_definition_id`

should normally be present.

Both may be present when a requirement belongs to a known family but prefers or requires one specific implementation.

The schema should allow quantity to remain unknown.

For example:

> Standard squares required, exact hidden quantity unknown.

should be valid data.

### `attempts`

Represents one real-world effort to construct a Build Version.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `build_id` | ID | Yes | References `builds` |
| `build_version_id` | ID | No | References attempted version when known |
| `user_id` | ID | No initially | Future account reference |
| `attempted_at` | Timestamp | No | |
| `completed_at` | Timestamp | No | |
| `builder_context` | Text | No | Adult, adult+child, child assisted, etc. |
| `brand_context_json` | JSON | No | Brands actually used |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

An Attempt should be created even when construction is unsuccessful or unfinished.

### `attempt_piece_usage`

Represents the pieces actually used during an Attempt.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `attempt_id` | ID | Yes | References `attempts` |
| `piece_definition_id` | ID | No | Exact piece when known |
| `piece_family_id` | ID | No | Generic piece when exact brand is unknown |
| `quantity` | Integer | No | |
| `usage_type` | Text | No | Planned, substitution, reinforcement, extra |
| `color` | Text | No | Optional |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |

This table captures what actually happened rather than only what the Build Version specified.

### `results`

Represents the outcome of an Attempt.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `attempt_id` | ID | Yes | References `attempts` |
| `outcome` | Text | Yes | Worked as shown, worked with modifications, did not work, etc. |
| `actual_build_minutes` | Integer | No | |
| `difficulty` | Text | No | Easy, moderate, tricky, challenging |
| `construction_stability` | Text | No | |
| `play_stability` | Text | No | |
| `functional_success` | Text | No | |
| `reinforcement_required` | Boolean | No | Nullable when unknown |
| `substitutions_worked` | Boolean | No | Nullable when unknown/not applicable |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

The first implementation should normally enforce one Result per Attempt.

If later workflows need multiple evaluations of the same Attempt, this can be expanded.

### `modifications`

Represents a meaningful change made during or after an Attempt.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `attempt_id` | ID | Yes | References `attempts` |
| `build_version_id` | ID | No | Original version being modified |
| `description` | Text | Yes | |
| `modification_type` | Text | No | Reinforcement, substitution, geometry, sequence, other |
| `worked` | Boolean | No | Nullable if not yet tested |
| `details_json` | JSON | No | Pieces added/removed/replaced, structural purpose, etc. |
| `notes` | Text | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

A successful Modification may later be used to create a new Build Version.

The Modification record itself should remain as historical evidence rather than disappearing after promotion.

## Media Tables

### `media_assets`

Represents an uploaded or externally referenced image or other media asset.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `asset_type` | Text | Yes | Image initially; video/rendering later |
| `storage_key` | Text | No | Internal uploaded-file location |
| `external_url` | Text | No | For externally referenced content |
| `source_url` | Text | No | Original attribution/source |
| `mime_type` | Text | No | |
| `width` | Integer | No | |
| `height` | Integer | No | |
| `caption` | Text | No | |
| `alt_text` | Text | No | |
| `perspective` | Text | No | Front, rear, top, detail, etc. |
| `source_type` | Text | No | User upload, external reference, AI render |
| `confidence` | Text | No | Useful for AI-estimated perspective/classification |
| `metadata_json` | JSON | No | |
| `created_at` | Timestamp | Yes | |
| `updated_at` | Timestamp | Yes | |

An asset should support either uploaded storage or an external reference.

The exact storage implementation is separate from the database schema.

### `media_links`

Connects Media Assets to other records.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | ID | Yes | Primary key |
| `media_asset_id` | ID | Yes | References `media_assets` |
| `entity_type` | Text | Yes | Inspiration, build, version, attempt, modification, etc. |
| `entity_id` | ID | Yes | Referenced record ID |
| `role` | Text | No | Cover, finished, progress, reference, problem, etc. |
| `sort_order` | Integer | No | |
| `created_at` | Timestamp | Yes | |

For the Personal Alpha, this polymorphic link is a practical simplification.

If stronger relational constraints become valuable later, media relationships can be normalized into dedicated link tables.

## Source & Confidence Conventions

Tileable should use consistent source and confidence values across the schema wherever practical.

These values should initially be enforced in application logic or shared enums rather than requiring separate lookup tables.

### Source Types

Recommended initial values:

- `manufacturer_confirmed`
- `user_confirmed`
- `real_world_observed`
- `set_derived`
- `model_derived`
- `photo_estimated`
- `ai_inferred`
- `community_reported`
- `system_calculated`
- `imported`
- `unknown`

These values describe where information came from.

They do not describe how reliable the information is.

### Confidence Levels

Recommended initial values:

- `confirmed`
- `high`
- `medium`
- `low`
- `unknown`

Confidence and source should remain separate.

Examples:

`source_type = photo_estimated`  
`confidence = high`

or:

`source_type = user_confirmed`  
`confidence = confirmed`

### Status Values

The first implementation should use controlled values for frequently queried workflow states.

#### Build Status

Suggested initial values:

- `planned`
- `in_progress`
- `successful`
- `successful_with_modifications`
- `partially_successful`
- `unsuccessful`
- `untested`
- `archived`

#### Build Version Status

Suggested initial values:

- `draft`
- `current`
- `superseded`
- `experimental`

#### Attempt Outcome

Suggested initial values:

- `worked_as_shown`
- `worked_with_minor_modifications`
- `worked_with_significant_modifications`
- `partially_worked`
- `did_not_work`
- `did_not_finish`
- `plan_to_try_again`

#### Requirement Strictness

Suggested initial values:

- `exact`
- `family`
- `preferred`
- `optional`

#### Visibility

Suggested initial values:

- `private`
- `unlisted`
- `public`

The Personal Alpha may use only `private`, but the broader values should remain available so visibility does not require a schema redesign later.

### Enum Evolution

Controlled values should be easy to extend.

The implementation should avoid overly rigid database-level enums if changing them would require unnecessary migration complexity.

Application-level validation or text fields with database checks may be preferable initially.

## Constraints & Data Integrity

The database should enforce relationships that protect core data integrity without making incomplete records impossible to save.

### Foreign Keys

Foreign keys should generally be used for core relationships such as:

- `sets.brand_id`
- `set_contents.set_id`
- `set_contents.piece_definition_id`
- `piece_definitions.piece_family_id`
- `owned_sets.user_collection_id`
- `owned_sets.set_id`
- `inventory_adjustments.user_collection_id`
- `inventory_adjustments.piece_definition_id`
- `build_versions.build_id`
- `build_piece_requirements.build_version_id`
- `attempts.build_id`
- `results.attempt_id`
- `modifications.attempt_id`
- `media_links.media_asset_id`

### Deletion Behavior

Deletion rules should avoid accidentally removing historical evidence.

Recommended general behavior:

**Reference data**
Brands, Sets, Piece Families, and Piece Definitions should normally be archived or protected from deletion once referenced.

**Build data**
Deleting a Build should not silently orphan Attempts, Results, Modifications, or Media.

The initial application may use soft deletion or explicitly prevent destructive deletion when dependent records exist.

**Media**
Deleting a Media Link should not necessarily delete the underlying Media Asset if that asset is used elsewhere.

### Uniqueness

Useful uniqueness constraints may include:

- One `results` row per `attempt_id`
- One owned-set relationship per `user_collection_id + set_id` when quantity is stored on the row
- Unique manufacturer identifiers within the appropriate brand when reliable
- Unique piece-family names where practical

Strict uniqueness should not be applied when manufacturer data is inconsistent or incomplete.

### Quantity Rules

Quantities should generally follow these rules:

- Set quantities should not be negative
- Owned Set quantities should be greater than zero
- Build requirement quantities should be zero or greater when present
- Inventory adjustment deltas may be positive or negative
- Unknown quantities may remain `NULL`

The database should not convert unknown quantities into zero.

`0` means a known quantity of none.

`NULL` means the quantity is not currently known.

### Circular Relationships

Self-referential records should be validated to prevent obvious invalid relationships.

Examples:

- A Build should not be a Variation of itself
- A Build Version should not have itself as its parent
- A build relationship should not point from and to the same Build

More advanced cycle detection can remain application logic.

### Preferred Version

`builds.preferred_version_id` creates a circular reference with `build_versions.build_id`.

This is acceptable conceptually but should be implemented carefully.

A practical creation flow is:

1. Create Build
2. Create first Build Version
3. Update Build with `preferred_version_id`

The database should verify that the preferred version belongs to the same Build where practical.

## Initial Indexes

Indexes should support the workflows expected in the Personal Alpha rather than attempting to optimize every future feature.

Recommended indexes include:

### Reference Data

- `brands.name`
- `sets.brand_id`
- `sets.name`
- `piece_families.name`
- `piece_definitions.piece_family_id`
- `piece_definitions.brand_id`
- `set_contents.set_id`
- `set_contents.piece_definition_id`

### Collection

- `owned_sets.user_collection_id`
- `owned_sets.set_id`
- `inventory_adjustments.user_collection_id`
- `inventory_adjustments.piece_definition_id`

### Builds

- `inspirations.created_at`
- `builds.owner_user_id`
- `builds.status`
- `builds.created_at`
- `build_versions.build_id`
- `build_piece_requirements.build_version_id`
- `build_piece_requirements.piece_family_id`
- `build_piece_requirements.piece_definition_id`

### Attempts

- `attempts.build_id`
- `attempts.build_version_id`
- `attempts.attempted_at`
- `results.attempt_id`
- `modifications.attempt_id`

### Media

- `media_links.media_asset_id`
- `media_links.entity_type + entity_id`

Additional indexes should be added based on observed query patterns rather than speculation.

## Personal Alpha Schema Boundaries

The first working version of Tileable should implement only the schema necessary to support the primary personal workflow.

### Required for Personal Alpha

The initial implementation should prioritize:

- `brands`
- `piece_families`
- `piece_definitions`
- `sets`
- `set_contents`
- `user_collections`
- `owned_sets`
- `inventory_adjustments`
- `inspirations`
- `builds`
- `build_versions`
- `build_piece_requirements`
- `attempts`
- `results`
- `modifications`
- `media_assets`
- `media_links`

### Optional During Early Alpha

These may be added when a concrete workflow requires them:

- `build_relationships`
- `attempt_piece_usage`

They are structurally useful but should not block getting the first working product into use.

### Derived Rather Than Persisted Initially

The following should initially be calculated where practical:

- Current usable inventory
- Buildability status
- Missing-piece counts
- Collection match
- Overall build stability summary
- Build success statistics
- Typical build time

These values may later be cached or materialized if performance requires it.

### Deferred Tables

The following concepts should remain deferred until later horizons:

- User authentication tables beyond what the chosen auth system provides
- Creator profiles
- Publication records
- Public attempts
- Public contributions
- Open build problems
- Proposed solutions
- Moderation records
- Smart collection persistence
- Dedicated evidence graph
- Dedicated build observations
- Compatibility matrices
- Digital build models
- Piece instances
- Piece connections
- Instruction tables
- Instruction-step feedback

Deferring these tables does not mean the concepts are removed from the product vision.

They remain represented in `prd.md` and `data_model.md`.

### Schema Evolution Principle

Future migrations should extend the existing model rather than reinterpret old records whenever possible.

For example:

An Alpha Build saved with:

- Photos
- Piece requirements
- Attempts
- Results
- Modifications

should still be usable later when Tileable gains:

- Instructions
- 3D models
- Community publishing
- Advanced stability analysis

Users should not need to recreate early content simply because the product became more capable.

## Initial Schema Summary

The Personal Alpha database can be represented approximately as:

Brand
├── Set
│   └── Set Contents
└── Piece Definition
    └── Piece Family

User Collection
├── Owned Sets
└── Inventory Adjustments

Inspiration
    ↓
Build
    ↓
Build Version
    ├── Piece Requirements
    └── Attempt
        ├── Result
        └── Modifications

Media Assets
    ↓
Media Links
    ↓
Inspiration / Build / Version / Attempt / Modification

This schema is intentionally compact.

It supports the first useful Tileable experience while preserving a path toward the broader conceptual model.
