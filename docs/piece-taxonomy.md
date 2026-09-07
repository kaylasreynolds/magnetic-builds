# Canonical piece taxonomy

This document records the current Tileable/Magnetic Builds piece-identification taxonomy.

## Active families

- Standard
- Accents
- Geometry
- Transportation
- Structural XL

## Deferred families / subgroups

- Micro
- Transportation / Rail

## Standard

- Square — 1x1
- Large Square — 2x2
- Equilateral Triangle — 2.8 in sides, ~2.4 in height
- Right Triangle — 2.8 in legs, ~3.7 in hypotenuse
- Isosceles Triangle — 2.8 in base, ~5.5 in equal sides, ~5.6 in height
- Half-Square Rectangle — 1x0.5

## Accents

- Square Frame
- Arched Frame
- Window — traditional four-pane window tile
- Double Door
- N Panel
- I Panel
- H Panel
- Fence — 1x0.5, four equal-height posts
- Wedge
- Caution Half-Square — 1x0.5

## Geometry

- Tall Right Triangle — estimated 2.8 x 5.5 in legs, ~6.2 in hypotenuse
- Trapezoid
- Rhombus — alias: Diamond
- Pentagon
- Hexagon

Geometry measurements are estimates unless manufacturer-measured values are available.

## Transportation

### Vehicles

- Car Base — 1x2
- Specialty Vehicle — approximately 1x1

### Road

- Road Square — 1x1
- Road Curve — 1x1
- Ramp — 1x3
- Finish Line — 1x0.5

### Racetrack

- Track Turn — 1x1.5
- Speed Bump — 1x3
- Three-Way Split — 2x3
- Track Curve — 2x2
- Two-Way Split — 2x3
- Track Slope Ramp — 1x3
- Track Base 2x1 — 2x1, one continuous tile with no center magnet/divider
- Track Support — vertical structural support

### Rail — deferred

- Standard Rail
- Short Rail
- Curved Rail
- Straight Slide
- Trapdoor
- Quarter Arc

## Structural XL

- XL Foundation 4x3 — nominal 12 x 9 in
- XL Strip 3x1 — nominal 9 x 3 in
- Long XL Strip 4x1 — nominal 12 x 3 in

## Micro — deferred

- Micro Right Triangle

Manufacturer-specific branded terms should be stored as aliases/source metadata, not canonical taxonomy names.

## Recognition model

Canonical piece definitions stay brand-neutral. Manufacturer/build differences belong in `piece_variants` or set/product provenance. Recognition metadata lives in `classification_json` and dimensional/alias/construction metadata lives in `properties_json`.
