PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Ensure production databases contain the canonical, brand-neutral piece catalog.
-- The build requirement selector reads directly from these rows.

INSERT OR IGNORE INTO piece_families (id, name, category, shape, description, metadata_json, created_at, updated_at) VALUES
  ('family_standard', 'Standard', 'tile', NULL, 'Base magnetic tile shapes.', '{"status":"active"}', 0, 0),
  ('family_accents', 'Accents', 'tile', NULL, 'Architectural and decorative magnetic pieces.', '{"status":"active"}', 0, 0),
  ('family_geometry', 'Geometry', 'tile', NULL, 'Additional geometric magnetic shapes.', '{"status":"active"}', 0, 0),
  ('family_transportation', 'Transportation', 'transportation', NULL, 'Vehicle, road, and racetrack pieces.', '{"status":"active"}', 0, 0),
  ('family_structural_xl', 'Structural XL', 'tile', NULL, 'Oversized foundation and structural strip pieces.', '{"status":"active"}', 0, 0);
--> statement-breakpoint

INSERT OR IGNORE INTO piece_definitions (
  id, piece_family_id, brand_id, name, width_mm, height_mm, classification_json, properties_json, notes, created_at, updated_at
) VALUES
  ('piece_square', 'family_standard', NULL, 'Square', 76.2, 76.2, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_large_square', 'family_standard', NULL, 'Large Square', 152.4, 152.4, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_equilateral_triangle', 'family_standard', NULL, 'Equilateral Triangle', 71.12, 60.96, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_right_triangle', 'family_standard', NULL, 'Right Triangle', 71.12, 71.12, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_isosceles_triangle', 'family_standard', NULL, 'Isosceles Triangle', 71.12, 142.24, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_half_square_rectangle', 'family_standard', NULL, 'Half-Square Rectangle', 76.2, 38.1, '{"status":"active"}', '{}', NULL, 0, 0),

  ('piece_square_frame', 'family_accents', NULL, 'Square Frame', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_arched_frame', 'family_accents', NULL, 'Arched Frame', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_window', 'family_accents', NULL, 'Window', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_double_door', 'family_accents', NULL, 'Double Door', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_n_panel', 'family_accents', NULL, 'N Panel', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_i_panel', 'family_accents', NULL, 'I Panel', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_h_panel', 'family_accents', NULL, 'H Panel', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_fence', 'family_accents', NULL, 'Fence', 76.2, 38.1, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_wedge', 'family_accents', NULL, 'Wedge', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_caution_half_square', 'family_accents', NULL, 'Caution Half-Square', 76.2, 38.1, '{"status":"active"}', '{}', NULL, 0, 0),

  ('piece_tall_right_triangle', 'family_geometry', NULL, 'Tall Right Triangle', 71.12, 139.7, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_trapezoid', 'family_geometry', NULL, 'Trapezoid', 142.24, 60.96, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_rhombus', 'family_geometry', NULL, 'Rhombus', 121.92, 71.12, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_pentagon', 'family_geometry', NULL, 'Pentagon', 114.3, 109.22, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_hexagon', 'family_geometry', NULL, 'Hexagon', 142.24, 121.92, '{"status":"active"}', '{}', NULL, 0, 0),

  ('piece_car_base', 'family_transportation', NULL, 'Car Base', NULL, NULL, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_road_square', 'family_transportation', NULL, 'Road Square', 76.2, 76.2, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_road_curve', 'family_transportation', NULL, 'Road Curve', 76.2, 76.2, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_finish_line', 'family_transportation', NULL, 'Finish Line', 76.2, 38.1, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_track_turn', 'family_transportation', NULL, 'Track Turn', 76.2, 114.3, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_speed_bump', 'family_transportation', NULL, 'Speed Bump', 76.2, 228.6, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_three_way_split', 'family_transportation', NULL, 'Three-Way Split', 152.4, 228.6, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_track_curve', 'family_transportation', NULL, 'Track Curve', 152.4, 152.4, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_two_way_split', 'family_transportation', NULL, 'Two-Way Split', 152.4, 228.6, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_track_slope_ramp', 'family_transportation', NULL, 'Track Slope Ramp', 76.2, 228.6, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_track_support', 'family_transportation', NULL, 'Track Support', 76.2, 114.3, '{"status":"active"}', '{}', NULL, 0, 0),

  ('piece_xl_foundation_4x3', 'family_structural_xl', NULL, 'XL Foundation 4x3', 304.8, 228.6, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_xl_strip_3x1', 'family_structural_xl', NULL, 'XL Strip 3x1', 228.6, 76.2, '{"status":"active"}', '{}', NULL, 0, 0),
  ('piece_xl_strip_4x1', 'family_structural_xl', NULL, 'Long XL Strip 4x1', 304.8, 76.2, '{"status":"active"}', '{}', NULL, 0, 0);
