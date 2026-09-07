import { sql } from "drizzle-orm";
import { check, index, integer, real, sqliteTable, text, uniqueIndex, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";

const id = () => text("id").primaryKey();
const createdAt = () => integer("created_at", { mode: "timestamp_ms" }).notNull();
const updatedAt = () => integer("updated_at", { mode: "timestamp_ms" }).notNull();

export const brands = sqliteTable("brands", {
  id: id(), name: text("name").notNull(), manufacturer: text("manufacturer"), websiteUrl: text("website_url"),
  notes: text("notes"), metadataJson: text("metadata_json", { mode: "json" }), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("brands_name_idx").on(t.name)]);

export const pieceFamilies = sqliteTable("piece_families", {
  id: id(), name: text("name").notNull(), category: text("category"), shape: text("shape"), description: text("description"),
  metadataJson: text("metadata_json", { mode: "json" }), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [uniqueIndex("piece_families_name_uidx").on(t.name)]);

export const pieceDefinitions = sqliteTable("piece_definitions", {
  id: id(), pieceFamilyId: text("piece_family_id").notNull().references(() => pieceFamilies.id, { onDelete: "restrict" }),
  brandId: text("brand_id").references(() => brands.id, { onDelete: "restrict" }), name: text("name").notNull(),
  manufacturerIdentifier: text("manufacturer_identifier"), widthMm: real("width_mm"), heightMm: real("height_mm"), depthMm: real("depth_mm"),
  classificationJson: text("classification_json", { mode: "json" }), propertiesJson: text("properties_json", { mode: "json" }),
  notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("piece_definitions_family_idx").on(t.pieceFamilyId), index("piece_definitions_brand_idx").on(t.brandId)]);

export const pieceVariants = sqliteTable("piece_variants", {
  id: id(), pieceDefinitionId: text("piece_definition_id").notNull().references(() => pieceDefinitions.id, { onDelete: "restrict" }),
  name: text("name").notNull(), brandId: text("brand_id").references(() => brands.id, { onDelete: "restrict" }),
  manufacturerIdentifier: text("manufacturer_identifier"), propertiesJson: text("properties_json", { mode: "json" }),
  notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [
  index("piece_variants_piece_idx").on(t.pieceDefinitionId),
  index("piece_variants_brand_idx").on(t.brandId),
  uniqueIndex("piece_variants_identity_uidx").on(t.pieceDefinitionId, sql`coalesce(${t.brandId}, '')`, t.name),
]);

export const sets = sqliteTable("sets", {
  id: id(), brandId: text("brand_id").notNull().references(() => brands.id, { onDelete: "restrict" }), name: text("name").notNull(),
  setIdentifier: text("set_identifier"), advertisedPieceCount: integer("advertised_piece_count"), releaseYear: integer("release_year"),
  productUrl: text("product_url"), colorDescription: text("color_description"), notes: text("notes"),
  metadataJson: text("metadata_json", { mode: "json" }), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("sets_brand_idx").on(t.brandId), index("sets_name_idx").on(t.name), check("sets_piece_count_nonnegative", sql`${t.advertisedPieceCount} is null or ${t.advertisedPieceCount} >= 0`)]);

export const setContents = sqliteTable("set_contents", {
  id: id(), setId: text("set_id").notNull().references(() => sets.id, { onDelete: "restrict" }),
  pieceDefinitionId: text("piece_definition_id").notNull().references(() => pieceDefinitions.id, { onDelete: "restrict" }),
  quantity: integer("quantity"), color: text("color"), sourceType: text("source_type"), confidence: text("confidence"),
  sourceUrl: text("source_url"), notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("set_contents_set_idx").on(t.setId), index("set_contents_piece_idx").on(t.pieceDefinitionId),
  uniqueIndex("set_contents_identity_uidx").on(t.setId, t.pieceDefinitionId, sql`coalesce(${t.color}, '')`), check("set_contents_quantity_nonnegative", sql`${t.quantity} is null or ${t.quantity} >= 0`)]);

export const userCollections = sqliteTable("user_collections", {
  id: id(), userId: text("user_id"), name: text("name").notNull(), description: text("description"),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(true), createdAt: createdAt(), updatedAt: updatedAt(),
});

export const ownedSets = sqliteTable("owned_sets", {
  id: id(), userCollectionId: text("user_collection_id").notNull().references(() => userCollections.id, { onDelete: "restrict" }),
  setId: text("set_id").notNull().references(() => sets.id, { onDelete: "restrict" }), quantity: integer("quantity").notNull().default(1),
  notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [uniqueIndex("owned_sets_collection_set_uidx").on(t.userCollectionId, t.setId), index("owned_sets_collection_idx").on(t.userCollectionId),
  index("owned_sets_set_idx").on(t.setId), check("owned_sets_quantity_positive", sql`${t.quantity} > 0`)]);

export const inventoryAdjustments = sqliteTable("inventory_adjustments", {
  id: id(), userCollectionId: text("user_collection_id").notNull().references(() => userCollections.id, { onDelete: "restrict" }),
  pieceDefinitionId: text("piece_definition_id").notNull().references(() => pieceDefinitions.id, { onDelete: "restrict" }),
  quantityDelta: integer("quantity_delta").notNull(), reason: text("reason"), color: text("color"), sourceType: text("source_type"),
  confidence: text("confidence"), notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("inventory_adjustments_collection_idx").on(t.userCollectionId), index("inventory_adjustments_piece_idx").on(t.pieceDefinitionId)]);

export const inspirations = sqliteTable("inspirations", {
  id: id(), userId: text("user_id"), title: text("title"), description: text("description"), sourceUrl: text("source_url"),
  sourcePlatform: text("source_platform"), creatorName: text("creator_name"), originalTitle: text("original_title"), sourceType: text("source_type"),
  analysisStatus: text("analysis_status"), analysisJson: text("analysis_json", { mode: "json" }), notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("inspirations_created_idx").on(t.createdAt)]);

export const builds = sqliteTable("builds", {
  id: id(), ownerUserId: text("owner_user_id"), sourceInspirationId: text("source_inspiration_id").references(() => inspirations.id, { onDelete: "restrict" }),
  title: text("title"), description: text("description"), status: text("status").notNull(), category: text("category"), visibility: text("visibility").notNull().default("private"),
  preferredVersionId: text("preferred_version_id").references((): AnySQLiteColumn => buildVersions.id, { onDelete: "set null" }),
  metadataJson: text("metadata_json", { mode: "json" }), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("builds_owner_idx").on(t.ownerUserId), index("builds_status_idx").on(t.status), index("builds_created_idx").on(t.createdAt)]);

export const buildVersions = sqliteTable("build_versions", {
  id: id(), buildId: text("build_id").notNull().references(() => builds.id, { onDelete: "restrict" }),
  parentVersionId: text("parent_version_id").references((): AnySQLiteColumn => buildVersions.id, { onDelete: "restrict" }), label: text("label"),
  versionOrder: integer("version_order"), status: text("status"), summary: text("summary"), brandNotes: text("brand_notes"),
  knownLimitations: text("known_limitations"), geometryStatus: text("geometry_status"), metadataJson: text("metadata_json", { mode: "json" }),
  createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("build_versions_build_idx").on(t.buildId), check("build_versions_not_self_parent", sql`${t.parentVersionId} is null or ${t.parentVersionId} <> ${t.id}`)]);

export const buildPieceRequirements = sqliteTable("build_piece_requirements", {
  id: id(), buildVersionId: text("build_version_id").notNull().references(() => buildVersions.id, { onDelete: "restrict" }),
  pieceFamilyId: text("piece_family_id").references(() => pieceFamilies.id, { onDelete: "restrict" }), pieceDefinitionId: text("piece_definition_id").references(() => pieceDefinitions.id, { onDelete: "restrict" }),
  quantity: integer("quantity"), minimumQuantity: integer("minimum_quantity"), maximumQuantity: integer("maximum_quantity"), strictness: text("strictness"),
  role: text("role"), color: text("color"), sourceType: text("source_type"), confidence: text("confidence"), notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("requirements_version_idx").on(t.buildVersionId), index("requirements_family_idx").on(t.pieceFamilyId), index("requirements_piece_idx").on(t.pieceDefinitionId),
  check("requirements_piece_present", sql`${t.pieceFamilyId} is not null or ${t.pieceDefinitionId} is not null`),
  check("requirements_quantities_nonnegative", sql`(${t.quantity} is null or ${t.quantity} >= 0) and (${t.minimumQuantity} is null or ${t.minimumQuantity} >= 0) and (${t.maximumQuantity} is null or ${t.maximumQuantity} >= 0)`)]);

export const attempts = sqliteTable("attempts", {
  id: id(), buildId: text("build_id").notNull().references(() => builds.id, { onDelete: "restrict" }), buildVersionId: text("build_version_id").references(() => buildVersions.id, { onDelete: "restrict" }),
  userId: text("user_id"), attemptedAt: integer("attempted_at", { mode: "timestamp_ms" }), completedAt: integer("completed_at", { mode: "timestamp_ms" }),
  builderContext: text("builder_context"), brandContextJson: text("brand_context_json", { mode: "json" }), notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("attempts_build_idx").on(t.buildId), index("attempts_version_idx").on(t.buildVersionId), index("attempts_attempted_idx").on(t.attemptedAt)]);

export const results = sqliteTable("results", {
  id: id(), attemptId: text("attempt_id").notNull().references(() => attempts.id, { onDelete: "restrict" }), outcome: text("outcome").notNull(),
  actualBuildMinutes: integer("actual_build_minutes"), difficulty: text("difficulty"), constructionStability: text("construction_stability"), playStability: text("play_stability"),
  functionalSuccess: text("functional_success"), reinforcementRequired: integer("reinforcement_required", { mode: "boolean" }), substitutionsWorked: integer("substitutions_worked", { mode: "boolean" }),
  notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [uniqueIndex("results_attempt_uidx").on(t.attemptId), check("results_minutes_nonnegative", sql`${t.actualBuildMinutes} is null or ${t.actualBuildMinutes} >= 0`)]);

export const modifications = sqliteTable("modifications", {
  id: id(), attemptId: text("attempt_id").notNull().references(() => attempts.id, { onDelete: "restrict" }), buildVersionId: text("build_version_id").references(() => buildVersions.id, { onDelete: "restrict" }),
  description: text("description").notNull(), modificationType: text("modification_type"), worked: integer("worked", { mode: "boolean" }),
  detailsJson: text("details_json", { mode: "json" }), notes: text("notes"), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [index("modifications_attempt_idx").on(t.attemptId)]);

export const mediaAssets = sqliteTable("media_assets", {
  id: id(), assetType: text("asset_type").notNull(), storageKey: text("storage_key"), externalUrl: text("external_url"), sourceUrl: text("source_url"),
  mimeType: text("mime_type"), width: integer("width"), height: integer("height"), caption: text("caption"), altText: text("alt_text"), perspective: text("perspective"),
  sourceType: text("source_type"), confidence: text("confidence"), metadataJson: text("metadata_json", { mode: "json" }), createdAt: createdAt(), updatedAt: updatedAt(),
}, (t) => [check("media_assets_location_present", sql`${t.storageKey} is not null or ${t.externalUrl} is not null`)]);

export const mediaLinks = sqliteTable("media_links", {
  id: id(), mediaAssetId: text("media_asset_id").notNull().references(() => mediaAssets.id, { onDelete: "restrict" }), entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(), role: text("role"), sortOrder: integer("sort_order"), createdAt: createdAt(),
}, (t) => [index("media_links_asset_idx").on(t.mediaAssetId), index("media_links_entity_idx").on(t.entityType, t.entityId)]);
