# Tileable — Data Model

## Purpose

This document defines the core information model for Tileable.

The goal is to establish what entities exist, how they relate, and which distinctions must be preserved before those concepts are translated into a specific database schema.

The data model should support the complete product vision described in `prd.md` while allowing the initial implementation to remain significantly simpler.

Not every entity or relationship described here must be fully implemented in the first version.

## Modeling Principles

### Preserve Reality, Estimates, and Theory Separately

Tileable will contain information from many different sources, including:

- Manufacturer specifications
- User-entered information
- Real-world build attempts
- Photographs
- AI analysis
- Community observations
- System calculations
- Theoretical designs

The data model should preserve where information came from and how confidently it is known.

An AI estimate should not silently become a confirmed fact.

### Unknown Is Valid Data

Missing information should not require the system to invent precision.

Examples include:

- Unknown exact color quantities in a set
- Unknown hidden pieces in an inspiration image
- Unknown brand of an individual piece
- Unknown reinforcement requirements
- Unknown compatibility between two pieces

The model should allow incomplete records to become more complete over time.

### Preserve History

A successful build should not erase the attempts, failures, modifications, or observations that led to it.

Where useful, Tileable should preserve the evolution of a build.

### Separate Identity From Quantity

A piece definition describes what a piece is.

Inventory describes how many of those pieces a user owns.

Build requirements describe how many of those pieces a build requires.

These should remain separate concepts.

### Separate Builds From Attempts

A Build represents the design or project.

An Attempt represents a real-world effort to construct that build.

One Build may have many Attempts.

This distinction allows Tileable to learn from both successful and unsuccessful real-world results.

### Design for Relationships

Tileable should favor explicit relationships over duplicating information.

For example:

- Sets contain pieces.
- Collections contain inventory.
- Builds require pieces.
- Attempts test builds.
- Results describe attempts.
- Inspiration can lead to builds.
- Builds can be related to other builds.
- Instructions describe how to construct a build.

These relationships form the foundation of the product's intelligence.

## Core Entities

### Brand

A Brand represents a magnetic tile product brand or product family.

Examples may include:

- MAGNA-TILES
- Connetix
- PicassoTiles
- Other compatible or specialty systems

A Brand may have:

- Brand name
- Manufacturer
- Website
- Notes
- Compatibility information
- Known construction characteristics

Brand information should remain separate from individual pieces because multiple pieces and sets belong to the same brand.

### Set

A Set represents a packaged magnetic tile product sold by a manufacturer.

A Set may contain:

- Brand
- Set name
- Set identifier
- Advertised piece count
- Known piece contents
- Optional color information
- Specialty components
- Release information
- Product images
- Source information

A Set does not directly represent a user's inventory.

Instead, a Set defines what is expected to be included when that product is purchased.

A user may own:

- One copy of a set
- Multiple copies of the same set
- Only part of a set
- Extra pieces beyond the original set
- Pieces no longer associated with a known set

### Piece Family

A Piece Family represents the general geometric or functional type of a piece independent of a specific manufacturer.

Examples:

- Standard Square
- Large Square
- Equilateral Triangle
- Right Triangle
- Rectangle
- Wheel Base
- Reinforced Panel
- Ball-Run Tube
- Door
- Window

Piece Families allow Tileable to reason about what a build fundamentally requires without assuming every manufacturer's implementation is identical.

For example:

**Standard Square**

is a Piece Family.

Specific MAGNA-TILES and Connetix squares would each be separate Piece Definitions associated with that family.

### Piece Definition

A Piece Definition represents one specific type of physical component.

A Piece Definition may include:

- Piece Family
- Brand
- Product-specific name
- Shape
- Dimensions
- Connection edges
- Magnet behavior
- Structural characteristics
- Functional characteristics
- Specialty classification
- Compatibility observations
- Optional color or finish information

A Piece Definition describes what the piece is.

It does not describe how many pieces a particular user owns.

### Piece Classification

Every Piece Definition may belong to one or more broad classifications.

Possible classifications include:

- Tile
- Structural Component
- Functional Component
- Decorative Component
- Specialty Component

Examples:

**Tile**
- Square
- Triangle
- Rectangle

**Structural Component**
- Reinforced panel
- Base plate
- Structural connector

**Functional Component**
- Car base
- Wheel assembly
- Ramp
- Ball-run component

**Decorative / Specialty Component**
- Door
- Window
- Figure
- Printed or themed piece

A piece may serve more than one purpose.

For example, a large reinforced base may be both structural and functional.

### Set Contents

Set Contents represents the relationship between a Set and the Piece Definitions expected to be included in it.

Each record may describe:

- Set
- Piece Definition
- Expected quantity
- Optional known color
- Source
- Confidence

For example:

**Classic 100-Piece Set**
- 50 × Standard Square
- 20 × Equilateral Triangle
- 12 × Right Triangle
- 18 × Other Pieces

The exact numbers above are illustrative only.

If exact manufacturer contents are not known, the relationship should be able to remain incomplete rather than requiring estimated data to appear confirmed.

### User Collection

A User Collection represents the magnetic tile inventory belonging to one user or household.

The collection is the container for what the user currently has available to build with.

A collection may contain inventory derived from:

- Known sets
- Multiple copies of known sets
- Individually added pieces
- Custom or unknown sets
- Manual adjustments
- Photo-derived estimates

A user may eventually have more than one collection if there is a useful reason to support that.

Examples might include:

- Home collection
- Classroom collection
- Travel set

Multiple collections are not required for the initial product.

### Owned Set

An Owned Set represents a user's ownership of a known Set.

It may record:

- User Collection
- Set
- Quantity owned
- Date added
- Notes
- Whether the set contents have been manually adjusted

Owned Sets provide a convenient way to establish inventory without manually adding every piece.

### Inventory Item

An Inventory Item represents the quantity of a Piece Definition available within a User Collection.

It may contain:

- User Collection
- Piece Definition
- Quantity
- Source
- Confidence
- Availability status

Possible sources include:

- Derived from owned set
- Manually entered
- Photo-estimated
- Imported
- System-adjusted from known changes

Possible availability states may include:

- Available
- Lost
- Damaged
- Temporarily unavailable
- Unknown

Inventory should represent the user's current usable collection rather than only the theoretical contents of purchased sets.

### Inventory Adjustment

An Inventory Adjustment records a change to expected inventory.

Examples:

- Lost one standard square
- Added two individually purchased triangles
- Replaced a damaged piece
- Found a previously missing piece
- Gave away a car base

An adjustment may contain:

- Piece Definition
- Quantity change
- Reason
- Date
- Notes

Preserving adjustments makes it possible to understand how calculated inventory differs from the original contents of owned sets.

### Inventory Calculation

Usable inventory may be calculated conceptually as:

**Set-Derived Inventory  
+ Individually Added Pieces  
+ Manual Adjustments  
- Unavailable Pieces**

The resulting quantity should be the value used when determining whether a build is possible.

The system should preserve the sources behind that quantity so the user can correct it when needed.

### Collection Relationship Summary

The collection side of the model can be represented conceptually as:

Brand
  ↓
Set
  ↓
Set Contents
  ↓
Piece Definition
  ↑
Piece Family

User Collection
  ├── Owned Sets
  │      ↓
  │   Set Contents
  │
  ├── Individual Pieces
  └── Inventory Adjustments
           ↓
      Calculated Inventory

## Build & Inspiration Entities

### Inspiration

An Inspiration record represents an external or internal idea that may eventually become a Build.

Examples include:

- Pinterest image
- Manufacturer build guide
- Screenshot
- Saved website
- Photo of someone else's build
- User's own rough idea
- Reference image
- Existing Tileable build

An Inspiration record may contain:

- Title
- Description
- Source URL
- Source platform
- Creator name, when known
- Original build name, when known
- Reference images
- Date saved
- User notes
- Attribution information
- Analysis status
- Estimated piece requirements
- Structural observations
- Confidence information

An Inspiration record does not represent a confirmed real-world build.

It represents what the user found, saw, or wants to explore.

### Build

A Build represents the central design or project being constructed, documented, tested, or improved.

A Build may begin from:

- Inspiration
- A user's original idea
- An AI-generated concept
- A completed real-world structure
- Another Build
- A remix or variation

A Build may contain:

- Title
- Description
- Category
- Tags
- Functional purpose
- Visibility
- Creator
- Source relationships
- Current status
- Current preferred version
- Instruction availability
- Stability summary
- Buildability information
- Metadata

The Build should act as the long-lived parent record.

It should not be replaced every time the design changes.

### Build Version

A Build Version represents one specific configuration of a Build.

A version may define:

- Piece requirements
- Geometry
- Dimensions
- Structural arrangement
- Reinforcement
- Functional components
- Digital model
- Instructions
- Photos
- Brand assumptions
- Known limitations

A Build may have multiple versions over time.

Build Versions should not require user-facing numeric labels such as:

- v1
- v2
- v3

unless that becomes useful later.

Internally, the system may still track creation order or revision history.

### Build Relationship

Build evolution should support branching rather than only linear versioning.

A Build Relationship connects one Build to another.

Possible relationship types include:

- Revision Of
- Variation Of
- Remix Of
- Inspired By
- Adaptation Of

For example:

Original Parking Garage
├── Reinforced Revision
├── Compact Variation
├── Toddler-Friendly Remix
└── Connetix Adaptation

Each related Build may have its own Versions, Attempts, Results, instructions, and photos.

This allows significant creative changes to become their own Builds without losing lineage.

### Revision vs. Version

A Version is a specific configuration inside the history of one Build.

A Revision may either:

- remain a new Build Version when it is clearly the same design being corrected or improved, or
- become a related Build when the change is substantial enough to deserve its own identity.

The exact user experience for this distinction can be refined later.

The data model should support both.

### Build Piece Requirement

A Build Piece Requirement represents a piece needed for one specific Build Version.

It may contain:

- Build Version
- Piece Family
- Exact Piece Definition, when required
- Required quantity
- Minimum quantity
- Optional quantity
- Whether substitution is allowed
- Whether the piece is structural
- Whether the piece is functional
- Whether the piece is decorative
- Whether the requirement is confirmed or estimated
- Source
- Confidence

This distinction allows Tileable to express requirements such as:

> 8 standard squares from any compatible brand

as well as:

> 1 specific MAGNA-TILES car base

A build should not require an exact manufacturer-specific piece when only the general geometry matters.

### Requirement Strictness

A piece requirement may eventually have a strictness level such as:

**Exact Required**  
The specific Piece Definition is necessary.

**Family Required**  
Any sufficiently compatible Piece Definition in the Piece Family may work.

**Preferred**  
The listed piece is preferred but substitutions are acceptable.

**Optional**  
The piece improves appearance, stability, or function but is not required.

This helps distinguish true missing-piece problems from harmless substitutions.

### Build Geometry

A Build Version may eventually include structured geometry describing how pieces are arranged and connected.

Geometry may contain:

- Piece instance
- Position
- Rotation
- Connection points
- Connected pieces
- Structural section
- Orientation
- Reinforcement role

Not every Build Version needs complete geometry.

Simple builds may exist with only photos, instructions, or piece lists.

More complete geometry enables:

- 3D representation
- Structural analysis
- Automatic instructions
- Connection validation
- Variations
- Photo-to-model reconstruction

### Build Section

Complex builds may be divided into logical sections.

Examples:

- Base
- Left wall
- Upper platform
- Ramp
- Roof
- Loading area
- Ball-run tower

Sections may help organize:

- Geometry
- Instructions
- Stability observations
- Reinforcement
- Problems
- Modifications

Sections should be optional.

### Attempt

An Attempt represents one real-world effort to construct a specific Build Version.

An Attempt may contain:

- Build
- Build Version attempted
- Date
- Builder context
- Brand or brands used
- Actual pieces used
- Substitutions
- Start and completion information
- Photos
- Notes
- Problems encountered
- Reinforcement added
- Construction observations
- Functional observations

One Build Version may have many Attempts.

An Attempt should exist even when the build fails.

### Attempt Piece Usage

The pieces actually used during an Attempt may differ from the planned Build Piece Requirements.

Attempt Piece Usage may record:

- Piece Definition
- Quantity used
- Whether it matched the requirement
- Whether it was a substitution
- Whether it was added as reinforcement
- Notes

This allows Tileable to learn the difference between:

**What the instructions said was needed**

and

**What actually worked.**

### Result

A Result describes the outcome of an Attempt.

Possible outcomes may include:

- Worked as Shown
- Worked With Minor Modifications
- Worked With Significant Modifications
- Partially Worked
- Did Not Work
- Did Not Finish
- Plan to Try Again

A Result may include:

- Outcome
- Actual build time
- Difficulty
- Construction stability
- Play stability
- Functional success
- Whether reinforcement was required
- Whether substitutions worked
- Notes
- Overall confidence in the result

The Result should describe the Attempt rather than overwrite the Build itself.

### Modification

A Modification records a meaningful change made during or after an Attempt.

Examples:

- Added two reinforcing squares
- Shortened the tower
- Replaced a large panel with individual squares
- Changed construction order
- Added a rear support wall
- Repositioned the ramp

A Modification may contain:

- Attempt
- Build section
- Description
- Pieces added
- Pieces removed
- Pieces replaced
- Structural purpose
- Functional purpose
- Whether the change worked
- Photos
- Notes

A successful Modification may later be promoted into:

- An updated Build Version
- A Revision
- A Variation
- A recommended reinforcement note
- An instruction change

Recording the Modification separately preserves the evidence that led to the improved design.

### Build Observation

A Build Observation represents a specific piece of knowledge learned about a Build or Build Version.

Examples:

- Rear wall collapses without reinforcement
- Ramp works better at a shallower angle
- Connetix version needs extra support
- Car base connection is difficult during Step 6
- Upper platform survives normal play once reinforced

An Observation may be associated with:

- Build
- Build Version
- Attempt
- Result
- Build Section
- Brand
- Instruction Step

An Observation should record its source.

Possible sources include:

- User report
- Physical attempt
- Manufacturer information
- AI analysis
- Community pattern
- System calculation

This allows accumulated build knowledge to remain traceable.

### Build Relationship Summary

The build side of the model can be represented conceptually as:

Inspiration
    ↓
Build
    ↓
Build Version
    ↓
Piece Requirements
    ↓
Attempt
    ↓
Actual Piece Usage
    ↓
Result
    ↓
Modifications / Observations

Builds may also branch:

Build
├── Revision
├── Variation
├── Remix
└── Adaptation

Each related Build can then have its own Versions and Attempts.

## Instructions, Media & Digital Representation

### Instruction

An Instruction represents guidance for constructing a specific Build Version.

A Build Version may have:

- No instructions
- One primary instruction set
- Multiple instruction sets for different audiences or methods

Examples may include:

- Standard instructions
- Child-friendly instructions
- Simplified instructions
- Photo-based instructions
- Interactive instructions

An Instruction may contain:

- Build Version
- Title
- Description
- Instruction type
- Intended builder context
- Difficulty
- Estimated build time
- Required preparation
- Piece list
- Reinforcement guidance
- Known limitations
- Publication status
- Source
- Confidence

Instructions should remain separate from the Build Version itself because instructions may change without changing the underlying structure.

### Instruction Step

An Instruction Step represents one stage in the construction process.

A step may contain:

- Instruction
- Step order
- Title or short action
- Description
- Pieces added
- Pieces removed
- Pieces repositioned
- Visual reference
- Build section
- Orientation information
- Connection guidance
- Reinforcement guidance
- Stability warning
- Functional test
- Optional alternatives
- Tips

Steps should be reorderable.

The system should not assume that a numerically valid sequence is physically practical.

Real-world feedback may reveal that a different order works better.

### Step Piece Usage

Step Piece Usage describes which pieces are introduced, removed, or manipulated during a specific Instruction Step.

It may include:

- Instruction Step
- Piece Definition or Piece Family
- Quantity
- Action
- Optional Piece Instance
- Notes

Possible actions may include:

- Add
- Remove
- Replace
- Rotate
- Move
- Reinforce
- Connect
- Disconnect

This structure allows Tileable to generate useful step-level piece preparation and visual highlighting.

### Instruction Feedback

Instruction Feedback represents real-world information about a specific instruction or step.

Possible feedback may include:

- Worked as shown
- Difficult but possible
- Needed reinforcement first
- Easier in another order
- Could not connect as shown
- Missing piece
- Image unclear
- Step unnecessary
- Additional explanation needed

Feedback may be associated with an Attempt so that instruction knowledge remains connected to real-world evidence.

Repeated feedback may eventually support suggested instruction improvements.

### Media Asset

A Media Asset represents an image, video, rendering, diagram, or other visual resource associated with Tileable content.

A Media Asset may be associated with:

- Inspiration
- Build
- Build Version
- Attempt
- Modification
- Instruction
- Instruction Step
- Piece Definition
- Set

A media record may contain:

- Asset type
- File location
- Original source
- Creator
- Caption
- Alt text
- Date created
- Date uploaded
- Visibility
- Attribution
- Analysis status
- Metadata

Media should be reusable across related records rather than requiring unnecessary duplicate uploads.

### Photo Perspective

For build photographs, the system may optionally record perspective information such as:

- Front
- Back
- Left
- Right
- Top
- Bottom
- Detail
- In-progress
- Finished build
- Unknown

Perspective information may be:

- User-confirmed
- AI-estimated
- Unknown

This may improve multi-photo analysis and photo-to-model reconstruction.

### Digital Build Model

A Digital Build Model represents a structured digital representation of one Build Version.

The model may be:

- Complete
- Partial
- AI-generated
- User-corrected
- Manually created
- Derived from photographs

A Build Version does not require a Digital Build Model in order to exist.

The model becomes useful when enough information is available to support capabilities such as:

- 3D viewing
- Structural reasoning
- Connection validation
- Automatic instruction generation
- Build editing
- Variation generation

### Piece Instance

A Piece Instance represents one individual piece placed inside a Digital Build Model.

This is different from a Piece Definition.

For example:

**MAGNA-TILES Standard Square**

is a Piece Definition.

The twelve individual squares used in one castle are twelve Piece Instances referencing that same definition.

A Piece Instance may contain:

- Digital Build Model
- Piece Definition
- Position
- Rotation
- Orientation
- Build section
- Visual properties
- Structural role
- Functional role

Optional visual properties may include color when known or useful.

### Piece Connection

A Piece Connection represents a connection between two Piece Instances.

It may contain:

- First Piece Instance
- Second Piece Instance
- Connection edge or point
- Connection type
- Orientation
- Confidence
- Validation status

Connection information may come from:

- User modeling
- Photo reconstruction
- AI inference
- Known piece geometry
- Real-world confirmation

A connection should not automatically be treated as physically valid simply because two digital pieces visually intersect.

### Model Completeness

A Digital Build Model should communicate how complete it is.

Possible states may include:

- Complete and Confirmed
- Complete but Partially Inferred
- Partial
- Approximate
- Experimental
- Unknown Completeness

This prevents a simplified digital model from being mistaken for a fully documented physical structure.

### Model-to-Instructions Relationship

Instructions may reference the Digital Build Model and Piece Instances to describe construction stages.

However, the data model should not require every instruction set to originate from a 3D model.

Instructions may also be created from:

- Real-world photos
- Manual written steps
- Manufacturer references
- User documentation
- AI-assisted interpretation

This allows simple and complex builds to coexist in the same system.

### Instruction & Model Relationship Summary

Build Version
├── Instruction
│   └── Instruction Steps
│       ├── Step Piece Usage
│       ├── Media
│       └── Instruction Feedback
│
├── Media Assets
│
└── Digital Build Model
    ├── Piece Instances
    └── Piece Connections

## Evidence, Provenance & Confidence

Tileable should preserve not only information, but how that information became known.

The same value may have very different reliability depending on its source.

For example:

> "This build uses 28 squares."

could mean:

- The creator manually counted 28 squares
- A manufacturer instruction guide specifies 28 squares
- AI detected approximately 28 squares from photographs
- Another builder reported using 28 squares
- The system inferred 28 squares from a digital model

These should not be treated as identical evidence.

### Evidence Record

An Evidence Record represents information supporting a fact, estimate, observation, or conclusion.

Evidence may come from:

- Manufacturer specification
- Manufacturer instruction guide
- User confirmation
- Real-world Attempt
- Photograph
- Video
- Digital Build Model
- AI analysis
- Community report
- External source
- System calculation

An Evidence Record may contain:

- Evidence type
- Source
- Source URL
- Related Media Asset
- Related Attempt
- Related user
- Date
- Notes
- Reliability
- Visibility

### Provenance

Important information should preserve provenance where practical.

Provenance answers:

**"Where did this information come from?"**

Examples:

**Set piece quantity**
- Manufacturer-confirmed

**User inventory**
- Derived from owned set

**Rear reinforcement**
- Confirmed during Attempt

**Hidden support pieces**
- AI-inferred from photographs

**Cross-brand compatibility**
- Reported by three builders

### Fact Source

A value may have a source type such as:

- Manufacturer Confirmed
- User Confirmed
- Real-World Observed
- Set-Derived
- Model-Derived
- Photo-Estimated
- AI-Inferred
- Community-Reported
- System-Calculated
- Imported
- Unknown

These source types may eventually be represented as reusable controlled values rather than free-text labels.

### Confidence

Confidence represents how strongly the available evidence supports a value or conclusion.

Possible confidence levels may include:

- Confirmed
- High
- Medium
- Low
- Unknown

Confidence should not replace provenance.

For example:

**Source:** Photo-Estimated  
**Confidence:** High

and:

**Source:** User Confirmed  
**Confidence:** Confirmed

communicate different kinds of information.

### Field-Level Confidence

Where important, confidence should be attachable to individual observations or values rather than only to an entire record.

For example:

In one inspiration analysis:

- Standard squares: High confidence
- Triangle count: Medium confidence
- Rear reinforcement: Low confidence
- Hidden floor structure: Unknown

This is more useful than labeling the entire analysis "70% confident."

### Conflicting Evidence

Tileable should allow different evidence sources to disagree.

For example:

Manufacturer instructions may list:

> 4 reinforcement panels

while a real-world Attempt records:

> Successfully built using 6 reinforcement panels.

The system should not necessarily overwrite one value with the other.

Instead, it may preserve both:

**Specified requirement:** 4  
**Observed successful usage:** 6

This distinction may reveal useful real-world knowledge.

### User Corrections

A user's deliberate correction should generally become the active value for that user's private record.

However, the previous estimate or source should remain recoverable where useful.

For example:

**AI estimate:** 12 squares  
**User correction:** 14 squares

The active build requirement becomes 14, while the system retains enough provenance to know that the original analysis estimated 12.

### Derived Knowledge

Some information may be calculated from other records.

Examples:

- Current usable inventory
- Buildability
- Typical build time
- Common reinforcement recommendation
- Compatibility confidence
- Success rate

Derived values should be recalculable from their underlying evidence whenever practical.

They should not become isolated facts that cannot be traced back to their inputs.

### Knowledge Over Time

Information may become more reliable as additional evidence is collected.

For example:

1. One inspiration photo suggests a structure is feasible.
2. AI identifies likely reinforcement.
3. The user attempts the build.
4. The build collapses.
5. Reinforcement is added.
6. The second attempt succeeds.
7. Additional builders reproduce the successful version.

The product should allow confidence and recommendations to evolve without losing the earlier history.

### No False Precision

When the evidence does not support an exact value, the model should allow:

- Ranges
- Approximate values
- Unknown values
- Competing possibilities

Examples:

**Hidden support pieces:** 2–4 likely

rather than:

**Hidden support pieces:** 3

when no evidence supports that exact number.

This principle should apply throughout the product.

## Users, Saved Content & Visibility

### User

A User represents a person with a Tileable account.

A User may have:

- Account information
- Profile information
- One or more User Collections
- Saved builds
- Saved inspiration
- Original builds
- Build attempts
- Personal notes
- Preferences
- Published content
- Creator information

The system should not require a public-facing profile simply because someone has an account.

### User Profile

A User Profile represents optional information used to personalize the experience.

It may include:

- Display name
- Profile image
- Preferred brands
- Builder preferences
- Typical play context
- Preferred difficulty
- Preferred build duration
- Public creator bio
- Privacy preferences

Private personalization data and public creator information should remain separable.

A user may have a private account profile without exposing the same information publicly.

### Household or Shared Collection

The initial product may associate one User with one primary collection.

The model should avoid assuming that ownership and physical use must always belong to one individual.

Future use cases may include:

- Shared family collection
- Classroom collection
- Childcare collection
- Library or community collection

If shared access is introduced later, permissions should be added deliberately rather than assuming all members have identical control.

### Saved Item

A Saved Item represents a user's personal relationship with a Build, Inspiration record, or other saveable content.

Saving should not duplicate the underlying content.

A Saved Item may contain:

- User
- Referenced content
- Save state
- Date saved
- Personal notes
- Personal organization
- Reminder or revisit status

Possible save states may include:

- Favorite
- Want to Build
- Currently Building
- Built
- Try Again
- Inspiration
- Archived

A user may change the state without altering the underlying public Build.

### Personal Collection

A Personal Collection is a user-created grouping of saved content.

Examples:

- Car Builds
- Ball Runs
- Quick Builds
- Toddler Favorites
- Weekend Ideas
- Things to Try Again

A Personal Collection may contain:

- Builds
- Inspiration
- Other saved records where useful

One saved item may belong to multiple Personal Collections.

### Smart Collection

A Smart Collection is a dynamic grouping generated from existing data rather than manually maintained by the user.

Examples:

- Ready to Build
- Almost Buildable
- Newly Buildable
- Continue Building
- Needs Another Try
- Recently Built

Smart Collections should be derived from current information and update automatically.

### Personal Note

A Personal Note represents private user commentary attached to content.

Examples:

> "Try this with the car base."

> "Make it shorter next time."

> "This worked better with reinforcement."

Personal Notes should remain private unless the user deliberately publishes or converts them into another public content type.

### Visibility

Content that may be shared should have an explicit visibility state.

Possible values include:

- Private
- Unlisted
- Public

**Private**
Accessible only to the owner and authorized collaborators, if collaboration exists.

**Unlisted**
Accessible through a direct link but normally excluded from public discovery.

**Public**
Eligible for public search, discovery, recommendations, and community use.

New personal content should default to Private.

### Publication Record

Publishing should be treated as a deliberate state or event rather than assuming the underlying record is inherently public.

A Publication Record may contain:

- Content being published
- Owner
- Visibility
- Published date
- Updated date
- Public title
- Public description
- Public media
- Attribution
- Moderation status
- Publication status

This allows a private working record to contain information that is not necessarily part of its public presentation.

### Public Build

A Public Build is the published representation of a Build that other users may discover.

The underlying Build remains the canonical design record.

Public presentation may expose selected information such as:

- Title
- Description
- Cover image
- Creator
- Piece requirements
- Instructions
- Build status
- Difficulty
- Build time
- Compatibility
- Stability
- Reinforcement guidance
- Attempts and aggregated results
- Attribution

Private notes, private media, and internal working information should not automatically become public.

### Creator Profile

A Creator Profile represents the optional public identity of a user who publishes builds.

It may include:

- Display name
- Bio
- Profile image
- Published builds
- Original designs
- Variations
- Remixes
- Build categories
- Tested brands
- Public build statistics

Creator Profiles should emphasize useful contribution rather than social popularity.

The model should not assume follower counts or engagement metrics are necessary.

### Public Attempt

When a user chooses to share the result of attempting a public Build, the Attempt may contribute to public build knowledge.

The user should control whether supporting information becomes public.

A Public Attempt may expose:

- Outcome
- Brand used
- Build time
- Difficulty
- Substitutions
- Reinforcement
- Functional result
- Stability observations
- Public notes
- Selected photos

The underlying private Attempt may contain additional information that is not published.

### Public Contribution

A Public Contribution represents useful community input that may not require publishing an entire Build.

Examples include:

- Reinforcement suggestion
- Instruction correction
- Compatibility observation
- Structural note
- Proposed solution to an Open Build Problem
- Build-sequence improvement

A contribution should retain:

- Contributor
- Related Build
- Related Build Version or Instruction Step where relevant
- Contribution type
- Content
- Evidence
- Status
- Date

### Contribution Status

Community contributions may move through states such as:

- Proposed
- Tested
- Confirmed by Creator
- Confirmed by Multiple Attempts
- Incorporated
- Rejected
- Superseded

The exact moderation and verification process can be determined later.

The model should preserve the difference between a suggestion and a verified improvement.

### Open Build Problem

An Open Build Problem represents a specific unresolved issue associated with a Build.

Examples:

- Upper level will not stay stable
- Connection is unclear
- Build fails with a specific brand
- Missing piece substitution needed
- Functional mechanism is unreliable

An Open Build Problem may contain:

- Build
- Build Version
- Build Section
- Instruction Step
- Problem type
- Description
- Evidence
- Status
- Creator
- Date created

Possible statuses may include:

- Open
- Proposed Solution
- Testing
- Resolved
- Closed Without Resolution

### Proposed Solution

A Proposed Solution represents a suggested response to an Open Build Problem.

It may include:

- Problem
- Contributor
- Description
- Piece substitutions
- Reinforcement
- Construction-order change
- Structural modification
- Supporting media
- Test result

A Proposed Solution should not alter the canonical Build automatically.

Successful solutions may later become:

- Build Observation
- Instruction update
- Build Version
- Revision
- Variation
- Verified recommendation

### Moderation Record

Public content may require moderation without changing the core Build data.

A Moderation Record may contain:

- Referenced public content
- Report reason
- Reporter
- Moderation status
- Moderator action
- Notes
- Date

Possible report reasons may include:

- Unsafe content
- Misleading information
- Attribution problem
- Inappropriate media
- Spam
- Harassment
- Other policy issue

An unsuccessful Build should not be treated as a moderation problem simply because it failed.

### User & Public Content Relationship Summary

User
├── User Profile
├── User Collection
├── Saved Items
│   ├── Personal Collections
│   └── Personal Notes
├── Builds
├── Attempts
└── Creator Profile (optional)

Build
├── Private Working Record
├── Publication Record
│   └── Public Build
├── Public Attempts
├── Public Contributions
└── Open Build Problems
    └── Proposed Solutions

## Conceptual Entity Relationship Summary

The major Tileable entities can be viewed as several connected domains.

### Collection Domain

Brand
  ↓
Set
  ↓
Set Contents
  ↓
Piece Definition
  ↑
Piece Family

User
  ↓
User Collection
  ├── Owned Sets
  ├── Inventory Items
  └── Inventory Adjustments
           ↓
      Usable Inventory

### Build Domain

Inspiration
    ↓
Build
    ↓
Build Version
    ├── Build Piece Requirements
    ├── Build Sections
    ├── Media Assets
    ├── Instructions
    └── Digital Build Model
            ├── Piece Instances
            └── Piece Connections

Build Version
    ↓
Attempt
    ├── Attempt Piece Usage
    ├── Media Assets
    ├── Modifications
    └── Result
            ↓
       Build Observations

### Build Evolution Domain

Build
├── Revision
├── Variation
├── Remix
├── Adaptation
└── Inspired By

Relationships should preserve lineage without forcing all change into one linear version history.

### Instruction Domain

Build Version
    ↓
Instruction
    ↓
Instruction Step
    ├── Step Piece Usage
    ├── Media Assets
    └── Instruction Feedback

### Knowledge Domain

Manufacturer Information
User Confirmation
Real-World Attempts
Photos
Digital Models
AI Analysis
Community Reports
System Calculations
        ↓
Evidence / Provenance
        ↓
Facts, Estimates, Observations & Derived Knowledge
        ↓
Confidence

### Personal Organization Domain

User
├── Saved Items
├── Personal Collections
├── Smart Collections
├── Personal Notes
└── History

### Community Domain

User
    ↓
Creator Profile
    ↓
Public Build
    ├── Public Attempts
    ├── Public Contributions
    ├── Build Relationships
    └── Open Build Problems
            ↓
       Proposed Solutions

## Data Model Boundaries

This conceptual model is intentionally broader than the first implementation.

The initial database does not need a separate table for every concept described in this document.

Some concepts may initially be represented through:

- Nullable fields
- Structured JSON
- Simplified relationships
- Derived values
- Application logic

However, implementation shortcuts should not erase important conceptual distinctions.

In particular, the first implementation should avoid collapsing:

- Set definitions into user inventory
- Piece definitions into inventory quantities
- Inspiration into Builds
- Builds into Attempts
- Attempts into Results
- Builds into one immutable configuration
- Estimated data into confirmed data
- Private working data into public content
- Build lineage into duplicated independent records

The implementation schema should be designed around the first useful product while preserving a reasonable path toward this broader model.
