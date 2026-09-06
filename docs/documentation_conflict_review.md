# Tileable — Documentation Conflict Review

## Status

All previously identified documentation conflicts are now **approved and resolved at the policy level**.

The authoritative requirements are recorded in `legal_ip_policy.md`. Where an older passage in `prd.md`, `data_model.md`, `schema.md`, or `implementation_plan.md` still reflects a superseded assumption, the approved rule in `legal_ip_policy.md` controls until that legacy passage is next edited as part of normal feature work.

This approach avoids unnecessary large-file rewrites while preventing older wording from being treated as current product direction.

## Resolved Conflict 1 — Product name

**Decision:** Approved and implemented.

- Product-facing documentation uses **Tileable**.
- Technical/internal identifiers such as repository, package, database, Cloudflare resource, environment, and internal code names remain `magnetic-builds` unless separately changed later.

## Resolved Conflict 2 — External inspiration images and screenshots

**Decision:** Approved.

External inspiration should use a source-reference model by default:

- Save source URL, platform/site, creator attribution when known, title when known, and user notes.
- Do not copy/rehost third-party screenshots, manufacturer guide images, retailer imagery, or another creator's photographs merely because they are publicly accessible.
- Uploaded reference media is allowed only when the uploader owns the media or has the necessary rights/permission.
- Licensed embeds, APIs, affiliate feeds, manufacturer-approved assets, or other expressly authorized media paths may be used when their terms permit it.

This supersedes older examples that implied a user could freely upload Pinterest screenshots, manufacturer guides, or another creator's images as inspiration.

## Resolved Conflict 3 — Product images in the Set Library

**Decision:** Approved.

Set records may still support product imagery, but hosted/displayed product media must have documented permission, license, ownership, or another valid usage basis.

Approved examples include:

- Tileable-owned photography
- Manufacturer-approved or licensed imagery
- Affiliate/API imagery where the governing terms allow the use
- Other properly licensed media

Manufacturer or retailer product photography must not be copied and rehosted by default.

## Resolved Conflict 4 — Media rights and provenance

**Decision:** Approved.

The data model must preserve enough rights/provenance information to distinguish whether Tileable may host and display a media asset.

Potential metadata may include:

- rights basis/source
- rights holder when known
- permission/license reference
- whether hosting is permitted
- whether attribution is required
- required attribution text

**Implementation timing:** Do not add database fields solely for documentation completeness. Add the concrete fields when media functionality is implemented, using the simplest structure that satisfies the approved policy.

## Resolved Conflict 5 — Public UGC launch gate

**Decision:** Approved.

Before public user-generated-content uploads launch, Tileable must have:

- DMCA designated-agent registration
- Public DMCA contact information
- Copyright/DMCA policy
- Takedown workflow
- Counter-notice workflow
- Repeat-infringer policy
- Uploader rights certification
- Creator attribution support

This does not block the current private Personal Alpha.

## Resolved Conflict 6 — Accounts and profiles

**Decision:** Approved.

When public/user account functionality is implemented:

- Accounts are intended for users 13+ for MVP.
- Do not ask for DOB, age, grade, school, child's name, or similar child-profile data unless separately reviewed.
- Public display names are nickname-style and filtered for prohibited/inappropriate terms.
- No user-uploaded profile photos.
- Users choose from curated Tileable avatars.
- User email is never public.
- Do not publicly expose age, birthday, school, location, or child-identifying information.
- Privacy Policy is required before public account launch.
- Users should have account deletion.
- Tileable does not sell users' personal information.

Any older profile-model reference to a user-uploaded `profile image` is superseded by the curated-avatar requirement.

## Resolved Conflict 7 — Monetization

**Decision:** Approved.

MVP monetization is:

- Free core platform
- Affiliate links with clear disclosure near relevant links
- Voluntary support in a “Buy Me a Coffee”-style model
- No sponsored-ranking bias
- No paid placement presented as organic recommendation

Additional monetization options such as premium features, creator monetization, partnerships, or advertising remain possible future directions, but they are **not current MVP requirements** and must be separately reviewed once Tileable has meaningful traffic/visibility.

The existing principle remains unchanged: buildability and recommendations should not be manipulated to encourage unnecessary purchases.

## Implementation Rule Going Forward

For future documentation work:

1. `legal_ip_policy.md` is authoritative for legal/IP/privacy/monetization constraints.
2. New feature documentation must follow it.
3. When a legacy section is touched for feature work, update that section to remove superseded wording at the same time.
4. Do not create unnecessary migrations or infrastructure merely to mirror future policy requirements before the related feature exists.
5. `milestone-1-status.md` and its locked Slice 2 visual reference remain unchanged unless that milestone is explicitly reopened.
