PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Align the stored piece taxonomy with the finalized visual reference library.
-- Specialty Vehicle and Track Base 2x1 are retained as deferred definitions so
-- existing provenance can remain intact. The duplicate Road Ramp definition is
-- merged into Track Slope Ramp, which is the current canonical piece.

UPDATE set_contents
SET piece_definition_id = 'piece_track_slope_ramp'
WHERE piece_definition_id = 'piece_ramp';
UPDATE inventory_adjustments
SET piece_definition_id = 'piece_track_slope_ramp'
WHERE piece_definition_id = 'piece_ramp';
UPDATE build_piece_requirements
SET piece_definition_id = 'piece_track_slope_ramp'
WHERE piece_definition_id = 'piece_ramp';
UPDATE piece_variants
SET piece_definition_id = 'piece_track_slope_ramp'
WHERE piece_definition_id = 'piece_ramp';
--> statement-breakpoint
DELETE FROM piece_definitions
WHERE id = 'piece_ramp';
--> statement-breakpoint
UPDATE piece_definitions
SET classification_json = json_set(classification_json, '$.status', 'later'),
    notes = 'Deferred from the active visual/reference library.'
WHERE id = 'piece_specialty_vehicle';

UPDATE piece_definitions
SET classification_json = json_set(classification_json, '$.status', 'later'),
    notes = 'Not part of the active visual/reference taxonomy.'
WHERE id = 'piece_track_base_2x1';
--> statement-breakpoint
UPDATE piece_definitions
SET width_mm = 76.2,
    height_mm = 114.3,
    classification_json = json_set(
      classification_json,
      '$.referenceSize', '1x1.5',
      '$.status', 'active'
    ),
    properties_json = json_set(properties_json, '$.measurementStatus', 'user_reference')
WHERE id = 'piece_track_support';

UPDATE piece_definitions
SET properties_json = json_set(
      properties_json,
      '$.aliases', json('["Ramp"]')
    )
WHERE id = 'piece_track_slope_ramp';
