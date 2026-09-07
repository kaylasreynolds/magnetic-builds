PRAGMA foreign_keys=ON;

SELECT COUNT(*) AS brands_count FROM brands;
SELECT COUNT(*) AS piece_families_count FROM piece_families;
SELECT COUNT(*) AS piece_definitions_count FROM piece_definitions;
SELECT COUNT(*) AS sets_count FROM sets;
SELECT COUNT(*) AS set_contents_count FROM set_contents;
SELECT COUNT(*) AS user_collections_count FROM user_collections;
SELECT COUNT(*) AS owned_sets_count FROM owned_sets;

SELECT COUNT(*) AS canonical_family_count
FROM piece_families
WHERE id IN (
  'family_standard',
  'family_accents',
  'family_geometry',
  'family_transportation',
  'family_structural_xl',
  'family_micro'
);

SELECT COUNT(*) AS canonical_active_piece_count
FROM piece_definitions
WHERE json_extract(classification_json, '$.status') = 'active'
  AND piece_family_id IN (
    'family_standard',
    'family_accents',
    'family_geometry',
    'family_transportation',
    'family_structural_xl'
  );

SELECT COUNT(*) AS canonical_later_piece_count
FROM piece_definitions
WHERE json_extract(classification_json, '$.status') = 'later';

SELECT COUNT(*) AS piece_variants_count FROM piece_variants;

SELECT COUNT(*) AS legacy_family_count
FROM piece_families
WHERE id IN (
  'family_standard_square',
  'family_large_square',
  'family_equilateral_triangle',
  'family_right_triangle',
  'family_isosceles_triangle',
  'family_wheeled_chassis'
);

SELECT COUNT(*) AS legacy_piece_definition_count
FROM piece_definitions
WHERE id IN (
  'piece_magna_standard_square',
  'piece_magna_large_square',
  'piece_magna_equilateral_triangle',
  'piece_magna_right_triangle',
  'piece_magna_isosceles_triangle',
  'piece_magna_green_wheeled_chassis',
  'piece_magna_yellow_wheeled_chassis'
);

SELECT COUNT(*) AS legacy_set_content_count
FROM set_contents
WHERE id IN (
  'content_classic100_standard_square',
  'content_cars2_green_chassis',
  'content_cars2_yellow_chassis'
);

SELECT COUNT(*) AS noncanonical_set_content_reference_count
FROM set_contents sc
LEFT JOIN piece_definitions pd ON pd.id = sc.piece_definition_id
WHERE pd.piece_family_id NOT IN (
  'family_standard',
  'family_accents',
  'family_geometry',
  'family_transportation',
  'family_structural_xl',
  'family_micro'
);

SELECT name, category
FROM piece_families
ORDER BY name;

SELECT name, piece_family_id, json_extract(classification_json, '$.subgroup') AS subgroup,
       json_extract(classification_json, '$.referenceSize') AS reference_size,
       json_extract(classification_json, '$.status') AS status
FROM piece_definitions
ORDER BY piece_family_id, name;
