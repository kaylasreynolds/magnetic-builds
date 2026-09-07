PRAGMA foreign_keys=ON;

SELECT COUNT(*) AS brands_count FROM brands;
SELECT COUNT(*) AS piece_families_count FROM piece_families;
SELECT COUNT(*) AS piece_definitions_count FROM piece_definitions;
SELECT COUNT(*) AS sets_count FROM sets;
SELECT COUNT(*) AS set_contents_count FROM set_contents;
SELECT COUNT(*) AS user_collections_count FROM user_collections;
SELECT COUNT(*) AS owned_sets_count FROM owned_sets;

-- Canonical taxonomy checks. These are additive during migration, so legacy
-- Milestone 0 family/definition rows may coexist until references are repointed.
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

SELECT name, category
FROM piece_families
WHERE id IN (
  'family_standard',
  'family_accents',
  'family_geometry',
  'family_transportation',
  'family_structural_xl',
  'family_micro'
)
ORDER BY name;

SELECT name, piece_family_id, json_extract(classification_json, '$.subgroup') AS subgroup,
       json_extract(classification_json, '$.referenceSize') AS reference_size,
       json_extract(classification_json, '$.status') AS status
FROM piece_definitions
WHERE piece_family_id IN (
  'family_standard',
  'family_accents',
  'family_geometry',
  'family_transportation',
  'family_structural_xl',
  'family_micro'
)
ORDER BY piece_family_id, name;
