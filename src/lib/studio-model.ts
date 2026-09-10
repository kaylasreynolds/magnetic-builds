export type StudioPieceKind = "square" | "right-triangle" | "ramp";

export type StudioPlacement = {
  id: string;
  piece: StudioPieceKind;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  step: number;
};

export type StudioBuild = {
  id: string;
  title: string;
  placements: StudioPlacement[];
};

const palette = ["#ff5c8a", "#ffb347", "#58c6ff", "#9b7bff", "#52d273", "#ffd84d"];

function makeDemoTower(): StudioBuild {
  const placements: StudioPlacement[] = [];
  let id = 1;

  // 42 squares: seven six-piece rings. This deliberately uses the real piece count
  // from the first reference build while keeping the starter model easy to inspect.
  for (let level = 0; level < 7; level += 1) {
    for (let side = 0; side < 6; side += 1) {
      const angle = (Math.PI * 2 * side) / 6;
      const radius = 2.45;
      placements.push({
        id: `sq-${id++}`,
        piece: "square",
        color: palette[(level + side) % palette.length],
        position: [Math.cos(angle) * radius, 1 + level * 1.92, Math.sin(angle) * radius],
        rotation: [0, -angle + Math.PI / 2, 0],
        step: level + 1,
      });
    }
  }

  // 14 right triangles: two roof rings, introduced in two separate steps.
  for (let ring = 0; ring < 2; ring += 1) {
    for (let side = 0; side < 7; side += 1) {
      const angle = (Math.PI * 2 * side) / 7;
      const radius = ring === 0 ? 2.2 : 1.25;
      placements.push({
        id: `tri-${id++}`,
        piece: "right-triangle",
        color: palette[(side + ring * 2) % palette.length],
        position: [Math.cos(angle) * radius, 14.4 + ring * 1.05, Math.sin(angle) * radius],
        rotation: [0, -angle + Math.PI / 2, ring === 0 ? 0.16 : -0.16],
        step: 8 + ring,
      });
    }
  }

  placements.push({
    id: `ramp-${id}`,
    piece: "ramp",
    color: "#58c6ff",
    position: [0, 0.35, 5.2],
    rotation: [-0.16, 0, 0],
    step: 10,
  });

  return {
    id: "first-tower-demo",
    title: "Tower Build",
    placements,
  };
}

export const demoStudioBuild = makeDemoTower();

export function studioPieceCounts(build: StudioBuild) {
  return build.placements.reduce<Record<StudioPieceKind, number>>(
    (counts, placement) => {
      counts[placement.piece] += 1;
      return counts;
    },
    { square: 0, "right-triangle": 0, ramp: 0 },
  );
}

export function studioStepCount(build: StudioBuild) {
  return build.placements.reduce((highest, placement) => Math.max(highest, placement.step), 1);
}
