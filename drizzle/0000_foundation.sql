PRAGMA foreign_keys=ON;
--> statement-breakpoint
CREATE TABLE brands (id TEXT PRIMARY KEY,name TEXT NOT NULL,manufacturer TEXT,website_url TEXT,notes TEXT,metadata_json TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE piece_families (id TEXT PRIMARY KEY,name TEXT NOT NULL,category TEXT,shape TEXT,description TEXT,metadata_json TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE piece_definitions (id TEXT PRIMARY KEY,piece_family_id TEXT NOT NULL REFERENCES piece_families(id) ON DELETE RESTRICT,brand_id TEXT REFERENCES brands(id) ON DELETE RESTRICT,name TEXT NOT NULL,manufacturer_identifier TEXT,width_mm REAL,height_mm REAL,depth_mm REAL,classification_json TEXT,properties_json TEXT,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE sets (id TEXT PRIMARY KEY,brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,name TEXT NOT NULL,set_identifier TEXT,advertised_piece_count INTEGER,release_year INTEGER,product_url TEXT,color_description TEXT,notes TEXT,metadata_json TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,CHECK(advertised_piece_count IS NULL OR advertised_piece_count >= 0));
--> statement-breakpoint
CREATE TABLE set_contents (id TEXT PRIMARY KEY,set_id TEXT NOT NULL REFERENCES sets(id) ON DELETE RESTRICT,piece_definition_id TEXT NOT NULL REFERENCES piece_definitions(id) ON DELETE RESTRICT,quantity INTEGER,color TEXT,source_type TEXT,confidence TEXT,source_url TEXT,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,CHECK(quantity IS NULL OR quantity >= 0));
--> statement-breakpoint
CREATE TABLE user_collections (id TEXT PRIMARY KEY,user_id TEXT,name TEXT NOT NULL,description TEXT,is_primary INTEGER NOT NULL DEFAULT 1,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE owned_sets (id TEXT PRIMARY KEY,user_collection_id TEXT NOT NULL REFERENCES user_collections(id) ON DELETE RESTRICT,set_id TEXT NOT NULL REFERENCES sets(id) ON DELETE RESTRICT,quantity INTEGER NOT NULL DEFAULT 1,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,CHECK(quantity > 0));
--> statement-breakpoint
CREATE TABLE inventory_adjustments (id TEXT PRIMARY KEY,user_collection_id TEXT NOT NULL REFERENCES user_collections(id) ON DELETE RESTRICT,piece_definition_id TEXT NOT NULL REFERENCES piece_definitions(id) ON DELETE RESTRICT,quantity_delta INTEGER NOT NULL,reason TEXT,color TEXT,source_type TEXT,confidence TEXT,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE inspirations (id TEXT PRIMARY KEY,user_id TEXT,title TEXT,description TEXT,source_url TEXT,source_platform TEXT,creator_name TEXT,original_title TEXT,source_type TEXT,analysis_status TEXT,analysis_json TEXT,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE builds (id TEXT PRIMARY KEY,owner_user_id TEXT,source_inspiration_id TEXT REFERENCES inspirations(id) ON DELETE RESTRICT,title TEXT,description TEXT,status TEXT NOT NULL,category TEXT,visibility TEXT NOT NULL DEFAULT 'private',preferred_version_id TEXT REFERENCES build_versions(id) ON DELETE SET NULL,metadata_json TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE build_versions (id TEXT PRIMARY KEY,build_id TEXT NOT NULL REFERENCES builds(id) ON DELETE RESTRICT,parent_version_id TEXT REFERENCES build_versions(id) ON DELETE RESTRICT,label TEXT,version_order INTEGER,status TEXT,summary TEXT,brand_notes TEXT,known_limitations TEXT,geometry_status TEXT,metadata_json TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,CHECK(parent_version_id IS NULL OR parent_version_id <> id));
--> statement-breakpoint
CREATE TABLE build_piece_requirements (id TEXT PRIMARY KEY,build_version_id TEXT NOT NULL REFERENCES build_versions(id) ON DELETE RESTRICT,piece_family_id TEXT REFERENCES piece_families(id) ON DELETE RESTRICT,piece_definition_id TEXT REFERENCES piece_definitions(id) ON DELETE RESTRICT,quantity INTEGER,minimum_quantity INTEGER,maximum_quantity INTEGER,strictness TEXT,role TEXT,color TEXT,source_type TEXT,confidence TEXT,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,CHECK(piece_family_id IS NOT NULL OR piece_definition_id IS NOT NULL),CHECK((quantity IS NULL OR quantity >= 0) AND (minimum_quantity IS NULL OR minimum_quantity >= 0) AND (maximum_quantity IS NULL OR maximum_quantity >= 0)));
--> statement-breakpoint
CREATE TABLE attempts (id TEXT PRIMARY KEY,build_id TEXT NOT NULL REFERENCES builds(id) ON DELETE RESTRICT,build_version_id TEXT REFERENCES build_versions(id) ON DELETE RESTRICT,user_id TEXT,attempted_at INTEGER,completed_at INTEGER,builder_context TEXT,brand_context_json TEXT,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE results (id TEXT PRIMARY KEY,attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE RESTRICT,outcome TEXT NOT NULL,actual_build_minutes INTEGER,difficulty TEXT,construction_stability TEXT,play_stability TEXT,functional_success TEXT,reinforcement_required INTEGER,substitutions_worked INTEGER,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,CHECK(actual_build_minutes IS NULL OR actual_build_minutes >= 0));
--> statement-breakpoint
CREATE TABLE modifications (id TEXT PRIMARY KEY,attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE RESTRICT,build_version_id TEXT REFERENCES build_versions(id) ON DELETE RESTRICT,description TEXT NOT NULL,modification_type TEXT,worked INTEGER,details_json TEXT,notes TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE media_assets (id TEXT PRIMARY KEY,asset_type TEXT NOT NULL,storage_key TEXT,external_url TEXT,source_url TEXT,mime_type TEXT,width INTEGER,height INTEGER,caption TEXT,alt_text TEXT,perspective TEXT,source_type TEXT,confidence TEXT,metadata_json TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,CHECK(storage_key IS NOT NULL OR external_url IS NOT NULL));
--> statement-breakpoint
CREATE TABLE media_links (id TEXT PRIMARY KEY,media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,entity_type TEXT NOT NULL,entity_id TEXT NOT NULL,role TEXT,sort_order INTEGER,created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX brands_name_idx ON brands(name);
--> statement-breakpoint
CREATE UNIQUE INDEX piece_families_name_uidx ON piece_families(name);
--> statement-breakpoint
CREATE INDEX piece_definitions_family_idx ON piece_definitions(piece_family_id);
--> statement-breakpoint
CREATE INDEX piece_definitions_brand_idx ON piece_definitions(brand_id);
--> statement-breakpoint
CREATE INDEX sets_brand_idx ON sets(brand_id);
--> statement-breakpoint
CREATE INDEX sets_name_idx ON sets(name);
--> statement-breakpoint
CREATE INDEX set_contents_set_idx ON set_contents(set_id);
--> statement-breakpoint
CREATE INDEX set_contents_piece_idx ON set_contents(piece_definition_id);
--> statement-breakpoint
CREATE UNIQUE INDEX set_contents_identity_uidx ON set_contents(set_id,piece_definition_id,coalesce(color,''));
--> statement-breakpoint
CREATE UNIQUE INDEX owned_sets_collection_set_uidx ON owned_sets(user_collection_id,set_id);
--> statement-breakpoint
CREATE INDEX owned_sets_collection_idx ON owned_sets(user_collection_id);
--> statement-breakpoint
CREATE INDEX owned_sets_set_idx ON owned_sets(set_id);
--> statement-breakpoint
CREATE INDEX inventory_adjustments_collection_idx ON inventory_adjustments(user_collection_id);
--> statement-breakpoint
CREATE INDEX inventory_adjustments_piece_idx ON inventory_adjustments(piece_definition_id);
--> statement-breakpoint
CREATE INDEX inspirations_created_idx ON inspirations(created_at);
--> statement-breakpoint
CREATE INDEX builds_owner_idx ON builds(owner_user_id);
--> statement-breakpoint
CREATE INDEX builds_status_idx ON builds(status);
--> statement-breakpoint
CREATE INDEX builds_created_idx ON builds(created_at);
--> statement-breakpoint
CREATE INDEX build_versions_build_idx ON build_versions(build_id);
--> statement-breakpoint
CREATE INDEX requirements_version_idx ON build_piece_requirements(build_version_id);
--> statement-breakpoint
CREATE INDEX requirements_family_idx ON build_piece_requirements(piece_family_id);
--> statement-breakpoint
CREATE INDEX requirements_piece_idx ON build_piece_requirements(piece_definition_id);
--> statement-breakpoint
CREATE INDEX attempts_build_idx ON attempts(build_id);
--> statement-breakpoint
CREATE INDEX attempts_version_idx ON attempts(build_version_id);
--> statement-breakpoint
CREATE INDEX attempts_attempted_idx ON attempts(attempted_at);
--> statement-breakpoint
CREATE UNIQUE INDEX results_attempt_uidx ON results(attempt_id);
--> statement-breakpoint
CREATE INDEX modifications_attempt_idx ON modifications(attempt_id);
--> statement-breakpoint
CREATE INDEX media_links_asset_idx ON media_links(media_asset_id);
--> statement-breakpoint
CREATE INDEX media_links_entity_idx ON media_links(entity_type,entity_id);
