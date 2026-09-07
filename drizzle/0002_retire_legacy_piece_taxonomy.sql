PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Retire Milestone 0 shape-as-family rows and brand/color-specific duplicate piece definitions.
-- Existing references are first repointed to canonical brand-neutral piece definitions.

DELETE FROM set_contents
WHERE id IN (
  'content_classic100_standard_square',
  'content_cars2_green_chassis',
  'content_cars2_yellow_chassis'
);
--> statement-breakpoint
UPDATE set_contents SET piece_definition_id = 'piece_large_square'
WHERE id = 'content_classic100_large_square';
UPDATE set_contents SET piece_definition_id = 'piece_equilateral_triangle'
WHERE id = 'content_classic100_equilateral_triangle';
UPDATE set_contents SET piece_definition_id = 'piece_right_triangle'
WHERE id = 'content_classic100_right_triangle';
UPDATE set_contents SET piece_definition_id = 'piece_isosceles_triangle'
WHERE id = 'content_classic100_isosceles_triangle';
--> statement-breakpoint
UPDATE inventory_adjustments SET piece_definition_id = 'piece_square'
WHERE piece_definition_id = 'piece_magna_standard_square';
UPDATE inventory_adjustments SET piece_definition_id = 'piece_large_square'
WHERE piece_definition_id = 'piece_magna_large_square';
UPDATE inventory_adjustments SET piece_definition_id = 'piece_equilateral_triangle'
WHERE piece_definition_id = 'piece_magna_equilateral_triangle';
UPDATE inventory_adjustments SET piece_definition_id = 'piece_right_triangle'
WHERE piece_definition_id = 'piece_magna_right_triangle';
UPDATE inventory_adjustments SET piece_definition_id = 'piece_isosceles_triangle'
WHERE piece_definition_id = 'piece_magna_isosceles_triangle';
UPDATE inventory_adjustments SET piece_definition_id = 'piece_car_base'
WHERE piece_definition_id IN ('piece_magna_green_wheeled_chassis','piece_magna_yellow_wheeled_chassis');
--> statement-breakpoint
UPDATE build_piece_requirements SET piece_definition_id = 'piece_square'
WHERE piece_definition_id = 'piece_magna_standard_square';
UPDATE build_piece_requirements SET piece_definition_id = 'piece_large_square'
WHERE piece_definition_id = 'piece_magna_large_square';
UPDATE build_piece_requirements SET piece_definition_id = 'piece_equilateral_triangle'
WHERE piece_definition_id = 'piece_magna_equilateral_triangle';
UPDATE build_piece_requirements SET piece_definition_id = 'piece_right_triangle'
WHERE piece_definition_id = 'piece_magna_right_triangle';
UPDATE build_piece_requirements SET piece_definition_id = 'piece_isosceles_triangle'
WHERE piece_definition_id = 'piece_magna_isosceles_triangle';
UPDATE build_piece_requirements SET piece_definition_id = 'piece_car_base'
WHERE piece_definition_id IN ('piece_magna_green_wheeled_chassis','piece_magna_yellow_wheeled_chassis');

UPDATE build_piece_requirements SET piece_family_id = 'family_standard'
WHERE piece_family_id IN (
  'family_standard_square','family_large_square','family_equilateral_triangle',
  'family_right_triangle','family_isosceles_triangle'
);
UPDATE build_piece_requirements SET piece_family_id = 'family_transportation'
WHERE piece_family_id = 'family_wheeled_chassis';
--> statement-breakpoint
UPDATE piece_variants SET piece_definition_id = 'piece_square'
WHERE piece_definition_id = 'piece_magna_standard_square';
UPDATE piece_variants SET piece_definition_id = 'piece_large_square'
WHERE piece_definition_id = 'piece_magna_large_square';
UPDATE piece_variants SET piece_definition_id = 'piece_equilateral_triangle'
WHERE piece_definition_id = 'piece_magna_equilateral_triangle';
UPDATE piece_variants SET piece_definition_id = 'piece_right_triangle'
WHERE piece_definition_id = 'piece_magna_right_triangle';
UPDATE piece_variants SET piece_definition_id = 'piece_isosceles_triangle'
WHERE piece_definition_id = 'piece_magna_isosceles_triangle';
UPDATE piece_variants SET piece_definition_id = 'piece_car_base'
WHERE piece_definition_id IN ('piece_magna_green_wheeled_chassis','piece_magna_yellow_wheeled_chassis');
--> statement-breakpoint
DELETE FROM piece_definitions
WHERE id IN (
  'piece_magna_standard_square',
  'piece_magna_large_square',
  'piece_magna_equilateral_triangle',
  'piece_magna_right_triangle',
  'piece_magna_isosceles_triangle',
  'piece_magna_green_wheeled_chassis',
  'piece_magna_yellow_wheeled_chassis'
);
--> statement-breakpoint
DELETE FROM piece_families
WHERE id IN (
  'family_standard_square',
  'family_large_square',
  'family_equilateral_triangle',
  'family_right_triangle',
  'family_isosceles_triangle',
  'family_wheeled_chassis'
);
