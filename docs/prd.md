# Product Requirements Document

## Vision - 
    an intelligent workspace for discovering, building, documenting and improving magnetic tile creations. 

## Problem statement -
    Builders typically have scattered inspiration, missing part clarity, stability unknowns, and no single place to capture and iterate builds.

Builders often don't know:

- Which pieces a build requires
- Whether they own enough of those pieces
- Whether a pictured build is actually structurally possible
- Whether it will work with their specific magnetic tile brand
- Where reinforcement may be needed
- How a build was modified when the original design didn't work
- How to recreate a successful build later

There is also no simple way to document a real-world build, preserve how it was constructed, record what worked or didn't work, and continue improving it over time.

## Product Principles

### Helpful, Not Intimidating

Tileable should feel like building alongside a helpful friend. Users should never need to understand engineering, geometry, or magnetic construction terminology to use the platform.

The product should explain what it knows, what it thinks, and what it is unsure about in clear, approachable language.

### Real Builds Matter More Than Perfect Builds

The goal is not to create a gallery of impressive-looking structures. The goal is to help people build things that actually work.

A messy photo of a successful living-room-floor build can be more valuable than a beautiful rendered structure that cannot physically stand.

### Be Honest About Uncertainty

Images, AI analysis, and structural models will not always provide enough information to know whether a build will work.

The platform should distinguish between:

- Confirmed information
- AI-estimated information
- Theoretical construction
- Successfully tested builds
- Builds that were attempted but unsuccessful

When something is uncertain, Tileable should say so rather than presenting a theoretical result as fact.

### Failed Builds Are Useful

An unsuccessful build should not be treated as bad content.

Knowing that a structure collapsed, required additional reinforcement, or did not work with a particular brand can help improve the build.

Users should be able to record:

- What failed
- Where it failed
- What they changed
- What reinforcement helped
- What they would try next

Over time, this creates a history of how a build evolved.

### Your Collection Comes First

Recommendations should be based on the pieces a user actually owns whenever possible.

Instead of simply showing what could theoretically be built, Tileable should help answer:

**"What can I build with what I have?"**

When a user is missing pieces, the system should look for substitutions or modifications before assuming they need to purchase something else.

### Inspiration Should Become Actionable

Users should be able to capture inspiration from anywhere — including their own photos, manufacturer guides, Pinterest, or other online sources — and turn it into something useful.

An inspiration image should be able to evolve into:

**Inspiration → Estimated Pieces → Build Attempt → Modifications → Successful Build → Saved Instructions**

### Builds Should Be Able to Evolve

A build does not need to have one definitive version.

Users may improve, simplify, reinforce, resize, or creatively modify an existing build.

The system should preserve the relationship between builds without requiring every modification to replace the original.

A future public version could allow someone to create their own variation while still crediting and linking back to the build that inspired it.

### Private First, Community Ready

The initial product will be designed as a private workspace.

However, the underlying architecture should anticipate a future community library where users can:

- Publish builds
- Save other people's builds
- Share instructions
- Create variations
- Report their real-world results
- Contribute improvements and reinforcement suggestions

Community functionality does not need to be enabled in the initial product, but early technical decisions should avoid making it unnecessarily difficult to add later.

## Core User Experience

Tileable should support multiple ways of beginning a project because users will not always arrive with the same goal.

The experience should feel less like using a technical design program and more like telling a helpful building partner what you want to do.

### 1. I Made Something

For builds that already exist in the real world.

A user can:

- Upload one or more photos of the completed build
- Add a name and description
- Record which magnetic tile brand or brands were used
- Identify the sets or individual pieces used
- Allow the system to estimate pieces visible in the photos
- Correct the estimated piece inventory
- Add notes about construction, stability, reinforcement, or modifications
- Record approximate build time
- Record whether the build was successful
- Create or refine step-by-step instructions
- Save the finished build to their personal library

The system should preserve both user-entered information and AI-generated estimates so that estimated information is never mistaken for confirmed information.

---

### 2. I Found Something

For inspiration found elsewhere.

A user can:

- Upload an image
- Save a source link
- Add screenshots or additional reference images
- Record where the inspiration came from
- Allow the system to analyze the structure
- Generate an estimated piece list
- Compare the estimated requirements against the user's collection
- Identify potentially difficult or structurally questionable areas
- Suggest possible substitutions
- Save the inspiration without needing to build it immediately

The inspiration should remain separate from the user's eventual build attempt.

If the user later attempts it, Tileable should create a related build record where the user can document what actually happened.

This allows the platform to distinguish between:

**What the inspiration appeared to show**

and

**What worked in the real world.**

---

### 3. I Want to Build Something

For users who want ideas based on the pieces they already own.

A user can browse or request builds using filters such as:

- Pieces currently owned
- Magnetic tile brand
- Build category
- Difficulty
- Approximate build time
- Age or level of assistance
- Number of builders
- Size
- Specialty pieces
- Reinforcement requirements
- Tested vs. theoretical builds

The system should prioritize builds that can be completed with the user's existing collection.

Possible results could include:

- Ready to build
- Ready to build with substitutions
- Almost buildable
- Additional pieces required

The goal is to answer:

**"What can we make right now?"**

---

### 4. I Have an Idea

For users who know what they want to create but do not have an existing design.

A user can describe the idea naturally.

Examples:

> "Build a parking garage that fits four toy cars and has a ramp."

> "I want something that can drop pom-poms into the back of a toy garbage truck."

> "Make a castle using only the pieces I own."

Tileable can use the user's collection, available piece geometry, known magnetic connections, and existing build knowledge to propose a design.

Generated designs must clearly communicate uncertainty.

The system should distinguish between:

- Structurally validated designs
- Designs based on previously successful construction patterns
- AI-generated designs that appear feasible
- Experimental designs that have not been physically tested

The user can then attempt the design and record the real-world result.

That result can be used to improve the build rather than simply marking the generated design as right or wrong.

## The Build Record

### Model

INSPIRATION
    ↓
BUILD PROJECT
    ↓
ATTEMPT
    ↓
RESULT
    ↓
MODIFICATION
    ↓
SUCCESSFUL VERSION

### Build Record Philosophy

A build is more than a finished image or set of instructions. It is a record of an idea being attempted, tested, modified, and potentially improved over time.

Not every build will move through every stage of the model.

A user should be able to quickly save a completed build without documenting its entire history. The additional structure should exist when it is useful without making the experience feel complicated.

The system should preserve the distinction between inspiration, attempts, modifications, and successful real-world builds.

### Build Status

A build may have a status such as:

- Inspiration Only
- Planned
- In Progress
- Built Successfully
- Built With Modifications
- Partially Successful
- Unsuccessful
- Untested / Theoretical

An unsuccessful result should remain useful. Users should be able to document what went wrong and continue modifying the build rather than needing to delete or abandon it.

### Revisions, Variations, and Remixes

Tileable should support different ways that builds evolve.

**Revision**  
An improvement or correction to the same build.

Example: Reinforcing a wall that repeatedly collapsed.

**Variation**  
A deliberately different version of a build that preserves the original concept.

Example: Turning a two-level parking garage into a three-level parking garage.

**Remix**  
A new build created using another build as its starting point.

Example: Someone uses an existing pom-pom drop build as the basis for a ball-run sorting station.

These relationships should be stored by the system rather than requiring users to manually create version numbers.

### Build History

Where useful, a build should maintain a history showing how it developed.

This may include:

- Original inspiration
- Initial piece estimate
- Build attempts
- Photos from individual attempts
- Problems encountered
- Stability observations
- Reinforcement added
- Pieces substituted
- User notes
- Successful modifications
- Instruction updates
- Related revisions, variations, or remixes

The goal is not to require extensive documentation.

The goal is to make useful information easy to preserve when it exists.

## Collection & Piece Intelligence

Tileable should maintain an accurate inventory of the magnetic tile pieces a user owns.

Rather than requiring users to manually count every individual tile, the system should allow users to add known sets to their collection. Tileable can then translate those sets into an inventory of individual pieces.

Users should also be able to manually adjust their inventory when pieces are lost, replaced, purchased individually, mixed between sets, or otherwise differ from the original set contents.

### My Collection

Users should be able to add magnetic tiles to their collection in several ways:

- Add a known manufacturer set
- Add multiple copies of the same set
- Add individual pieces
- Add a custom or unknown set
- Manually adjust quantities
- Mark pieces as lost, damaged, or unavailable
- Add pieces from multiple magnetic tile brands

Example:

A user might record:

- 1 × MAGNA-TILES Classic 100-Piece Set
- 1 × MAGNA-TILES Cars Set
- 2 × additional large squares
- 1 × missing standard square

Tileable should calculate the user's actual usable inventory from this information.

### Set Library

The system should maintain a library of known magnetic tile sets.

Each set record may include:

- Manufacturer
- Brand
- Set name
- Set number or identifier, when available
- Release information, when known
- Total advertised piece count
- Individual piece quantities
- Colors
- Specialty pieces
- Vehicle components
- Reinforcement pieces
- Product images
- Source information
- Notes about compatibility

Adding a known set should automatically add its included pieces to the user's collection.

### Piece Library

Individual magnetic tile pieces should have their own standardized records.

A piece record may include:

- Piece type
- Shape
- Dimensions
- Magnet locations
- Magnet orientation or behavior, where relevant
- Connection edges
- Brand
- Color
- Structural characteristics
- Reinforcement characteristics
- Compatibility with equivalent pieces from other brands
- Whether the piece is decorative, structural, functional, or specialty

Examples might include:

- Standard square
- Large square
- Equilateral triangle
- Right triangle
- Isosceles triangle
- Rectangle
- Window
- Door
- Arch
- Wheel base
- Road piece
- Reinforced panel
- Multi-square structural piece

The library should be expandable as manufacturers introduce new pieces.

### Piece Families vs. Exact Pieces

Tileable should distinguish between a general piece family and a specific manufacturer's implementation of that piece.

For example:

**Standard Square**

may describe the general shape, while:

**MAGNA-TILES Standard Square**

and

**Connetix Standard Square**

represent specific implementations.

This allows builds to describe what geometry they require without incorrectly assuming that every manufacturer's version behaves identically.

### Brand Compatibility

Magnetic tile brands may use similar shapes while differing in:

- Dimensions
- Magnet strength
- Magnet placement
- Weight
- Plastic thickness
- Internal reinforcement
- Connection behavior
- Specialty piece design

The system should therefore avoid treating visually similar pieces as automatically interchangeable.

Compatibility may eventually be recorded at several levels:

- Directly compatible
- Generally compatible
- Compatible with limitations
- Not recommended
- Unknown / untested

Compatibility information may come from manufacturer specifications, system knowledge, and eventually real-world build results.

### Structural Characteristics

Some pieces provide significantly more structural support than visually similar arrangements of individual tiles.

Tileable should be capable of representing these differences.

For example, a reinforced multi-square panel should not automatically be treated as equivalent to several individual squares simply because they occupy approximately the same area.

Piece records should eventually support structural properties such as:

- Relative rigidity
- Connection strength
- Reinforcement
- Weight
- Supported span
- Known structural limitations

These properties can later contribute to buildability and stability analysis.

### Inventory Confidence

Not every user's collection will be perfectly documented.

The system should be able to distinguish between:

- Confirmed inventory
- Set-derived inventory
- Manually estimated inventory
- Unknown quantities

This prevents Tileable from presenting false precision when a user's collection is incomplete.

## Can I Build This?

One of the core functions of Tileable should be determining whether a user can recreate a build using their current collection.

For any build with a known or estimated piece list, the system should compare the build requirements against the user's available inventory.

### Buildability Results

Rather than returning only a yes or no answer, Tileable should provide useful context.

Possible results include:

**Ready to Build**  
The user's collection contains all known required pieces.

**Ready With Substitutions**  
The exact pieces are not available, but compatible substitutions are available.

**Almost Buildable**  
The user is missing a small number of required pieces.

**Modification Suggested**  
The original build cannot be recreated exactly, but the system can suggest a modified design using available pieces.

**Insufficient Pieces**  
The user's collection does not currently support the build.

**Unknown**  
There is not enough reliable information about the build, pieces, or compatibility to make a confident determination.

### Missing Pieces

When pieces are missing, the system should identify:

- Required quantity
- Quantity owned
- Quantity missing
- Possible substitutes
- Which sets in the user's collection contain relevant alternatives

The first response should not automatically be:

**Buy more tiles.**

Whenever practical, Tileable should first ask:

**"Can we make this work with what you already have?"**

### Build Match

Browse and search results may display a collection match indicator to help users quickly identify useful builds.

Examples:

- 100% — Ready to Build
- 96% — Missing 2 pieces
- Compatible with substitutions
- Modification available
- Unknown piece requirements

A numerical percentage should only be shown when the underlying data makes the number meaningful.

## Build Intelligence & Stability

Tileable should help users understand not only whether they own the required pieces, but whether a build is likely to work in the real world.

Magnetic tile structures are affected by more than piece count. Stability may vary based on geometry, weight distribution, reinforcement, magnet strength, connection patterns, specialty pieces, and differences between manufacturers.

The system should therefore treat structural analysis as guidance rather than guaranteed engineering validation unless a build has been successfully tested.

### Stability Status

Every build may eventually have a stability status.

Possible statuses include:

**Successfully Tested**  
The build has been physically completed and confirmed to work.

**Successfully Tested With Modifications**  
The original design required changes before it worked reliably.

**Partially Successful**  
The build was completed but had known stability or usability problems.

**Unsuccessful Attempt**  
A real-world attempt was made but the build did not work as intended.

**Likely Buildable**  
The structure appears feasible based on known construction patterns, but has not been physically verified.

**Experimental**  
The design is theoretical and contains areas where stability is uncertain.

**Insufficient Information**  
There is not enough information to meaningfully evaluate stability.

The interface should clearly distinguish real-world testing from theoretical analysis.

### Stability Analysis

Where sufficient information exists, Tileable may analyze factors such as:

- Base width
- Structure height
- Weight distribution
- Unsupported spans
- Connection points
- Panel orientation
- Magnet connections
- Reinforcement
- Specialty structural pieces
- Moving components
- Repeated weak points
- Brand-specific characteristics
- Similar previously tested structures

The goal is not to produce an engineering certification.

The goal is to identify areas where a builder may encounter problems before or during construction.

### Stability Warnings

The system may identify specific areas of concern.

Examples:

- Narrow base for the proposed height
- Long unsupported section
- Weak connection between major sections
- Likely need for reinforcement
- Specialty piece may be required
- Moving component may place additional stress on connection
- Build was successful with one brand but has not been tested with another
- Reference image does not show enough of the structure to determine how an area is supported

Warnings should be specific whenever possible.

Instead of:

> "This build may be unstable."

Prefer:

> "The upper section appears to be supported by two standard-square connections. Additional reinforcement along the rear wall may improve stability."

### Reinforcement

Reinforcement should be treated as part of the build knowledge rather than an afterthought.

A build may distinguish between:

**Required Reinforcement**  
Known to be necessary for the build to work.

**Recommended Reinforcement**  
Not strictly required, but improves reliability or durability.

**Optional Reinforcement**  
Useful for younger builders, active play, heavier accessories, or additional stability.

**Unknown**  
The build has not been tested enough to determine reinforcement needs.

Where possible, reinforcement should be associated with the specific area of the build where it is needed.

### Brand-Specific Stability

A build that works with one magnetic tile brand should not automatically be considered verified for every compatible brand.

Real-world results should record the brand or combination of brands used.

A build may therefore eventually display information such as:

- Successfully tested with MAGNA-TILES
- Successfully tested with Connetix
- Tested using mixed brands
- Compatible geometry, stability untested
- Additional reinforcement recommended for this brand
- No real-world results available for this brand

### Build Confidence

Tileable should communicate how much evidence supports its recommendations.

Confidence may consider:

- Whether the build has been physically tested
- Number of successful attempts
- Number of unsuccessful attempts
- Quality of available images or instructions
- Whether the piece list is confirmed or estimated
- Whether hidden structural components are known
- Whether the user's brand matches tested brands
- Consistency of reported real-world results

Confidence should not be presented as certainty.

The system should explain why confidence is high or low when that information would help the user.

## Build Results & Feedback

Tileable should allow users to record what actually happened when they attempted a build.

Feedback should focus on improving collective knowledge about the build rather than rating the person who created it.

### Build Result

After attempting a build, a user may record an outcome such as:

- Worked as shown
- Worked with minor modifications
- Worked with significant modifications
- Partially worked
- Did not work
- Did not finish
- Plan to try again

Providing feedback should always be optional.

A user should be able to save a build without completing a lengthy review.

### Build Experience

Users may optionally record:

- Actual build time
- Perceived difficulty
- Builder age or level of assistance
- Magnetic tile brand used
- Pieces substituted
- Reinforcement added
- Areas that were difficult
- Areas that repeatedly collapsed
- Missing or unclear instructions
- Changes that improved the build
- Whether the finished build survived normal play
- General notes

### Difficulty

Difficulty should describe the experience of constructing the build rather than simply the number of pieces used.

Possible factors may include:

- Number of pieces
- Number of construction stages
- Precision required
- Structural fragility during assembly
- Need for adult assistance
- Complex geometry
- Moving components
- Reinforcement requirements

Difficulty labels should remain approachable.

For example:

- Easy
- Moderate
- Tricky
- Challenging

The exact terminology can be refined during interface design.

### Build Time

Estimated build time may initially come from the build creator or system estimate.

As real-world attempts are recorded, Tileable may eventually show a more useful range.

For example:

**Typical Build Time: 20–30 minutes**

rather than implying that every user should complete the build in exactly 24 minutes.

### Real-World Learnings

Feedback from build attempts should be capable of improving the build record.

For example, if multiple attempts indicate that the same wall requires reinforcement, the build may eventually display:

> **Community Note:** Builders frequently recommend reinforcing the rear wall before adding the upper level.

In the initial private version, the same system can use the user's own previous attempts.

For example:

> **From Your Last Attempt:** The rear wall collapsed when the upper section was added. You reinforced it with two additional squares.

This allows Tileable to become more useful as it is used.

### Unsuccessful Builds

An unsuccessful result should never automatically remove or invalidate a build.

Instead, the build can remain available with an appropriate status and documented problems.

This creates an opportunity for future modification.

A user may be able to choose:

**Save Result**

**Try a Modification**

**Create a Variation**

**Revisit Later**

In a future community version, unsuccessful or experimental builds may invite other builders to propose solutions while preserving the original attempt and its history.

### Functional Builds

Some magnetic tile builds are intended to perform a function rather than simply remain standing.

Examples may include:

- Ball runs
- Marble runs
- Ramps
- Garages
- Bridges
- Tracks
- Vehicle loading stations
- Sorting systems
- Doors or gates
- Moving structures
- Cause-and-effect play

For functional builds, Tileable should distinguish between:

**Construction Stability**  
Can the structure be successfully assembled and remain standing?

**Play Stability**  
Can the finished structure tolerate the level of interaction expected during normal use?

**Functional Success**  
Does the build successfully perform the activity it was designed to perform?

A build may succeed in one area while having limitations in another.

For example, a pom-pom drop may stand successfully but require reinforcement to remain stable when a toy truck repeatedly backs into the loading area.

## Photo & Inspiration Intelligence

Tileable should help turn real-world photos and inspiration images into useful, structured build information.

Photo analysis should reduce the amount of manual documentation required without pretending that information can be determined from an image when it cannot.

The user should remain in control of correcting, confirming, or rejecting system estimates.

### Photo Sources

Users may provide images from several sources:

- Photos of their own completed builds
- Photos taken during construction
- Photos of failed attempts
- Screenshots of online inspiration
- Manufacturer build guides
- Multiple views of the same structure
- Images associated with an existing build record

Where appropriate, the system should ask whether an uploaded image represents:

- My Build
- An Attempt
- Inspiration
- Instructions / Reference
- Other

The system may suggest a category automatically, but the user should be able to change it.

### Source & Attribution

When inspiration comes from somewhere else, Tileable should preserve the original source whenever possible.

A saved inspiration record may include:

- Source URL
- Website or platform
- Creator name, when known
- Original build name, when known
- Date saved
- User notes

Saving inspiration should not imply ownership or authorship of the original design.

If an inspiration later becomes the basis for a user's build, the relationship between the inspiration and the new build should be preserved.

### Image Analysis

When an image is analyzed, Tileable may attempt to identify:

- Visible magnetic tile pieces
- Piece types
- Approximate piece quantities
- Colors
- Specialty pieces
- Vehicle components
- Reinforcement pieces
- Major structural sections
- Repeated patterns
- Possible connection points
- Functional components
- Potentially hidden pieces
- Areas that cannot be confidently interpreted

Analysis should produce estimates rather than silently converting uncertain observations into confirmed build data.

### Multiple-Photo Analysis

Multiple images of the same build should improve analysis.

For example, front, back, side, top, and detail photos may allow the system to identify pieces or connections that cannot be seen from a single image.

Tileable should be able to associate multiple images with one build and reason across them.

The system may eventually suggest useful additional views.

For example:

> "I can't see how the upper platform connects to the rear wall. A photo from the back would help."

The user should still be able to continue without providing another photo.

### Visible vs. Inferred Pieces

The system should distinguish between pieces directly visible in an image and pieces inferred to exist.

For example:

**Visible**
- 8 standard squares
- 4 triangles
- 1 large square

**Likely Hidden**
- 2–4 standard squares supporting the rear section

This distinction should remain available when determining piece requirements and build confidence.

### Confidence by Observation

Confidence should be associated with individual observations where practical rather than only assigning one confidence value to the entire build.

For example:

- Standard squares: High confidence
- Large square: High confidence
- Rear reinforcement: Low confidence
- Hidden floor pieces: Unknown

This allows the system to explain exactly where uncertainty exists.

### User Confirmation

After analysis, users should be able to quickly confirm or correct the result.

The interface should make corrections easy.

Possible actions include:

- Confirm piece
- Change piece type
- Change quantity
- Remove incorrect detection
- Add missing piece
- Mark piece as hidden but confirmed
- Mark piece as estimated
- Identify brand
- Identify reinforcement

Corrections made by the user should be treated as more authoritative than AI estimates.

### Compare With My Collection

Once an estimated piece list exists, Tileable should compare it with the user's collection.

The system may then report:

- Pieces definitely available
- Pieces probably available
- Missing pieces
- Compatible substitutes
- Unknown requirements
- Areas where hidden pieces may change the result

For example:

> **Probably Buildable**
>
> You have all 27 visible pieces.
>
> The image appears to contain an additional 2–4 hidden support pieces. I can't determine their exact shape from this photo.

This is preferable to falsely reporting that the build is definitely possible.

### Inspiration Analysis

When analyzing an inspiration image, Tileable should help answer four questions:

**1. What am I looking at?**  
Identify the general build type and important structural features.

**2. What does it probably use?**  
Estimate pieces and specialty components.

**3. Can I make it with what I own?**  
Compare estimated requirements against the user's collection.

**4. What might cause problems?**  
Identify uncertain, structurally questionable, or brand-dependent areas.

The result should help the user decide whether to save, attempt, modify, or skip the build.

### Document My Build

When users upload photos of something they built, Tileable should help create a build record with minimal effort.

The system may suggest:

- A build title
- Build category
- Short description
- Visible piece list
- Estimated total pieces
- Magnetic tile brand
- Functional components
- Possible reinforcement
- Difficulty estimate
- Questions needed to complete the record

The user can accept, edit, or ignore any suggestion.

The experience should prioritize getting the build saved quickly.

A user should not need to complete every field before saving.

### Quick Save

A build should be saveable with as little information as:

- One photo
- Optional title

Everything else can be added later.

This supports real-world situations where a user wants to preserve a build before it is dismantled, damaged, or forgotten.

### Guided Documentation

If the user wants a more complete record, Tileable can guide them through additional information conversationally.

Instead of presenting a large form, the system may ask useful questions based on what it cannot determine.

Examples:

> "Did you use any pieces behind this wall that aren't visible in the photos?"

> "Was the large panel necessary for stability, or could standard squares work here?"

> "Did this stand on its own, or did you need to reinforce it?"

> "What happened when the truck backed into the loading area?"

Questions should be selective and useful rather than exhaustive.

The goal is to learn what matters about the build without turning play into data entry.

## Build Discovery

Tileable should help users discover build ideas both from its own build library and, where appropriate, external inspiration sources.

Discovery should become more personalized as the system learns what pieces the user owns and what types of builds they enjoy.

### Search My Build Library

Users should be able to search saved builds and inspiration using natural language and structured filters.

Examples:

> "Show me the garbage truck thing we made."

> "What ball runs have I saved?"

> "Find builds that use the car pieces."

> "Show me things we successfully built."

> "What did we try that needed reinforcement?"

Search should work even when the user does not remember the exact build title.

### Browse by Collection

Users should be able to discover builds based on their current inventory.

Examples:

> "What can I build?"

> "Show me builds using my car set."

> "What can I make without using the large squares?"

> "Give me something that takes about 20 minutes."

> "What can we build with mostly triangles?"

### Personalized Discovery

Over time, Tileable may learn useful non-sensitive preferences from build activity.

Examples may include:

- Frequently built categories
- Preferred difficulty
- Typical build duration
- Functional vs. decorative builds
- Builds frequently saved but not attempted
- Types of builds that tend to be successful with the user's collection

Recommendations should remain understandable and controllable rather than creating an opaque feed.

### External Inspiration Discovery

A future version of Tileable may help locate build inspiration available elsewhere online.

External results should preserve their source and should not be presented as Tileable community content.

Where technically and legally appropriate, the system may analyze external inspiration and compare it against the user's collection.

For example:

> "Find magnetic tile parking garages I could probably build with my collection."

The system could return inspiration with indicators such as:

- Likely buildable
- May require substitutions
- Reinforcement may be needed
- Piece requirements uncertain
- Source available

External discovery should respect source ownership, access restrictions, and platform limitations.

## Build Instructions & 3D Representation

Tileable should help turn a completed or theoretical build into instructions that another person can understand and recreate.

Instructions should exist as structured build information inside the platform rather than primarily as a static document.

Printable or downloadable instructions should be generated from that underlying build information.

### Instruction Modes

A build may contain one or more forms of guidance:

- Step-by-step instructions
- Interactive visual instructions
- 3D model
- Reference photos
- Written notes
- Reinforcement notes
- Troubleshooting notes
- Piece list

Not every build needs every instruction type.

A simple build may only need a few photos and notes, while a complex build may benefit from a complete interactive guide.

### Step-by-Step Instructions

Instructions should divide construction into logical stages.

Each step may contain:

- Step number
- Pieces required for the step
- Pieces added during the step
- Visual representation
- Written guidance
- Orientation information
- Connection information
- Reinforcement guidance
- Stability warnings
- Functional testing
- Optional alternatives
- User tips

Instructions should emphasize difficult or fragile moments rather than treating every step as equally important.

### Build Mode

Users following instructions should have access to a focused Build Mode.

Build Mode may allow users to:

- Move forward or backward one step
- See which pieces are needed next
- Highlight newly added pieces
- Rotate or inspect the build
- Zoom into difficult areas
- View reference photos
- Read reinforcement notes
- Mark a step complete
- Report that a step did not work
- Record a modification
- Pause and resume later

The interface should be usable while someone is physically building on the floor or at a table.

### Piece Preparation

Before beginning, Tileable should be able to show the pieces required for the build.

The user may choose to:

- Gather all pieces first
- Gather pieces by construction stage
- Begin immediately

When connected to the user's collection, the system should identify substitutions or missing pieces before construction begins whenever possible.

### 3D Build Representation

Where sufficient build information exists, Tileable should create a simplified digital representation of the structure.

The representation should prioritize construction clarity over photorealism.

Users may eventually be able to:

- Rotate the structure
- Zoom in and out
- Hide sections
- View individual construction stages
- Highlight specific pieces
- Inspect connection points
- Compare variations
- View reinforcement
- Identify specialty pieces

The digital representation should not imply that a theoretical structure has been physically validated.

### Photo-to-Model

Tileable may assist in creating a digital build model from photographs.

The system may use multiple images, identified pieces, geometry, and user confirmation to reconstruct the likely structure.

Because photographs cannot always reveal hidden pieces or exact connections, generated models should preserve uncertainty.

The system may ask targeted questions such as:

> "Is there another square behind this panel?"

> "How is this upper section attached?"

> "Are these three individual squares or one reinforced piece?"

The user should be able to correct the model without needing professional 3D modeling knowledge.

### Manual Model Editing

Users should eventually be able to modify the digital representation directly.

The editor should be designed around magnetic tile construction rather than general-purpose 3D modeling.

Possible interactions include:

- Add a piece
- Remove a piece
- Replace a piece
- Rotate a piece
- Connect pieces
- Duplicate a section
- Move a section
- Add reinforcement
- Change piece brand
- Change piece color

The editor should understand valid magnetic tile connection behavior whenever possible.

### Automatic Instruction Generation

Once a sufficiently complete build model exists, Tileable may generate a proposed construction sequence.

The system should consider:

- Which sections need to be built first
- Whether later steps remain physically accessible
- Structural stability during construction
- Reinforcement timing
- Repeated construction patterns
- Functional components
- Difficult connection points

Generated instructions should be editable.

A theoretically valid final model does not guarantee that every proposed construction sequence will work in the real world.

### Instruction Validation

Users should be able to provide feedback about individual instruction steps.

Examples:

- Worked as shown
- Difficult but possible
- Needed reinforcement first
- Could not connect as shown
- Easier in a different order
- Missing piece
- Image unclear

This information can be used to improve the instructions without replacing the original build.

### Printable & Downloadable Instructions

Instructions may be exported into formats appropriate for offline use or sharing.

A printable guide may include:

- Build title
- Finished build image or rendering
- Required pieces
- Brand compatibility
- Difficulty
- Estimated build time
- Step-by-step visuals
- Written guidance
- Reinforcement notes
- Stability information
- Source or creator attribution
- QR code or link to the interactive build

PDF should be treated as an output format rather than the primary source of instruction data.

### Instructions From Real Builds

When instructions are created from a real-world build, Tileable should preserve the relationship between:

- Original photos
- Digital model
- Piece inventory
- Construction sequence
- User corrections
- Real-world result

This allows someone to return later and improve the instructions without losing the evidence from the original build.

## Builder Experience & Difficulty

Tileable should recognize that the person using the platform may not be the same person physically constructing or playing with the build.

A build may involve:

- Adult building independently
- Adult and child building together
- Child building with assistance
- Child building independently
- Multiple children building together
- Multiple adults or family members collaborating

### Builder Profile

When useful, build recommendations and instructions may consider:

- Builder experience
- Level of assistance available
- Approximate age range
- Fine motor complexity
- Construction patience
- Number of builders
- Desired build time

Age should not be treated as a precise predictor of ability.

### Difficulty Dimensions

A single difficulty label may not fully describe a build.

Difficulty may be influenced by:

- Planning complexity
- Construction complexity
- Structural fragility
- Precision required
- Number of pieces
- Number of steps
- Specialty pieces
- Functional components
- Need for reinforcement
- Need to hold multiple sections simultaneously
- Amount of adult assistance typically required

The interface may summarize these factors into an approachable overall difficulty while allowing additional detail when useful.

### Child-Friendly Instructions

Instructions intended for independent child use may require a different presentation from instructions intended for adults.

Child-friendly instruction mode may eventually include:

- Larger visuals
- Less text
- One clear action at a time
- Strong visual piece identification
- Progress indicators
- Simple orientation cues
- Optional audio guidance

The product should not assume every user wants or needs this mode.

### Play Context

Build recommendations may also consider what the user wants to do with the finished structure.

Examples:

- Build and display
- Imaginative play
- Vehicle play
- Ball or pom-pom play
- STEM exploration
- Challenge or puzzle
- Collaborative building
- Quick activity
- Long project

This context may affect recommendations for stability, size, complexity, and reinforcement.

## Navigation & Information Architecture

Tileable should organize a potentially complex system in a way that remains approachable for casual use.

The underlying product may contain detailed information about collections, pieces, builds, instructions, attempts, stability, and compatibility, but users should not need to understand that structure before they can begin using the platform.

The final navigation model should be determined during UX design rather than prescribed by the PRD.

### Core Product Areas

The product should provide access to the following functional areas, whether or not they ultimately appear as separate navigation destinations.

**Build Discovery**
- Browse build ideas
- Search builds
- Receive collection-aware recommendations
- Explore saved inspiration
- Find builds by activity, category, difficulty, time, or available pieces

**My Builds**
- View saved builds
- Create new builds
- Continue unfinished documentation
- View previous attempts
- Manage revisions and variations
- Revisit unsuccessful builds
- Access instructions

**Inspiration**
- Save images or links
- Analyze inspiration
- Compare inspiration against the user's collection
- Convert inspiration into a build attempt
- Preserve source information

**My Collection**
- Add sets
- Add individual pieces
- Adjust inventory
- View pieces by type
- Track specialty pieces
- Manage multiple brands
- Review collection accuracy

**Build Workspace**
- View build details
- Edit piece requirements
- Document attempts
- Add photos
- Record results
- Create modifications
- Manage instructions
- View or edit digital representations

**Build Intelligence**
- View collection compatibility
- Review missing pieces
- Explore substitutions
- Review stability information
- View reinforcement guidance
- Understand analysis confidence

**Account & Preferences**
- Manage profile
- Configure collection preferences
- Manage privacy and sharing
- Set preferred brands
- Configure builder preferences
- Manage saved content

### Progressive Complexity

Tileable should reveal complexity when it becomes useful.

A new user should be able to save a photo or add a set without first configuring every possible preference.

More advanced capabilities should become available naturally as users need them.

For example:

A casual user may only use:

**Find Build → Build It → Save**

while an advanced user may use:

**Analyze Inspiration → Correct Piece Model → Compare Brands → Modify Structure → Generate Instructions → Record Testing**

Both workflows should feel native to the same product.

### Cross-Linking

Information should be connected rather than isolated into separate databases.

For example:

- A set should link to its included pieces.
- A piece should show which owned sets contain it.
- A build should link to required pieces.
- A build should show collection compatibility.
- An inspiration record should link to resulting attempts.
- An attempt should link to the build it tested.
- A modification should preserve its relationship to the original build.
- A stability observation should link to the relevant build, version, brand, and area of the structure.

Users should be able to move naturally between related information without manually searching for it again.

### Search

Search should eventually work across the product rather than being limited to build titles.

Users may search using:

- Build names
- Natural language
- Categories
- Piece types
- Sets
- Brands
- Notes
- Saved inspiration
- Build results
- Functional characteristics

Examples:

> "garbage truck"

> "the pom-pom thing"

> "builds that use the car base"

> "things we tried that collapsed"

> "castles I can build without large squares"

The system should prioritize useful intent over exact keyword matching.

## Build Classification & Metadata

Builds should contain structured information that makes them easier to organize, discover, compare, and recommend.

Metadata should support useful discovery without requiring creators to manually complete an excessive number of fields.

Where appropriate, Tileable may suggest metadata automatically and allow the user to confirm or modify it.

### Build Categories

A build may belong to one or more categories.

Possible categories may include:

- Architecture
- Houses
- Castles
- Towers
- Vehicles
- Garages
- Roads
- Bridges
- Ball Runs
- Marble Runs
- Ramps
- Animals
- Characters
- Furniture
- Games
- STEM
- Cause & Effect
- Pretend Play
- Functional Builds
- Seasonal
- Challenges
- Abstract / Creative
- Other

The category system should remain expandable rather than relying on a permanently fixed list.

### Build Characteristics

Useful build characteristics may include:

- Approximate piece count
- Build time
- Difficulty
- Physical footprint
- Height
- Number of builders
- Assistance level
- Recommended play context
- Functional vs. decorative
- Moving components
- Specialty pieces
- Reinforcement requirements
- Brand compatibility
- Tested status
- Stability
- Play stability
- Instruction completeness

### Activity & Play Style

Builds may also be classified by what someone can do with them.

Examples:

- Vehicle play
- Ball or pom-pom play
- Imaginative play
- Building challenge
- Collaborative play
- STEM exploration
- Sorting
- Cause and effect
- Display
- Open-ended play

A single build may support multiple play styles.

### Flexible Tagging

Users should also be able to add flexible tags that do not require changes to the formal category system.

Examples:

- garbage-truck
- pom-poms
- rainy-day
- quick-build
- toddler-favorite
- reinforcement-needed
- uses-car-base

Tags may be private, public, system-generated, or creator-provided depending on context.

### Automatic Classification

When sufficient information exists, Tileable may suggest categories, characteristics, and tags based on:

- Photos
- Piece inventory
- Build description
- Instructions
- User notes
- Functional behavior
- Similar builds

Automatically generated classifications should remain editable.

## Saved Content & Personal Organization

Tileable should help users organize builds and inspiration without requiring a complicated filing system.

Saving something should be fast. Organization can happen immediately or later.

### Save States

The system should distinguish between different reasons a user may want to save something.

Examples include:

- Favorite
- Want to Build
- Currently Building
- Built
- Try Again
- Inspiration
- Archived

These states should not prevent users from organizing content in additional ways.

### Personal Collections

Users should be able to create custom collections.

Examples:

- Car Builds
- Ball Runs
- Quick Builds
- Weekend Ideas
- Toddler Favorites
- Big Projects
- Things to Try Again
- Holiday Builds

A build or inspiration item may belong to multiple collections.

### Smart Collections

Tileable may automatically create useful dynamic collections based on existing information.

Examples:

**Ready to Build**  
Saved builds that match the user's current collection.

**Almost Buildable**  
Saved builds missing only a small number of pieces.

**Newly Buildable**  
Previously saved builds that became possible after the user's collection changed.

**Continue Building**  
Builds with an unfinished attempt or documentation process.

**Needs Another Try**  
Builds with an unsuccessful or partially successful previous attempt.

**Recently Built**  
Recently completed builds.

Smart collections should update automatically as relevant information changes.

### Collection Changes

When a user adds a new magnetic tile set or additional pieces, Tileable should be able to reevaluate previously saved builds.

For example:

> "Your new set unlocked 7 saved builds."

The system may also identify builds that now have better substitution options or additional reinforcement possibilities.

### Personal Notes

Users should be able to attach private notes to saved content.

Examples:

> "Try this with the car base."

> "We need more reinforcement than the picture shows."

> "Great idea, but make it shorter next time."

> "The kids loved this one."

Personal notes should remain separate from formal build instructions or future public feedback unless the user intentionally chooses to share them.

### History

Users should be able to find things they previously viewed, saved, attempted, or built.

Useful history may include:

- Recently viewed
- Recently saved
- Recently built
- Previous attempts
- Recently analyzed inspiration

History should help users recover useful ideas without requiring them to remember exactly where they were stored.

## Sets & Collection Onboarding

Tileable should make creating an accurate collection as easy as reasonably possible.

Collection setup should support both users who know exactly which sets they own and users who have a mixed collection with incomplete information.

A perfectly documented collection should not be required before the product becomes useful.

### First-Time Collection Setup

New users may be offered several ways to begin:

**Add My Sets**  
Search or browse known manufacturer sets and add them to the collection.

**Scan a Set**  
Use packaging, a barcode, product information, or another supported identifier to locate a known set.

**Count My Pieces**  
Manually enter individual piece quantities.

**Help Me Identify My Collection**  
Provide photos of available pieces and allow Tileable to assist with identification.

**Skip for Now**  
Begin saving inspiration or builds without creating a collection.

Users should be able to combine these methods.

### Add a Known Set

When adding a known set, the user should be able to search by information such as:

- Manufacturer
- Set name
- Set number
- Piece count
- Product line
- Barcode, where available

After selecting a set, Tileable should display the expected contents before adding them to the collection.

The user may specify quantity when they own more than one copy.

### Collection From Photos

Users may optionally photograph their magnetic tile collection and allow Tileable to estimate its contents.

Photo-based inventory may attempt to identify:

- Piece types
- Quantities
- Brands
- Colors
- Specialty pieces

Because pieces may overlap or be hidden, photo-based inventory should clearly indicate uncertainty.

The user should be able to correct the resulting inventory.

### Mixed Collections

Tileable should support collections containing multiple brands.

Users should not be forced to maintain completely separate collections simply because pieces came from different manufacturers.

However, brand identity should remain attached to pieces when known because compatibility and structural behavior may differ.

### Unknown Pieces

Users may own pieces that cannot initially be identified.

The system should allow temporary records such as:

**Unknown Triangle**

or

**Large Reinforced Piece — Brand Unknown**

without preventing the rest of the collection from being used.

These records can be corrected later.

### Inventory Adjustments

The user's real collection may differ from the manufacturer's original set contents.

Users should be able to record:

- Missing pieces
- Lost pieces
- Damaged pieces
- Replacement pieces
- Extra pieces
- Individually purchased pieces
- Pieces given away
- Pieces temporarily unavailable

The calculated usable inventory should reflect these adjustments.

### Colors

Color should be treated as optional inventory information.

Many magnetic tile sets may not publish exact color quantities, and users should not be required to count colors manually unless they want that level of detail.

By default, Tileable should determine buildability based on piece type, quantity, compatibility, and structural requirements rather than color.

Color information may come from:

- Manufacturer-provided set contents
- User-entered inventory
- Photo analysis
- A specific build's confirmed piece list

When color data is incomplete or unknown, the system should not treat that as missing inventory.

A build may optionally distinguish between:

**Structural Match**  
The user owns the necessary piece types and quantities.

**Visual Match**  
The user also appears to have the colors or visual characteristics shown in the build.

Visual matching should only be shown when enough reliable color information exists to make the comparison meaningful.

Users who want detailed color tracking may choose to maintain exact color quantities, but this should never be required for normal collection management.

### Collection Accuracy

Users should be able to understand how reliable their inventory is.

Possible indicators may include:

- Fully Confirmed
- Mostly Confirmed
- Set-Based
- Partially Estimated
- Needs Review

The product should remain useful even when collection accuracy is incomplete.

## Community & Public Build Library

Tileable may eventually allow users to publish builds, instructions, variations, and real-world results to a shared build library.

The community should be designed around helping people discover, successfully recreate, and improve magnetic tile builds rather than creating a traditional social media experience.

Public participation should always be optional. Users should be able to use Tileable as a private workspace without publishing anything.

### Build Visibility

Builds and related content may have visibility settings such as:

- Private
- Unlisted
- Public

**Private**
Only the owner can access the content.

**Unlisted**
The content can be accessed through a direct link but does not normally appear in public discovery.

**Public**
The content may appear in search, discovery, recommendations, and the public build library.

Visibility should be controlled by the user.

### Publishing a Build

Users should be able to choose when a private build is ready to become public.

Publishing may include:

- Build title
- Description
- Finished images
- Digital representation
- Piece requirements
- Instructions
- Difficulty
- Build time
- Tested brands
- Stability information
- Reinforcement guidance
- Functional information
- Attribution
- Related inspiration
- Known limitations

A build should not need to be perfect before it can be shared.

Experimental, partially successful, and unsuccessful builds may also be valuable when clearly identified.

### Public Build Status

Public builds should clearly communicate what is known about them.

Examples:

- Successfully Tested
- Tested With Modifications
- Experimental
- Untested / Theoretical
- Partially Successful
- Known Issues
- Seeking Improvement

This allows users to decide whether they want a reliable project, an experiment, or a problem they might enjoy solving.

### Save a Build

Users should be able to save public builds to their personal library.

Saving a build should not create a duplicate independent copy unless the user intentionally creates a variation or remix.

Saved builds can then be compared against the user's collection.

For example:

> **Ready to Build**

> You own all confirmed required pieces.

or:

> **Almost Buildable**

> You're missing 2 standard squares. A substitution may be possible.

### Build Attempts

Users who attempt a public build may optionally record their real-world result.

An attempt may include:

- Outcome
- Magnetic tile brand
- Actual build time
- Difficulty
- Pieces substituted
- Reinforcement used
- Photos
- Functional result
- Stability observations
- Notes

Attempt information should improve understanding of the build rather than function primarily as a rating of its creator.

### Community Knowledge

When multiple users attempt the same build, Tileable may summarize useful patterns.

For example:

> **23 successful builds**

> **4 successful with modifications**

> **2 unsuccessful attempts**

> **Most common modification:** Reinforce the rear wall before adding the upper level.

> **Typical build time:** 25–35 minutes

> **Successfully tested with:** MAGNA-TILES, Connetix

The system should preserve individual reports while making repeated patterns easier to understand.

### Helpful Feedback

Users may provide constructive feedback about:

- Instructions
- Stability
- Piece requirements
- Reinforcement
- Substitutions
- Brand compatibility
- Functional performance
- Build sequence

The product should encourage specific observations rather than vague popularity ratings.

For example:

> "Step 7 was easier if we attached the roof before adding the side wall."

is more useful than:

> "3 stars."

### Variations & Remixes

Users should be able to create a new build based on an existing public build.

The new build should preserve its relationship to the source.

Possible relationships include:

- Revision
- Variation
- Remix
- Inspired By

A variation or remix should have its own:

- Photos
- Piece requirements
- Instructions
- Attempts
- Results
- Stability information

It should not overwrite the original build.

### Build Families

Related builds may eventually be displayed together as a build family.

For example:

Original Parking Garage
├── Reinforced Version
├── Compact Version
├── Three-Level Variation
│   └── Connetix Adaptation
└── Toddler-Friendly Remix

This allows users to explore how an idea has evolved while preserving attribution to earlier work.

### Community Without Social Pressure

Tileable does not need to become a traditional social network.

Community features should prioritize:

- Useful builds
- Successful recreation
- Problem solving
- Shared learning
- Constructive modification
- Credit for creators

Features such as follower counts, popularity competitions, public activity feeds, or engagement-driven ranking should not be assumed to be necessary.

The goal is to create a useful shared knowledge base around magnetic tile building.

### Open Build Problems

Users may optionally mark a build or specific problem as needing help.

Examples:

- Cannot stabilize upper level
- Instructions appear incomplete
- Missing connection is not visible
- Build works with one brand but not another
- Looking for a substitution
- Functional mechanism does not work reliably

Other users may propose:

- Reinforcement
- Piece substitutions
- Construction-order changes
- Structural modifications
- Alternate versions

A proposed solution should not automatically alter the original build.

The creator may test the suggestion and record the result.

Successful solutions may later become:

- A verified tip
- An instruction update
- A revision
- A variation
- A brand-specific recommendation

## Creator Attribution & Source Preservation

Tileable should preserve the origin of ideas whenever that origin is known.

Saving, analyzing, modifying, or recreating an external build should not imply authorship of the original design.

### Source Records

Inspiration may contain:

- Original URL
- Platform or website
- Creator name
- Original build title
- Date saved
- Reference images
- User notes

Source information should remain associated with builds derived from that inspiration.

### Derived Builds

When a user creates a build based substantially on another known build, Tileable should preserve that relationship.

Possible labels include:

- Inspired By
- Based On
- Variation Of
- Remix Of

The exact terminology can be refined during product design.

### Attribution Through Build Families

Attribution should persist through subsequent variations where appropriate.

If Build C is a variation of Build B, which was based on Build A, the system should retain enough lineage to understand that relationship.

The interface does not necessarily need to display the entire lineage everywhere.

### External Content

External images and instructions should not automatically become public Tileable content merely because a user saved them privately.

Public sharing, reproduction, and redistribution of third-party material should be handled separately from private inspiration storage.

Where possible, public records derived from external inspiration should link users back to the original source.

## Accounts, Privacy & Ownership

Tileable should support private personal use as a complete experience. Public participation should remain optional.

Users should maintain control over their builds, photos, notes, collections, attempts, and publishing choices.

### User Account

An account may contain:

- Profile information
- Magnetic tile collection
- Saved builds
- Original builds
- Inspiration
- Build attempts
- Personal collections
- Preferences
- Published content
- Draft content

Users should not need a public creator profile simply to use the product.

### Privacy by Default

Newly created personal content should default to private unless the user intentionally chooses otherwise.

This may include:

- Build photos
- Inspiration
- Build attempts
- Personal notes
- Collection information
- Draft instructions
- Builder preferences

Publishing should be a deliberate action.

### Photos & Personal Information

Magnetic tile photos may unintentionally contain people, children, homes, names, addresses, school information, or other personal details.

Before public publishing, Tileable may warn users when potentially personal information appears in uploaded media.

Where technically practical, the platform may offer tools such as:

- Crop photo
- Blur faces
- Remove location metadata
- Choose a different cover image

Private photo storage should remain distinct from public publishing.

### Child Privacy

Tileable may frequently be used by adults building with children.

The product should avoid requiring personally identifying information about children.

Builder information should generally be expressed in broad, optional terms such as:

- Adult-built
- Built together
- Child-built with help
- Child-built independently
- Approximate recommended age or ability range

The product should not require a child's name, photograph, birthday, or personal profile in order to provide useful recommendations.

### Ownership of User-Created Builds

Users should retain appropriate ownership of original content they create, subject to the platform's future terms of service.

Publishing a build should grant Tileable only the permissions necessary to display and operate the shared build library.

The exact legal terms should be established before public launch.

### Deleting & Unpublishing

Users should be able to:

- Delete private content
- Unpublish public content
- Change visibility
- Remove personal photos
- Archive content they no longer actively use

Where community variations or attempts depend on previously public content, the platform may need to preserve limited relationship or attribution information without continuing to display removed personal content.

The exact behavior should be established before public launch.

### Data Export

Users should eventually be able to export useful personal information rather than having their collection and build history permanently locked into the platform.

Possible exports may include:

- Collection inventory
- Build records
- Build photos
- Personal notes
- Instructions
- Build history

Export formats can be determined later.

## Safety & Moderation

Tileable should encourage creative experimentation while recognizing that physical builds, small components, moving pieces, elevated structures, and third-party accessories may introduce safety considerations.

The platform should provide useful context without presenting itself as a substitute for manufacturer safety guidance or adult judgment.

### Manufacturer Guidance

Where relevant, Tileable should preserve or reference known manufacturer guidance such as:

- Recommended ages
- Small-part warnings
- Product-specific restrictions
- Intended uses

Community builds should not imply manufacturer approval unless such approval actually exists.

### Build Safety

Certain builds may introduce additional considerations because they are:

- Very tall
- Very large
- Elevated above the floor
- Designed around stairs or furniture
- Used with small balls or other loose objects
- Combined with third-party toys
- Designed with moving components
- Intended for active play

Where appropriate, build records may contain safety notes.

### AI-Generated Builds

AI-generated or theoretical designs should not be presented as physically tested simply because they can be digitally modeled.

The system should clearly identify experimental designs and known uncertainties.

### Community Reporting

Future public content should be reportable for reasons such as:

- Unsafe content
- Misleading build information
- Stolen or improperly attributed content
- Inappropriate images
- Spam
- Harassment
- Other policy violations

Moderation tools and policies should be defined before community features are publicly enabled.

### Helpful Corrections

Not every incorrect build should be treated as a moderation violation.

If someone publishes a build that simply does not work as expected, the preferred response should usually be documentation, testing, correction, or modification.

The system should distinguish between:

**"This build didn't work."**

and

**"This content is unsafe, deceptive, or abusive."**

## Business & Monetization Possibilities

Tileable should initially prioritize creating a useful product and validating whether people genuinely want to use it.

The architecture should avoid unnecessarily preventing future monetization, but revenue generation should not compromise the usefulness of the core experience.

The following models are possibilities rather than committed product requirements.

### Free Core Product

A meaningful free experience could help build a useful ecosystem of:

- Collections
- Builds
- Attempts
- Compatibility knowledge
- Brand testing
- Instructions
- Community improvements

Core functionality should not be intentionally frustrating simply to force an upgrade.

### Optional Support

Users may eventually be able to financially support Tileable voluntarily.

Examples may include:

- One-time contributions
- "Buy us a coffee" style support
- Supporter memberships

Support should not create artificial social status within the build community.

### Premium Features

Some advanced functionality could potentially support an optional paid tier.

Examples might include:

- Advanced AI photo analysis
- Advanced 3D reconstruction
- Large or unlimited private build libraries
- Enhanced instruction generation
- Advanced collection analytics
- Additional export options
- Creator tools

Any premium model should be evaluated only after understanding which features are expensive to operate and which features users genuinely value.

### Creator Monetization

A future creator ecosystem may allow builders to earn money from high-quality original work.

Possibilities may include:

- Tips
- Paid instruction packs
- Premium builds
- Creator memberships

If implemented, Tileable should clearly distinguish original creator content from builds derived substantially from other sources.

Creator monetization would require appropriate payment, refund, ownership, licensing, and moderation policies.

### Brand Partnerships

Magnetic tile manufacturers may eventually have reasons to participate in the ecosystem.

Potential opportunities include:

- Verified set information
- Official piece specifications
- Official build guides
- Sponsored challenges
- Manufacturer-verified compatibility information
- New-set integrations

Commercial relationships should be clearly identified.

Brand partnerships should not allow manufacturers to manipulate independent buildability or compatibility information.

### Affiliate Commerce

When a user genuinely needs additional pieces or sets, Tileable could potentially provide purchase options.

However, purchase recommendations should come after useful alternatives such as:

- Use a compatible substitute
- Modify the build
- Use a different color
- Use pieces already owned

The product should not intentionally exaggerate missing-piece requirements to generate sales.

### Advertising

Traditional advertising is not assumed to be necessary.

If advertising is ever considered, it should not interfere with build instructions, misrepresent recommendations, or make collection analysis less trustworthy.

### Business Principle

Monetization should support the product rather than determine what the product recommends.

A useful recommendation may sometimes be:

**"You don't need to buy anything. You can build this with what you already have."**

## Product Scope & Development Horizons

Tileable describes a broad long-term product vision.

The complete vision should guide architectural decisions, but the product does not need to implement every capability at once.

Development horizons define which capabilities the product should be able to depend on as it grows.

They are not rigid release boundaries.

A feature associated with a later horizon may be implemented earlier when it is useful, technically straightforward, and does not create unnecessary architectural complexity.

### Horizon 1 — Personal Alpha

**Goal: Create a genuinely useful version of Tileable for one person using their own magnetic tile collection and real-world builds.**

This version should establish the core data relationships and allow the product to begin accumulating useful build knowledge.

Core capabilities may include:

- Local or private user experience
- Basic magnetic tile set library
- Piece library
- Personal collection inventory
- Add known sets to collection
- Manual inventory adjustments
- Save completed builds
- Upload build photos
- Save inspiration
- Record source information
- Create build records
- Record build attempts
- Record successful and unsuccessful results
- Record modifications
- Record reinforcement and stability notes
- Basic piece requirements
- Compare known build requirements with owned pieces
- Basic build search and organization
- Preserve relationships between inspiration, builds, attempts, and modifications

The Personal Alpha does not need sophisticated AI to be useful.

Manual information may be used where automation does not yet exist.

The primary question for this horizon is:

**"Can Tileable become useful enough that I actually want to use it while we're building?"**

### Horizon 2 — Intelligent Private Product

**Goal: Reduce manual work and make Tileable actively helpful during discovery, documentation, and construction.**

Capabilities may include:

- Photo-based piece identification
- Multi-photo build analysis
- Estimated piece lists
- Visible vs. inferred piece detection
- Confidence tracking
- Collection-aware build analysis
- Substitution suggestions
- Modification suggestions
- Natural-language build search
- Natural-language build requests
- AI-assisted build documentation
- Guided documentation questions
- Stability analysis
- Reinforcement suggestions
- Brand-aware compatibility
- Build recommendations based on owned pieces
- Automatic metadata suggestions
- 3D build representation
- Photo-to-model assistance
- Instruction generation
- Interactive Build Mode
- Printable instruction generation

This horizon should increasingly allow the user to interact with Tileable conversationally rather than manually maintaining every detail.

The primary question becomes:

**"Can Tileable understand enough about my tiles and my builds to meaningfully help me?"**

### Horizon 3 — Private Beta

**Goal: Allow other households to use Tileable successfully without requiring knowledge of how the product was created.**

This horizon may introduce:

- Production user accounts
- Secure private storage
- User onboarding
- Collection onboarding
- Multiple manufacturers and sets
- Improved set and piece data
- Collection photo assistance
- User preferences
- Personal saved collections
- Smart collections
- Cross-device use
- Data export
- Privacy controls
- More robust error handling
- User-friendly correction workflows
- Scalable image storage and processing

The product should no longer assume that the person using it understands the underlying data model or knows how to correct technical problems manually.

The primary question becomes:

**"Can someone who did not build Tileable understand it and get value from it?"**

### Horizon 4 — Community Knowledge

**Goal: Allow real-world build knowledge to improve through contributions from multiple builders.**

Capabilities may include:

- Public builds
- Unlisted builds
- Creator profiles
- Public build discovery
- Save public builds
- Community build attempts
- Real-world result reporting
- Build variations and remixes
- Build families
- Creator attribution
- Open build problems
- Proposed solutions
- Community reinforcement observations
- Brand-specific build results
- Aggregated build time
- Aggregated difficulty
- Instruction feedback
- Community-derived stability knowledge
- Reporting and moderation
- Public publishing controls

Community information should improve the usefulness and reliability of builds rather than primarily create social engagement.

The primary question becomes:

**"Can what one person learns while building make the next person's build easier?"**

### Horizon 5 — Platform

**Goal: Develop Tileable into a broader ecosystem for magnetic tile building, creation, and shared knowledge.**

Possible capabilities may include:

- Advanced creator tools
- Advanced 3D build editor
- Creator monetization
- Premium instructions
- Manufacturer participation
- Verified manufacturer data
- Official manufacturer builds
- Brand partnerships
- Affiliate purchasing
- Advanced compatibility intelligence
- Large-scale build pattern analysis
- Aggregated product insights
- Advanced recommendation systems
- Additional AI-assisted design capabilities
- External inspiration discovery
- APIs or integrations where useful

This horizon should only develop in directions supported by actual user behavior and product value.

The primary question becomes:

**"What should Tileable become now that we know how people actually use it?"**

### Horizon Principles

Development horizons should not become artificial restrictions.

A later-horizon capability may be implemented earlier when:

- It solves an immediate real-world problem
- The underlying data already supports it
- It is inexpensive or straightforward to implement
- It improves testing of the broader product concept
- Building it early prevents unnecessary rework

Likewise, an earlier-horizon feature may be delayed when it turns out not to be necessary for validating the product.

The roadmap should prioritize learning and usefulness over completing arbitrary feature checklists.

### Architectural Principle

Early implementation should be simple without unnecessarily assuming the product will always remain simple.

The architecture should preserve important distinctions established in this PRD, including:

- Sets vs. pieces
- Piece families vs. manufacturer-specific pieces
- Inspiration vs. builds
- Builds vs. attempts
- Attempts vs. results
- Revisions vs. variations vs. remixes
- Confirmed vs. estimated information
- Theoretical vs. physically tested builds
- Private vs. public content

These distinctions do not all require sophisticated interfaces in the first version.

They should, however, be considered before early technical shortcuts make them difficult to represent later.

