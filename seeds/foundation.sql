-- Milestone 0 seed catalog
-- Source data is intentionally limited to manufacturer-confirmed information.
-- Re-running this file is safe because every row uses a stable ID and INSERT OR IGNORE.

INSERT OR IGNORE INTO brands (
  id, name, manufacturer, website_url, notes, created_at, updated_at
) VALUES (
  'brand_magna_tiles',
  'MAGNA-TILES',
  'Valtech, LLC',
  'https://magnatiles.com',
  'Initial Personal Alpha catalog brand.',
  0,
  0
);

INSERT OR IGNORE INTO piece_families (id, name, category, shape, created_at, updated_at) VALUES
  ('family_standard_square', 'Standard Square', 'tile', 'square', 0, 0),
  ('family_large_square', 'Large Square', 'tile', 'square', 0, 0),
  ('family_equilateral_triangle', 'Equilateral Triangle', 'tile', 'triangle', 0, 0),
  ('family_right_triangle', 'Right Triangle', 'tile', 'triangle', 0, 0),
  ('family_isosceles_triangle', 'Isosceles Triangle', 'tile', 'triangle', 0, 0),
  ('family_wheeled_chassis', 'Wheeled Chassis', 'vehicle', 'chassis', 0, 0);

INSERT OR IGNORE INTO piece_definitions (
  id, piece_family_id, brand_id, name, manufacturer_identifier, created_at, updated_at
) VALUES
  ('piece_magna_standard_square', 'family_standard_square', 'brand_magna_tiles', 'MAGNA-TILES Standard Square', NULL, 0, 0),
  ('piece_magna_large_square', 'family_large_square', 'brand_magna_tiles', 'MAGNA-TILES Large Square', NULL, 0, 0),
  ('piece_magna_equilateral_triangle', 'family_equilateral_triangle', 'brand_magna_tiles', 'MAGNA-TILES Equilateral Triangle', NULL, 0, 0),
  ('piece_magna_right_triangle', 'family_right_triangle', 'brand_magna_tiles', 'MAGNA-TILES Right Triangle', NULL, 0, 0),
  ('piece_magna_isosceles_triangle', 'family_isosceles_triangle', 'brand_magna_tiles', 'MAGNA-TILES Isosceles Triangle', NULL, 0, 0),
  ('piece_magna_green_wheeled_chassis', 'family_wheeled_chassis', 'brand_magna_tiles', 'Green Wheeled Chassis', NULL, 0, 0),
  ('piece_magna_yellow_wheeled_chassis', 'family_wheeled_chassis', 'brand_magna_tiles', 'Yellow Wheeled Chassis', NULL, 0, 0);

INSERT OR IGNORE INTO sets (
  id, brand_id, name, set_identifier, advertised_piece_count, product_url, notes, created_at, updated_at
) VALUES
  (
    'set_magna_classic_100',
    'brand_magna_tiles',
    'Classic 100 Piece Set',
    '4300',
    100,
    'https://magnatiles.com/products/magna-tiles-classic-100-piece-set',
    'Contents verified against the manufacturer product page.',
    0,
    0
  ),
  (
    'set_magna_cars_green_yellow_2',
    'brand_magna_tiles',
    'Cars 2 Piece Expansion Set: Green & Yellow',
    '16022',
    2,
    'https://magnatiles.com/products/cars-green-yellow-2-piece-set',
    'Contents verified against the manufacturer product page.',
    0,
    0
  );

INSERT OR IGNORE INTO set_contents (
  id, set_id, piece_definition_id, quantity, color, source_type, confidence, source_url, created_at, updated_at
) VALUES
  ('content_classic100_standard_square', 'set_magna_classic_100', 'piece_magna_standard_square', 50, NULL, 'manufacturer', 'confirmed', 'https://magnatiles.com/products/magna-tiles-classic-100-piece-set', 0, 0),
  ('content_classic100_large_square', 'set_magna_classic_100', 'piece_magna_large_square', 4, NULL, 'manufacturer', 'confirmed', 'https://magnatiles.com/products/magna-tiles-classic-100-piece-set', 0, 0),
  ('content_classic100_equilateral_triangle', 'set_magna_classic_100', 'piece_magna_equilateral_triangle', 20, NULL, 'manufacturer', 'confirmed', 'https://magnatiles.com/products/magna-tiles-classic-100-piece-set', 0, 0),
  ('content_classic100_right_triangle', 'set_magna_classic_100', 'piece_magna_right_triangle', 11, NULL, 'manufacturer', 'confirmed', 'https://magnatiles.com/products/magna-tiles-classic-100-piece-set', 0, 0),
  ('content_classic100_isosceles_triangle', 'set_magna_classic_100', 'piece_magna_isosceles_triangle', 15, NULL, 'manufacturer', 'confirmed', 'https://magnatiles.com/products/magna-tiles-classic-100-piece-set', 0, 0),
  ('content_cars2_green_chassis', 'set_magna_cars_green_yellow_2', 'piece_magna_green_wheeled_chassis', 1, 'green', 'manufacturer', 'confirmed', 'https://magnatiles.com/products/cars-green-yellow-2-piece-set', 0, 0),
  ('content_cars2_yellow_chassis', 'set_magna_cars_green_yellow_2', 'piece_magna_yellow_wheeled_chassis', 1, 'yellow', 'manufacturer', 'confirmed', 'https://magnatiles.com/products/cars-green-yellow-2-piece-set', 0, 0);

-- Personal Alpha starter collection. These are sets the owner confirmed they currently own.
INSERT OR IGNORE INTO user_collections (
  id, user_id, name, description, is_primary, created_at, updated_at
) VALUES (
  'collection_personal_alpha',
  NULL,
  'My Magnetic Tiles',
  'Primary Personal Alpha collection.',
  1,
  0,
  0
);

INSERT OR IGNORE INTO owned_sets (
  id, user_collection_id, set_id, quantity, notes, created_at, updated_at
) VALUES
  ('owned_personal_classic_100', 'collection_personal_alpha', 'set_magna_classic_100', 1, 'Confirmed owned set.', 0, 0),
  ('owned_personal_cars_green_yellow_2', 'collection_personal_alpha', 'set_magna_cars_green_yellow_2', 1, 'Confirmed owned set.', 0, 0);
