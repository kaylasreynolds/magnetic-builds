SELECT 'brands' AS entity, COUNT(*) AS count FROM brands
UNION ALL
SELECT 'piece_families', COUNT(*) FROM piece_families
UNION ALL
SELECT 'piece_definitions', COUNT(*) FROM piece_definitions
UNION ALL
SELECT 'sets', COUNT(*) FROM sets
UNION ALL
SELECT 'set_contents', COUNT(*) FROM set_contents;

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
