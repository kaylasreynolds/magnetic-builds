PRAGMA foreign_keys=ON;
--> statement-breakpoint
CREATE TABLE piece_variants (
  id TEXT PRIMARY KEY,
  piece_definition_id TEXT NOT NULL REFERENCES piece_definitions(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  brand_id TEXT REFERENCES brands(id) ON DELETE RESTRICT,
  manufacturer_identifier TEXT,
  properties_json TEXT,
  notes TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX piece_variants_piece_idx ON piece_variants(piece_definition_id);
--> statement-breakpoint
CREATE INDEX piece_variants_brand_idx ON piece_variants(brand_id);
--> statement-breakpoint
CREATE UNIQUE INDEX piece_variants_identity_uidx ON piece_variants(piece_definition_id,coalesce(brand_id,''),name);
