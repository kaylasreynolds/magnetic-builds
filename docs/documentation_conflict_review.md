# Tileable — Documentation Conflict Review

## Purpose

This review records places where the newly approved Tileable legal/IP/privacy policy conflicts with or materially changes assumptions in the existing `/docs` files.

**No conflicting requirement listed below should be silently replaced.** Each proposed resolution should be approved before the affected legacy text is rewritten.

## Conflict 1 — Product name: Magnetic Builds → Tileable

### Decision

Approved.

### Resolution

Product-facing documentation has been renamed from **Magnetic Builds** to **Tileable** in:

- `prd.md`
- `data_model.md`
- `schema.md`
- `implementation_plan.md`

Repository, package, database, Cloudflare, environment, and other technical/internal identifiers remain unchanged (for example, `magnetic-builds`) until separately approved.

### Status

**Resolved and implemented on this branch.**

---

## Conflict 2 — External inspiration images and screenshots

### Current documentation

The current PRD explicitly allows users to capture inspiration from sources such as manufacturer guides, Pinterest, and other online sources and upload images/screenshots.

The current data model lists examples including:

- Pinterest image
- Manufacturer build guide
- Screenshot
- Photo of someone else's build
- Reference image

The current implementation plan for Milestone 5 includes saving an image from Pinterest or other inspiration and says an image or source should be enough for a quick save.

### Approved direction

Tileable must not assume that third-party images, manufacturer build guides, screenshots, retailer imagery, or another creator's photographs may be copied and rehosted merely because they are publicly visible online.

### Proposed resolution

Split inspiration capture into two paths:

1. **External reference** — save the source URL, source platform, creator/attribution when known, and optional user notes without copying/rehosting the protected media.
2. **Uploaded reference media** — allow upload only when the user owns the media or has the necessary rights/permission to upload it.

A future licensed integration, embed, API, or manufacturer-approved media source may provide an additional permitted path.

### Material product change

This changes the original “upload any inspiration screenshot/image” concept. It should be approved before rewriting `prd.md`, `data_model.md`, `schema.md`, or Milestone 5 in `implementation_plan.md`.

---

## Conflict 3 — Product images in the Set Library

### Current documentation

`prd.md` and `data_model.md` list **Product images** as possible Set data without defining usage-right requirements.

### Approved direction

Manufacturer/retailer product photography is restricted by default. Tileable should only host/use product imagery when there is a documented right to do so, such as:

- Tileable-owned photography
- Manufacturer permission/license
- Affiliate/API imagery whose terms authorize the use
- User-created imagery submitted with sufficient rights

### Proposed resolution

Retain product-image support, but change the requirement from generic “Product images” to **authorized product media with documented provenance/usage rights**.

---

## Conflict 4 — Media schema lacks rights/provenance fields

### Current documentation

`schema.md` currently defines `media_assets` with fields including:

- `storage_key`
- `external_url`
- `source_url`
- `source_type`
- media metadata

It does not explicitly record who owns the media or the basis on which Tileable may host/use it.

### Approved direction

Product and user media should have enough provenance information to distinguish Tileable-owned, user-owned, licensed, affiliate/API, manufacturer-approved, externally referenced, and other media-rights states.

### Proposed resolution

When media functionality is implemented, extend the media model with rights/provenance fields or equivalent structured metadata, for example:

- `rights_source` / `rights_basis`
- `rights_holder` when known
- `license_type` or permission status
- `permission_reference` / source record when applicable
- `is_hosting_permitted`
- `attribution_required`
- `attribution_text` when applicable

Exact schema fields should be chosen when the media feature is implemented; the data model should at minimum require rights provenance.

---

## Conflict 5 — Public UGC requirements are not yet represented in implementation milestones

### Current documentation

The existing docs intentionally defer public community publishing, creator profiles, moderation, and public contributions until later. This is consistent with the Personal Alpha strategy.

### Approved direction

Before public UGC launches, Tileable requires:

- DMCA designated agent registration
- Copyright/DMCA policy
- Takedown and counter-notice workflows
- Repeat-infringer policy
- Uploader rights certification
- Creator attribution

### Proposed resolution

No current Personal Alpha milestone needs to be blocked. Add a **Public UGC launch gate** to the post-Alpha/community roadmap so these requirements cannot be skipped when public uploads are eventually enabled.

### Conflict level

No immediate contradiction; this is a missing future prerequisite.

---

## Conflict 6 — Account/profile constraints are not yet encoded

### Current documentation

`schema.md` defers creator profiles and authentication. Existing docs do not yet define public display-name or avatar rules.

### Approved direction

For the MVP/public account system:

- Accounts are intended for users 13+.
- Do not ask for DOB, age, grade, school, child's name, or similar child-profile data unless separately reviewed.
- Public names are nickname-style only and filtered for prohibited/inappropriate terms.
- No user-uploaded profile photos.
- Users select from curated Tileable avatar options.
- Email is never public.
- No public age, birthday, school, location, or child-identifying information.

### Proposed resolution

Add these as explicit requirements when authentication/profile documentation is introduced. Do not add unnecessary profile fields to the current Personal Alpha schema.

### Conflict level

No immediate contradiction; this is a future implementation constraint.

---

## Conflict 7 — Monetization assumptions

### Current documentation

Current implementation prioritizes collection/build workflows and does not yet depend on monetization. Purchase recommendations are intentionally deferred in early buildability milestones.

### Approved direction

MVP monetization is:

- Free core platform
- Affiliate links with clear disclosure near relevant links
- Voluntary “Buy Me a Coffee”-style support
- No sponsored ranking bias or disguised paid placement

Additional revenue methods should be revisited only after Tileable has meaningful traffic/visibility.

### Proposed resolution

No existing milestone needs replacement. Add this policy to future monetization requirements and preserve the current rule that buildability should not default to “buy more tiles.”

---

## Recommended Update Order After Review

1. ✅ Documentation-only rename to Tileable — approved and implemented; technical/internal identifiers remain unchanged.
2. Review and approve the revised external-inspiration model.
3. Update `prd.md` to incorporate the approved legal/IP/privacy constraints.
4. Update `data_model.md` for media rights/provenance and inspiration-source distinctions.
5. Update `schema.md` only where current/future schema requirements materially change.
6. Update `implementation_plan.md` so Milestone 5 and future public/community/account milestones match the approved policy.
7. Preserve `milestone-1-status.md` and its locked Slice 2 reference unless a legal-policy change directly affects current Milestone 1 work.

## Current State

The approved policy is recorded in `docs/legal_ip_policy.md`.

Conflict 1 is resolved and implemented. Conflicts 2–7 remain pending explicit review/approval before any conflicting legacy requirement is replaced.
