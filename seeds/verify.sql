SELECT COUNT(*) AS brands_count FROM brands;
SELECT COUNT(*) AS piece_families_count FROM piece_families;
SELECT COUNT(*) AS piece_definitions_count FROM piece_definitions;
SELECT COUNT(*) AS sets_count FROM sets;
SELECT COUNT(*) AS set_contents_count FROM set_contents;
SELECT COUNT(*) AS user_collections_count FROM user_collections;
SELECT COUNT(*) AS owned_sets_count FROM owned_sets;

SELECT
  s.name AS set_name,
  sc.quantity,
  pd.name AS piece_name,
  sc.color,
  sc.confidence
FROM set_contents sc
JOIN sets s ON s.id = sc.set_id
JOIN piece_definitions pd ON pd.id = sc.piece_definition_id
ORDER BY s.name, pd.name;

SELECT
  uc.name AS collection_name,
  b.name AS brand_name,
  s.name AS set_name,
  os.quantity AS quantity_owned,
  SUM(os.quantity * sc.quantity) AS calculated_piece_count
FROM owned_sets os
JOIN user_collections uc ON uc.id = os.user_collection_id
JOIN sets s ON s.id = os.set_id
JOIN brands b ON b.id = s.brand_id
JOIN set_contents sc ON sc.set_id = s.id
WHERE uc.is_primary = 1
GROUP BY uc.name, b.name, s.name, os.quantity
ORDER BY b.name, s.name;

SELECT
  pd.name AS piece_name,
  sc.color,
  SUM(os.quantity * sc.quantity) AS from_owned_sets
FROM owned_sets os
JOIN user_collections uc ON uc.id = os.user_collection_id
JOIN set_contents sc ON sc.set_id = os.set_id
JOIN piece_definitions pd ON pd.id = sc.piece_definition_id
WHERE uc.is_primary = 1
GROUP BY pd.name, sc.color
ORDER BY pd.name, sc.color;
