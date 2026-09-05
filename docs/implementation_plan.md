# Magnetic Builds — Implementation Plan

## Purpose

This document defines the practical build sequence for the first usable version of Magnetic Builds.

The implementation plan should follow the product requirements in `prd.md` and the structure defined in `data_model.md` and `schema.md`.

The goal is to create a working Personal Alpha as quickly as possible without taking shortcuts that would make the broader product unnecessarily difficult to build later.

This plan is organized around user-visible milestones rather than technical layers alone.

Each milestone should leave the product more usable than it was before.

## Planning Principles

### Build the Smallest Useful Vertical Slice

Each milestone should connect enough of the system to create a real workflow.

For example, adding database tables without any way to use them is not considered a complete milestone.

Whenever practical, a milestone should include:

- Data model
- Server logic
- User interface
- Validation
- Basic error handling
- A usable end-to-end workflow

### Personal Alpha First

The first user is the product owner.

The application may initially assume:

- One user
- One primary collection
- Private content only
- A small manually curated set library
- Limited or no AI automation

Authentication, public publishing, community features, and advanced permissions should not block the Personal Alpha.

### Manual Before Automated

Where future AI or automation is expected, the initial product may use manual input first.

Examples:

- Manually entering piece requirements before photo recognition
- Manually documenting modifications before automated structural analysis
- Manually selecting pieces before photo-based inventory
- Manually writing instructions before automatic instruction generation

This allows the underlying workflows to be tested before investing in automation.

### Preserve Upgrade Paths

Early workflows should save information in structures that future capabilities can build upon.

A manual Build Piece Requirement should later be usable by AI analysis.

A manually documented Attempt should later contribute to stability intelligence.

A saved Inspiration record should later support photo analysis.

### Avoid Premature Complexity

Do not implement future infrastructure simply because it appears in the long-term data model.

Add complexity when a real product workflow requires it.

### Real Use Drives Priorities

The Personal Alpha should be used with actual magnetic tile building.

Problems encountered during real use should influence implementation priorities more strongly than speculative feature ordering.

## Milestone 0 — Foundation

### Goal

Create a stable project foundation that can support the first product workflows.

### Deliverables

- Application framework initialized
- Local development environment working
- Database selected and configured
- Migration system working
- Initial environment configuration
- Core folder structure
- Shared type conventions
- Basic application shell
- Error boundary or equivalent basic failure handling
- Seed-data mechanism
- Development documentation

### Initial Database

Create migrations for the first reference and collection tables:

- `brands`
- `piece_families`
- `piece_definitions`
- `sets`
- `set_contents`
- `user_collections`
- `owned_sets`
- `inventory_adjustments`

Build-related tables may be included in the same initial migration if that simplifies development, but the application does not need to expose them yet.

### Seed Data

Add a very small amount of known real data rather than attempting to populate the entire magnetic tile market.

Initial seed data should be enough to test the collection workflow.

Start with:

- Brands actually owned
- Sets actually owned
- Piece families required by those sets
- Piece definitions required by those sets
- Known set contents

Unknown manufacturer information should remain unknown rather than guessed.

### Acceptance Criteria

Milestone 0 is complete when:

- The application runs locally
- Database migrations can be applied from a clean database
- Seed data can be loaded
- Seeded brands, sets, and pieces can be queried successfully
- The project can be cloned and started using documented steps

## Milestone 1 — My Collection

### Goal

Allow the user to tell Magnetic Builds which magnetic tile sets they own and see the resulting usable piece inventory.

This is the first major product capability because collection awareness powers later buildability features.

### Core Workflow

User opens My Collection.

↓  

User adds a known set.

↓  

Magnetic Builds expands the set into its known pieces.

↓  

User sees the calculated collection.

↓  

User can adjust the collection when reality differs from the original set contents.

### Deliverables

#### Collection Overview

Provide a simple collection view showing:

- Owned sets
- Number of copies
- Calculated pieces by Piece Family
- Manufacturer-specific pieces where useful
- Unknown or incomplete inventory information
- Collection accuracy/context where relevant

The interface should prioritize understandable piece counts over database terminology.

#### Add Set

Allow the user to:

- Search available seeded sets
- View basic set information
- Add a set
- Specify multiple copies
- Remove an accidentally added set

Adding a set should update calculated inventory immediately.

#### Inventory Calculation

Implement the derived inventory calculation:

`Owned Set Contents + Inventory Adjustments`

Do not create a separate persistent inventory source of truth unless implementation needs demonstrate a clear reason.

#### Manual Adjustments

Allow the user to adjust piece quantities.

Examples:

- Missing one standard square
- Extra two triangles
- Lost a car base
- Added individually purchased pieces

The UI does not need to expose `quantity_delta` terminology.

It may instead use friendly actions such as:

- Add Pieces
- Mark Missing
- Correct Quantity

#### Unknown Information

The interface should remain usable when:

- Exact set contents are incomplete
- Exact colors are unknown
- Brand is unknown for loose pieces
- Quantity is estimated

Unknown values should not appear as zero.

### Nice-to-Have During Milestone

If straightforward:

- Piece-family grouping
- Small piece images/icons
- Filter by brand
- Search collection
- Show which sets contributed to a piece count

These should not block milestone completion.

### Acceptance Criteria

Milestone 1 is complete when the user can:

1. Open the application
2. Add their actual magnetic tile sets
3. See the collection translated into piece quantities
4. Correct at least one inaccurate quantity
5. Refresh/restart without losing the saved collection
6. Understand the collection without needing to inspect raw database data

## Milestone 2 — Save a Build

### Goal

Allow the user to preserve something they physically built before it is dismantled, damaged, or forgotten.

This milestone should validate the "I Made Something" workflow with minimal data entry.

### Core Workflow

User chooses to save a build.

↓  

User adds one or more photos.

↓  

User optionally adds a title.

↓  

Build is saved immediately.

↓  

User may add more information now or later.

### Deliverables

#### Create Build

Allow a Build to be created with:

- Optional title
- Optional description
- Default private visibility
- Initial Build Version
- Created timestamp

The system should not require a full piece list, category, difficulty, or instructions before saving.

#### Photo Upload

Allow one or more images to be associated with the Build or initial Build Version.

The first implementation should support:

- Image upload
- Preview
- Remove before save
- Multiple photos
- Basic ordering
- Cover image selection if straightforward

#### Build Library

Provide a simple My Builds view showing saved Builds.

Each Build may display:

- Cover image
- Title or fallback label
- Date saved
- Status

Untitled Builds should remain easy to identify and rename later.

#### Build Detail

Provide a Build detail page where the user can:

- View photos
- Edit title
- Edit description
- Change status
- Add notes
- View current Build Version

#### Quick Save Principle

The fastest valid save should remain approximately:

**Photo + Save**

Everything else should be optional.

### Acceptance Criteria

Milestone 2 is complete when the user can:

1. Photograph a real magnetic tile build
2. Save it with minimal input
3. Find it again later
4. View all associated photos
5. Add or edit information after the original save

## Milestone 3 — Piece Requirements & Buildability

### Goal

Connect Builds to the user's collection so Magnetic Builds can answer its first major intelligence question:

**"Can I build this with what I own?"**

### Deliverables

#### Build Piece Requirements

Allow the user to manually add piece requirements to a Build Version.

A requirement should support:

- Piece Family
- Exact Piece Definition when necessary
- Quantity
- Requirement strictness
- Optional notes
- Confidence/source where useful

The first UI should make common cases simple.

For example:

**Standard Square — 12**

should not require exposing advanced strictness settings unless the user needs them.

#### Buildability Calculation

Compare Build Piece Requirements against calculated User Collection inventory.

Initial logic may support:

- Ready to Build
- Almost Buildable
- Insufficient Pieces
- Unknown

More advanced substitution logic can be added later.

#### Missing Pieces

When a Build is not fully supported, show:

- Required quantity
- Available quantity
- Missing quantity

Do not recommend purchases yet.

#### Family vs. Exact Requirement

Support the distinction between:

**Any compatible Standard Square**

and:

**This specific Car Base**

even if cross-brand compatibility logic is not yet sophisticated.

#### Build Library Indicators

Where useful, show basic buildability status on saved Builds.

Example:

- Ready to Build
- Missing 3 Pieces
- Requirements Unknown

### Acceptance Criteria

Milestone 3 is complete when:

1. A Build can have a manually confirmed piece list
2. The system calculates whether the user's collection satisfies it
3. Missing pieces are clearly identified
4. Unknown requirements remain unknown rather than being treated as missing
5. Updating the user's collection automatically changes buildability results

## Milestone 4 — Attempts, Results & Modifications

### Goal

Allow Magnetic Builds to record what happens when a Build is actually attempted in the real world.

This milestone establishes one of the product's most important distinctions:

**The design is not the same thing as what happened when someone tried to build it.**

### Core Workflow

User opens a Build.

↓  

User chooses Try This Build.

↓  

Attempt is created.

↓  

User builds in the real world.

↓  

User records what happened.

↓  

If necessary, user records a modification.

↓  

Result becomes part of the Build history.

### Deliverables

#### Start Attempt

Allow the user to create an Attempt associated with:

- Build
- Current Build Version
- Attempt date

Optional information may include:

- Builder context
- Brand used
- Notes

#### Attempt Detail

Provide a focused place to record:

- Progress notes
- Photos
- Problems
- Reinforcement
- Changes
- Completion status

This should not require documenting every construction step.

#### Record Result

Allow a user to select an outcome such as:

- Worked as Shown
- Worked With Minor Modifications
- Worked With Significant Modifications
- Partially Worked
- Did Not Work
- Did Not Finish
- Plan to Try Again

Optional result information may include:

- Actual build time
- Difficulty
- Construction stability
- Play stability
- Functional success
- Notes

#### Record Modification

Allow a user to record a meaningful change.

At minimum:

- Description
- Modification type
- Whether it worked
- Optional photo
- Notes

Examples:

- Added rear reinforcement
- Shortened tower
- Changed ramp position
- Replaced large square with smaller pieces

#### Build History

A Build should show its real-world history.

For example:

**Attempt 1**
Did Not Work  
Rear wall collapsed.

**Modification**
Added two reinforcing squares.

**Attempt 2**
Worked With Modifications.

The interface does not need to resemble a technical audit log.

It should feel like remembering what happened.

### Acceptance Criteria

Milestone 4 is complete when:

1. The same Build can have multiple Attempts
2. An unsuccessful Attempt can be saved
3. A Result can be recorded without changing the original Build record
4. A Modification can be attached to an Attempt
5. A later Attempt can succeed without erasing the earlier failure
6. The user can understand the Build's history from the UI

## Milestone 5 — Inspiration

### Goal

Support the "I Found Something" workflow.

The user should be able to save an idea from elsewhere without pretending it has already been built or validated.

### Deliverables

#### Save Inspiration

Allow the user to save:

- Image
- Optional title
- Source URL
- Source platform
- Creator name when known
- Notes

Only the image or source should be necessary for a quick save.

#### Inspiration Library

Provide a place to browse saved Inspiration separately from completed Builds.

#### Inspiration Detail

Allow the user to:

- View source information
- Add notes
- Add additional reference images
- Edit attribution
- Convert Inspiration into a Build

#### Convert to Build

Creating a Build from Inspiration should:

- Preserve the Inspiration
- Create a separate Build
- Store the relationship between them
- Copy only appropriate starting information

The original Inspiration should remain unchanged.

### Acceptance Criteria

Milestone 5 is complete when the user can:

1. Save a Pinterest or other inspiration image
2. Preserve where it came from
3. Find it later
4. Turn it into a Build
5. Attempt that Build
6. Still distinguish the original inspiration from what actually happened

## Personal Alpha Completion Checkpoint

Milestones 0–5 together define the first complete Personal Alpha.

At this point, Magnetic Builds should support the entire foundational loop:

Collection
    ↓
Save Inspiration or Build
    ↓
Document Piece Requirements
    ↓
Compare Against Collection
    ↓
Attempt Build
    ↓
Record Result
    ↓
Document Modifications
    ↓
Try Again
    ↓
Preserve What Worked

The product should be used with real magnetic tile building before advanced automation becomes the primary focus.

### Personal Alpha Validation

Before moving heavily into AI, 3D modeling, or community features, use the Alpha to answer:

- Is saving a Build fast enough to happen in real life?
- Is saving Inspiration easier than leaving it scattered elsewhere?
- Is collection setup worth the effort?
- Is the calculated inventory understandable?
- Are piece requirements practical to document manually?
- Does Buildability provide useful information?
- Does recording an unsuccessful Attempt feel worthwhile?
- Are Modifications easy enough to preserve?
- Can a previously successful Build actually be reconstructed later?
- Which parts feel like unnecessary data entry?
- Which information do we repeatedly wish the system could infer automatically?
- Which information sounded important in the PRD but rarely matters during actual use?

### Alpha Principle

Do not automate a frustrating workflow merely because it exists.

First determine whether the workflow itself is useful.

If a manual process is consistently valuable but tedious, it becomes a strong candidate for automation.

If a manual process is rarely useful, automation may not make it worth keeping.

## Post-Alpha Development

The milestones after the Personal Alpha describe major capability areas rather than a rigid development sequence.

Their final order should be influenced by actual Personal Alpha usage.

A capability may move earlier when it solves a frequent real-world problem.

Likewise, a capability may move later when the manual workflow proves sufficient.

The likely development areas are described below.

## Milestone 6 — Search, Organization & Recovery

### Goal

Make saved Builds and Inspiration easy to recover without requiring perfect organization or exact titles.

Magnetic Builds should become more useful as its library grows rather than harder to navigate.

### Deliverables

#### Unified Search

Allow search across:

- Build titles
- Descriptions
- Inspiration
- Notes
- Piece requirements
- Categories
- Tags
- Attempt notes
- Results
- Modifications

Initial search may use conventional text matching.

Natural-language and semantic search can be introduced later.

#### Useful Filters

Possible filters may include:

- Build status
- Ready to Build
- Missing Pieces
- Category
- Brand
- Piece Family
- Date
- Successful Builds
- Unsuccessful Attempts
- Inspiration only

Filters should be added based on actual usefulness rather than exposing every available field.

#### Personal Organization

Allow lightweight organization such as:

- Favorites
- Want to Build
- Try Again
- Archived

Custom Personal Collections may be added if useful during Alpha testing.

#### History

Provide easy access to:

- Recently viewed
- Recently saved
- Recently built
- Recent Attempts

#### Friendly Recovery

Search should eventually tolerate imperfect memory.

Examples:

> "garbage truck"

> "the pom-pom thing"

> "that tall thing that collapsed"

> "builds using the car base"

The initial implementation does not need full semantic understanding, but the underlying search model should leave room for it.

### Acceptance Criteria

Milestone 6 is complete when:

1. A growing library remains easy to navigate
2. Builds can be found without remembering their exact titles
3. Successful and unsuccessful Builds can be filtered separately
4. Saved Inspiration can be recovered easily
5. The user does not need to manually organize every item before it becomes findable

## Milestone 7 — Photo-Assisted Documentation

### Goal

Reduce manual documentation by allowing Magnetic Builds to extract useful information from photos while remaining explicit about uncertainty.

This should assist the user rather than silently replace their judgment.

### Core Workflow

User uploads Build photos.

↓

Magnetic Builds analyzes visible information.

↓

System proposes observations.

↓

User confirms, corrects, or ignores them.

↓

Confirmed information becomes part of the Build record.

### Initial Analysis Targets

Photo analysis may attempt to identify:

- General build type
- Visible Piece Families
- Approximate piece quantities
- Specialty components
- Vehicle components
- Reinforcement
- Major structural sections
- Repeated patterns
- Possible hidden components
- Areas that cannot be interpreted confidently

Exact color detection should not be a requirement for useful analysis.

### Observation-Level Confidence

Analysis should preserve uncertainty by observation.

Example:

**Standard squares**
High confidence — approximately 18 visible

**Car base**
High confidence — 1 visible

**Rear support**
Low confidence — structure obscured

**Hidden floor pieces**
Unknown

The user should never need to accept an entire analysis as one all-or-nothing result.

### Correction Workflow

Allow the user to:

- Confirm detection
- Change Piece Family
- Change Piece Definition
- Correct quantity
- Add missing piece
- Remove incorrect detection
- Mark hidden piece as confirmed
- Change confidence where appropriate

User-confirmed information should become more authoritative than the original AI estimate.

### Multiple Photos

Analysis should eventually reason across multiple views of the same Build.

The system may identify when additional photos would materially improve understanding.

For example:

> "I can see the front and sides, but not how the upper platform is supported. A rear photo would help."

Providing another photo should remain optional.

### Suggested Documentation

Photo analysis may also suggest:

- Title
- Description
- Category
- Tags
- Approximate difficulty
- Functional characteristics
- Potential reinforcement
- Useful follow-up questions

Suggestions should remain optional.

### Acceptance Criteria

Milestone 7 is complete when:

1. A Build photo produces useful structured suggestions
2. Estimated information remains visibly distinct from confirmed information
3. The user can correct analysis quickly
4. Multiple photos improve analysis when available
5. Photo assistance measurably reduces manual documentation
6. Incorrect AI analysis does not corrupt confirmed Build data

## Milestone 8 — Advanced Buildability & Substitutions

### Goal

Move beyond exact piece-count matching and help users determine how a Build could work with the collection they actually own.

### Deliverables

#### Buildability States

Expand Buildability to support:

- Ready to Build
- Ready With Substitutions
- Almost Buildable
- Modification Suggested
- Insufficient Pieces
- Unknown

#### Requirement Matching

Buildability should consider:

- Piece Family
- Exact Piece Definition requirements
- Quantity
- Requirement strictness
- Brand
- Known compatibility
- Specialty pieces
- Structural role
- Unknown requirements

Color should not normally block Buildability.

#### Substitutions

When exact pieces are unavailable, evaluate whether:

- Another Piece Definition in the same Family can substitute
- Another compatible brand can substitute
- Several smaller pieces might replace one larger component
- A structurally different component may work with limitations

Substitutions should indicate why they are considered acceptable.

#### Functional vs. Exact Match

Distinguish where useful between:

**Exact Match**  
The intended pieces are available.

**Functional Match**  
The Build can probably function correctly using substitutions.

**Adaptable Match**  
The original structure cannot be recreated exactly, but a modification may make the idea work.

#### Collection-First Recommendations

When pieces are missing, the first response should remain:

**"Can we make this work with what you already have?"**

Potential responses may include:

- Substitute another compatible piece
- Reduce Build size
- Remove decorative elements
- Modify reinforcement
- Use another owned component

Purchasing additional pieces should not be the default solution.

#### Confidence

Buildability should distinguish certainty from possibility.

Example:

**Collection Match:** Ready With Substitutions  
**Confidence:** High

versus:

**Collection Match:** Probably Buildable  
**Confidence:** Low  
Hidden supports are unknown.

### Acceptance Criteria

Milestone 8 is complete when:

1. Buildability can reason beyond identical piece IDs
2. Missing pieces can produce useful substitutions
3. Exact and functional matching are distinguishable
4. Unknown structural requirements remain visible
5. Recommendations prioritize the user's existing collection

## Milestone 9 — Build Instructions

### Goal

Allow a successful Build to become something that can reliably be recreated later.

### Deliverables

#### Instruction Creation

Allow the user to create an Instruction set for a Build Version.

Support:

- Step ordering
- Written guidance
- Step photos
- Pieces required per step
- Reinforcement notes
- Stability warnings
- Tips
- Functional checks

Instructions should be editable at any time.

#### Manual First

The initial instruction editor may be completely manual.

This establishes:

- What users actually need in a step
- How much detail is useful
- Which types of photos work
- Where instruction creation becomes tedious

This information should guide later automatic instruction generation.

#### Build Mode

Provide a focused instruction-following experience.

Build Mode may include:

- Current step
- Previous / Next
- Pieces needed now
- Step image
- Written guidance
- Reinforcement warning
- Progress
- Pause and resume

The interface should work well while the device is sitting nearby during physical construction.

#### Instruction Feedback

An Attempt may record when a step:

- Worked as shown
- Was difficult
- Needed reinforcement first
- Was easier in another order
- Could not be completed as shown
- Was unclear

#### Printable Instructions

Generate a simple printable or downloadable guide from structured Instruction data.

The export should not become the primary source of truth.

### Acceptance Criteria

Milestone 9 is complete when:

1. A previously successful Build can be documented as steps
2. Another construction attempt can follow those steps
3. Problems with individual steps can be recorded
4. Instructions can be corrected without changing the Build itself
5. A basic printable version can be generated from the same structured data

## Milestone 10 — Digital Build Representation

### Goal

Represent magnetic tile Builds as structured geometry that the system can inspect, edit, and reason about.

### Scope

This milestone should begin only after enough real Builds exist to understand which modeling capabilities are actually necessary.

### Capabilities

A Digital Build Model may eventually support:

- Piece placement
- Position
- Rotation
- Orientation
- Connections
- Build sections
- Reinforcement
- Functional components

### Initial Editor

The first editor should be purpose-built for magnetic tiles rather than a general 3D modeling environment.

Potential actions:

- Add piece
- Remove piece
- Rotate piece
- Connect piece
- Duplicate section
- Replace piece
- Move section

### 3D Viewer

Allow users to:

- Rotate Build
- Zoom
- Inspect difficult areas
- Hide sections
- Highlight pieces
- View construction stages

Construction clarity should be more important than photorealism.

### Photo-to-Model

Where possible, use Build photos and known pieces to propose a Digital Build Model.

Generated geometry should preserve uncertainty.

The system may ask targeted questions when important structure is not visible.

### Acceptance Criteria

Milestone 10 is complete when:

1. A real Build can be represented using actual Piece Definitions
2. The structure can be viewed interactively
3. Pieces can be edited without general-purpose 3D expertise
4. Unknown/inferred geometry remains distinguishable from confirmed geometry
5. The model can eventually support downstream capabilities such as instruction generation

## Milestone 11 — Structural & Stability Intelligence

### Goal

Use build geometry, real-world Attempts, Piece characteristics, and accumulated evidence to provide useful stability guidance.

### Initial Intelligence

The system may consider:

- Base width
- Height
- Unsupported spans
- Connection patterns
- Reinforcement
- Structural Piece Definitions
- Moving components
- Brand-specific observations
- Similar successful Builds
- Similar failed Builds

### Guidance

The system should identify specific concerns rather than generic warnings.

Prefer:

> "The upper platform has a long unsupported span. Reinforcing the rear edge may improve stability."

over:

> "This Build might be unstable."

### Real-World Evidence

Physical Attempts should carry more weight than theoretical analysis.

The system should distinguish:

- Successfully Tested
- Successfully Tested With Modifications
- Partially Successful
- Unsuccessful Attempt
- Likely Buildable
- Experimental
- Insufficient Information

### Construction vs. Play

Where useful, separately evaluate:

- Construction Stability
- Play Stability
- Functional Success

### Acceptance Criteria

Milestone 11 is complete when stability guidance can:

1. Identify meaningful structural concerns
2. Explain why a concern exists
3. Incorporate real Attempt results
4. Preserve brand-specific differences
5. Avoid presenting theoretical analysis as physical verification

## Milestone 12 — AI Build Partner

### Goal

Allow users to describe what they want to create naturally and receive useful magnetic tile design assistance grounded in their actual collection.

### Example Requests

> "Build a parking garage that holds four cars."

> "Make something that drops pom-poms into the garbage truck."

> "Give me a castle using only pieces I own."

> "Can we make this tower shorter so it stops collapsing?"

### Inputs

The system may consider:

- User Collection
- Piece geometry
- Compatibility
- Known structural patterns
- Existing Builds
- Successful Attempts
- Failed Attempts
- Reinforcement observations
- Builder context
- Desired size
- Desired difficulty
- Intended play

### Outputs

The AI Build Partner may propose:

- Build concept
- Piece requirements
- Digital model
- Construction sequence
- Substitutions
- Reinforcement
- Alternative versions
- Known uncertainties

### Honesty About Theory

Generated designs should clearly distinguish:

- Based on physically successful patterns
- Structurally supported by known modeling
- Likely feasible
- Experimental
- Untested

A visually convincing render should never automatically imply a physically reliable Build.

### Iteration

Users should be able to respond naturally.

Examples:

> "I don't have that piece."

> "Make it shorter."

> "Use the car base instead."

> "We tried that and the back collapsed."

> "Can you reinforce it without using large squares?"

The system should modify the design rather than require restarting.

### Learning From Results

When the generated Build is attempted, the real-world Result should feed back into the Build record.

A failed AI-generated design should become evidence rather than disappear.

### Acceptance Criteria

Milestone 12 is complete when the system can:

1. Create useful build proposals from natural-language requests
2. Ground proposals in the user's collection
3. Modify proposals conversationally
4. Communicate uncertainty clearly
5. Preserve real-world feedback about generated designs

## Private Beta Transition

Once the Personal Alpha and the most valuable intelligence capabilities are reliable, Magnetic Builds may transition from a single-user product into a Private Beta.

The Private Beta should not begin simply because a predetermined feature list is complete.

It should begin when the product can reasonably support someone who did not help design it.

Before Private Beta, the product should have:

- Reliable user accounts
- Secure data isolation
- Stable photo storage
- Clear onboarding
- Collection setup
- Useful empty states
- Error handling
- Recovery from common mistakes
- Basic privacy controls
- Reliable database migrations
- Backup and recovery strategy
- Production monitoring
- Clear ownership of uploaded content
- Sufficient manufacturer/set data for useful testing

The Private Beta should initially emphasize private use.

Community publishing can remain disabled while the core product is tested with additional households.

## Roadmap Philosophy

This implementation plan should evolve with the product.

The milestone numbers describe dependencies and likely progression, not a promise that development will occur in exactly this order.

The team should periodically ask:

**What is the smallest thing we can build next that teaches us something important or makes Magnetic Builds meaningfully more useful?**

A later feature may move forward when it can be implemented cheaply and provides valuable learning.

An earlier feature may be simplified or removed when real use shows that it does not matter.

The product requirements define the destination.

The implementation plan defines the best route we currently know.

Real-world use is allowed to change the route.

