-- Canonical Tileable piece taxonomy.
-- Broad families are brand-neutral; piece definitions are canonical recognition targets.
-- Manufacturer-specific construction differences belong in piece_variants.

INSERT OR IGNORE INTO piece_families (id, name, category, shape, description, metadata_json, created_at, updated_at) VALUES
  ('family_standard', 'Standard', 'tile', NULL, 'Base magnetic tile shapes.', '{"status":"active"}', 0, 0),
  ('family_accents', 'Accents', 'tile', NULL, 'Architectural and decorative magnetic pieces.', '{"status":"active"}', 0, 0),
  ('family_geometry', 'Geometry', 'tile', NULL, 'Additional geometric magnetic shapes.', '{"status":"active"}', 0, 0),
  ('family_transportation', 'Transportation', 'transportation', NULL, 'Vehicle, road, racetrack, and later rail pieces.', '{"status":"active"}', 0, 0),
  ('family_structural_xl', 'Structural XL', 'tile', NULL, 'Oversized foundation and structural strip pieces.', '{"status":"active"}', 0, 0),
  ('family_micro', 'Micro', 'tile', NULL, 'Mini-scale pieces preserved for later identification work.', '{"status":"later"}', 0, 0);

INSERT OR IGNORE INTO piece_definitions (
  id, piece_family_id, brand_id, name, width_mm, height_mm, classification_json, properties_json, notes, created_at, updated_at
) VALUES
  ('piece_square', 'family_standard', NULL, 'Square', 76.2, 76.2, '{"referenceSize":"1x1","outerShape":"square","functionalType":"standard","status":"active","commonConfusions":["piece_large_square","piece_road_square","piece_square_frame","piece_window"]}', '{"measurementStatus":"nominal"}', NULL, 0, 0),
  ('piece_large_square', 'family_standard', NULL, 'Large Square', 152.4, 152.4, '{"referenceSize":"2x2","outerShape":"square","functionalType":"standard","status":"active","commonConfusions":["piece_square","piece_xl_foundation_4x3"]}', '{"measurementStatus":"nominal"}', NULL, 0, 0),
  ('piece_equilateral_triangle', 'family_standard', NULL, 'Equilateral Triangle', 71.12, 60.96, '{"outerShape":"triangle","functionalType":"standard","status":"active","commonConfusions":["piece_right_triangle","piece_isosceles_triangle"]}', '{"measurementStatus":"manufacturer_reference","sideIn":2.8,"heightIn":2.4}', NULL, 0, 0),
  ('piece_right_triangle', 'family_standard', NULL, 'Right Triangle', 71.12, 71.12, '{"outerShape":"triangle","functionalType":"standard","status":"active","commonConfusions":["piece_equilateral_triangle","piece_tall_right_triangle"]}', '{"measurementStatus":"manufacturer_reference","legAIn":2.8,"legBIn":2.8,"hypotenuseIn":3.7}', NULL, 0, 0),
  ('piece_isosceles_triangle', 'family_standard', NULL, 'Isosceles Triangle', 71.12, 142.24, '{"outerShape":"triangle","functionalType":"standard","status":"active","commonConfusions":["piece_equilateral_triangle","piece_tall_right_triangle"]}', '{"measurementStatus":"manufacturer_reference","baseIn":2.8,"equalSideIn":5.5,"heightIn":5.6}', NULL, 0, 0),
  ('piece_half_square_rectangle', 'family_standard', NULL, 'Half-Square Rectangle', 76.2, 38.1, '{"referenceSize":"1x0.5","outerShape":"rectangle","functionalType":"standard","status":"active","commonConfusions":["piece_finish_line","piece_caution_half_square"]}', '{"measurementStatus":"nominal"}', NULL, 0, 0),

  ('piece_square_frame', 'family_accents', NULL, 'Square Frame', NULL, NULL, '{"referenceSize":"~1x1","outerShape":"square","openingType":"frame","functionalType":"accent","status":"active","commonConfusions":["piece_window","piece_square"]}', '{"measurementStatus":"reference_image"}', NULL, 0, 0),
  ('piece_arched_frame', 'family_accents', NULL, 'Arched Frame', NULL, NULL, '{"referenceSize":"~1x1","outerShape":"square","openingType":"arch","functionalType":"accent","status":"active","commonConfusions":["piece_double_door"]}', '{"measurementStatus":"reference_image","aliases":["Arched Window","Door","Arch Window","Arched Square"]}', NULL, 0, 0),
  ('piece_window', 'family_accents', NULL, 'Window', NULL, NULL, '{"referenceSize":"~1x1","outerShape":"square","openingType":"panes","functionalType":"accent","status":"active","commonConfusions":["piece_square_frame","piece_square"]}', '{"measurementStatus":"reference_image","aliases":["Window Pane","Four-Pane Window"]}', 'Traditional four-pane window tile.', 0, 0),
  ('piece_double_door', 'family_accents', NULL, 'Double Door', NULL, NULL, '{"referenceSize":"~1x1","outerShape":"square","openingType":"cutout","functionalType":"accent","status":"active","commonConfusions":["piece_arched_frame"]}', '{"measurementStatus":"reference_image"}', NULL, 0, 0),
  ('piece_n_panel', 'family_accents', NULL, 'N Panel', NULL, NULL, '{"referenceSize":"~1x1","outerShape":"square","openingType":"cutout","functionalType":"accent","status":"active"}', '{"measurementStatus":"reference_image","aliases":["Letter N"]}', NULL, 0, 0),
  ('piece_i_panel', 'family_accents', NULL, 'I Panel', NULL, NULL, '{"referenceSize":"~1x1","outerShape":"square","openingType":"cutout","functionalType":"accent","status":"active"}', '{"measurementStatus":"reference_image","aliases":["Letter I"]}', NULL, 0, 0),
  ('piece_h_panel', 'family_accents', NULL, 'H Panel', NULL, NULL, '{"referenceSize":"~1x1","outerShape":"square","openingType":"cutout","functionalType":"accent","status":"active"}', '{"measurementStatus":"reference_image","aliases":["Letter H"]}', NULL, 0, 0),
  ('piece_fence', 'family_accents', NULL, 'Fence', 76.2, 38.1, '{"referenceSize":"1x0.5","outerShape":"irregular","openingType":"cutout","functionalType":"accent","status":"active"}', '{"measurementStatus":"nominal","visualCues":["half-tile height","four equal-height posts"]}', NULL, 0, 0),
  ('piece_wedge', 'family_accents', NULL, 'Wedge', NULL, NULL, '{"referenceSize":"~1x1","outerShape":"curved","functionalType":"accent","status":"active","commonConfusions":["piece_road_curve","piece_track_curve"]}', '{"measurementStatus":"reference_image"}', 'Quarter-round geometry.', 0, 0),
  ('piece_caution_half_square', 'family_accents', NULL, 'Caution Half-Square', 76.2, 38.1, '{"referenceSize":"1x0.5","outerShape":"rectangle","functionalType":"accent","surfaceVariant":"caution","status":"active","commonConfusions":["piece_half_square_rectangle","piece_finish_line"]}', '{"measurementStatus":"nominal","aliases":["Caution Tile","Striped Half Square"]}', 'Yellow/black diagonal striped half-square.', 0, 0),

  ('piece_tall_right_triangle', 'family_geometry', NULL, 'Tall Right Triangle', 71.12, 139.7, '{"referenceSize":"~1x2","outerShape":"triangle","functionalType":"geometry","status":"active","commonConfusions":["piece_right_triangle","piece_isosceles_triangle"]}', '{"measurementStatus":"estimated","shortLegIn":2.8,"longLegIn":5.5,"hypotenuseIn":6.2}', NULL, 0, 0),
  ('piece_trapezoid', 'family_geometry', NULL, 'Trapezoid', 142.24, 60.96, '{"outerShape":"polygon","functionalType":"geometry","status":"active","commonConfusions":["piece_rhombus"]}', '{"measurementStatus":"estimated","longBaseIn":5.6,"shortBaseIn":2.8,"slopedSideIn":2.8,"heightIn":2.4}', NULL, 0, 0),
  ('piece_rhombus', 'family_geometry', NULL, 'Rhombus', 121.92, 71.12, '{"outerShape":"polygon","functionalType":"geometry","status":"active","commonConfusions":["piece_trapezoid"]}', '{"measurementStatus":"estimated","sideIn":2.8,"aliases":["Diamond"]}', NULL, 0, 0),
  ('piece_pentagon', 'family_geometry', NULL, 'Pentagon', 114.3, 109.22, '{"outerShape":"polygon","functionalType":"geometry","status":"active","commonConfusions":["piece_hexagon"]}', '{"measurementStatus":"estimated","sideIn":2.8}', NULL, 0, 0),
  ('piece_hexagon', 'family_geometry', NULL, 'Hexagon', 142.24, 121.92, '{"outerShape":"polygon","functionalType":"geometry","status":"active","commonConfusions":["piece_pentagon"]}', '{"measurementStatus":"estimated","sideIn":2.8}', NULL, 0, 0),

  ('piece_car_base', 'family_transportation', NULL, 'Car Base', NULL, NULL, '{"subgroup":"Vehicles","referenceSize":"1x2","outerShape":"rectangle","functionalType":"vehicle","status":"active","commonConfusions":["piece_specialty_vehicle"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_specialty_vehicle', 'family_transportation', NULL, 'Specialty Vehicle', NULL, NULL, '{"subgroup":"Vehicles","referenceSize":"~1x1","outerShape":"irregular","functionalType":"vehicle","status":"active","commonConfusions":["piece_car_base"]}', '{"measurementStatus":"estimated_from_reference_image","aliases":["Dasher"]}', NULL, 0, 0),
  ('piece_road_square', 'family_transportation', NULL, 'Road Square', 76.2, 76.2, '{"subgroup":"Road","referenceSize":"1x1","outerShape":"square","functionalType":"road","surfaceVariant":"road","status":"active","commonConfusions":["piece_square"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_road_curve', 'family_transportation', NULL, 'Road Curve', 76.2, 76.2, '{"subgroup":"Road","referenceSize":"1x1","outerShape":"square","functionalType":"road","surfaceVariant":"road","status":"active","commonConfusions":["piece_wedge","piece_track_curve"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_ramp', 'family_transportation', NULL, 'Ramp', 76.2, 228.6, '{"subgroup":"Road","referenceSize":"1x3","outerShape":"rectangle","functionalType":"ramp","status":"active","commonConfusions":["piece_track_slope_ramp"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_finish_line', 'family_transportation', NULL, 'Finish Line', 76.2, 38.1, '{"subgroup":"Road","referenceSize":"1x0.5","outerShape":"rectangle","functionalType":"road","surfaceVariant":"finish_line","status":"active","commonConfusions":["piece_half_square_rectangle","piece_caution_half_square"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_track_turn', 'family_transportation', NULL, 'Track Turn', 76.2, 114.3, '{"subgroup":"Racetrack","referenceSize":"1x1.5","outerShape":"irregular","functionalType":"track","status":"active","commonConfusions":["piece_track_curve"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_speed_bump', 'family_transportation', NULL, 'Speed Bump', 76.2, 228.6, '{"subgroup":"Racetrack","referenceSize":"1x3","outerShape":"rectangle","functionalType":"track","status":"active","commonConfusions":["piece_track_slope_ramp"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_three_way_split', 'family_transportation', NULL, 'Three-Way Split', 152.4, 228.6, '{"subgroup":"Racetrack","referenceSize":"2x3","outerShape":"irregular","functionalType":"track","status":"active","commonConfusions":["piece_two_way_split"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_track_curve', 'family_transportation', NULL, 'Track Curve', 152.4, 152.4, '{"subgroup":"Racetrack","referenceSize":"2x2","outerShape":"curved","functionalType":"track","status":"active","commonConfusions":["piece_track_turn","piece_road_curve"]}', '{"measurementStatus":"user_reference","mirrorDirectionsShareCanonicalType":true}', NULL, 0, 0),
  ('piece_two_way_split', 'family_transportation', NULL, 'Two-Way Split', 152.4, 228.6, '{"subgroup":"Racetrack","referenceSize":"2x3","outerShape":"irregular","functionalType":"track","status":"active","commonConfusions":["piece_three_way_split"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_track_slope_ramp', 'family_transportation', NULL, 'Track Slope Ramp', 76.2, 228.6, '{"subgroup":"Racetrack","referenceSize":"1x3","outerShape":"rectangle","functionalType":"ramp","status":"active","commonConfusions":["piece_speed_bump","piece_ramp"]}', '{"measurementStatus":"user_reference"}', NULL, 0, 0),
  ('piece_track_base_2x1', 'family_transportation', NULL, 'Track Base 2x1', 152.4, 76.2, '{"subgroup":"Racetrack","referenceSize":"2x1","outerShape":"rectangle","functionalType":"track_support","status":"active"}', '{"measurementStatus":"user_reference","constructionTraits":["single continuous tile","no center magnet/divider"]}', NULL, 0, 0),
  ('piece_track_support', 'family_transportation', NULL, 'Track Support', NULL, NULL, '{"subgroup":"Racetrack","outerShape":"irregular","functionalType":"support","status":"active","commonConfusions":["piece_fence"]}', '{"measurementStatus":"reference_image"}', NULL, 0, 0),

  ('piece_xl_foundation_4x3', 'family_structural_xl', NULL, 'XL Foundation 4x3', 304.8, 228.6, '{"referenceSize":"4x3","outerShape":"rectangle","functionalType":"structural","status":"active","commonConfusions":["piece_large_square"]}', '{"measurementStatus":"manufacturer_reference"}', NULL, 0, 0),
  ('piece_xl_strip_3x1', 'family_structural_xl', NULL, 'XL Strip 3x1', 228.6, 76.2, '{"referenceSize":"3x1","outerShape":"rectangle","functionalType":"structural","status":"active"}', '{"measurementStatus":"manufacturer_reference"}', NULL, 0, 0),
  ('piece_xl_strip_4x1', 'family_structural_xl', NULL, 'Long XL Strip 4x1', 304.8, 76.2, '{"referenceSize":"4x1","outerShape":"rectangle","functionalType":"structural","status":"active"}', '{"measurementStatus":"manufacturer_reference"}', NULL, 0, 0),

  ('piece_micro_right_triangle', 'family_micro', NULL, 'Micro Right Triangle', NULL, NULL, '{"outerShape":"triangle","functionalType":"micro","status":"later"}', '{"aliases":["microMAGS Right Triangle"]}', 'Preserved in taxonomy; not a current identification focus.', 0, 0),
  ('piece_standard_rail', 'family_transportation', NULL, 'Standard Rail', NULL, NULL, '{"subgroup":"Rail","functionalType":"rail","status":"later"}', '{}', 'Deferred; rail/marble-run pieces are not a current identification focus.', 0, 0),
  ('piece_short_rail', 'family_transportation', NULL, 'Short Rail', NULL, NULL, '{"subgroup":"Rail","functionalType":"rail","status":"later"}', '{}', 'Deferred; rail/marble-run pieces are not a current identification focus.', 0, 0),
  ('piece_curved_rail', 'family_transportation', NULL, 'Curved Rail', NULL, NULL, '{"subgroup":"Rail","functionalType":"rail","status":"later"}', '{}', 'Deferred; rail/marble-run pieces are not a current identification focus.', 0, 0),
  ('piece_straight_slide', 'family_transportation', NULL, 'Straight Slide', NULL, NULL, '{"subgroup":"Rail","functionalType":"rail","status":"later"}', '{}', 'Deferred; rail/marble-run pieces are not a current identification focus.', 0, 0),
  ('piece_trapdoor', 'family_transportation', NULL, 'Trapdoor', NULL, NULL, '{"subgroup":"Rail","functionalType":"rail","status":"later"}', '{}', 'Deferred; rail/marble-run pieces are not a current identification focus.', 0, 0),
  ('piece_quarter_arc', 'family_transportation', NULL, 'Quarter Arc', NULL, NULL, '{"subgroup":"Rail","functionalType":"rail","status":"later"}', '{}', 'Deferred; rail/marble-run pieces are not a current identification focus.', 0, 0);

INSERT OR IGNORE INTO piece_variants (
  id, piece_definition_id, name, properties_json, notes, created_at, updated_at
) VALUES (
  'variant_large_square_no_center_magnets',
  'piece_large_square',
  'No Center Magnets',
  '{"constructionTraits":["no center magnet positions"]}',
  'Large Square variant with perimeter magnet placement and no center magnet positions.',
  0,
  0
);
