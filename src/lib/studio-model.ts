export type StudioPieceKind = "square" | "right-triangle" | "track-slope-ramp";

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

export const studioPieceLabels: Record<StudioPieceKind, string> = {
  square: "Square",
  "right-triangle": "Right Triangle",
  "track-slope-ramp": "Track Slope Ramp",
};

export const studioPieceOptions: StudioPieceKind[] = ["square", "right-triangle", "track-slope-ramp"];

export const studioPalette = ["#ff5c8a", "#ffb347", "#58c6ff", "#9b7bff", "#52d273", "#ffd84d"];

export function createBlankStudioBuild(): StudioBuild {
  return {
    id: "local-studio-build",
    title: "Untitled Build",
    placements: [],
  };
}

export function studioPieceCounts(build: StudioBuild) {
  return build.placements.reduce<Record<StudioPieceKind, number>>(
    (counts, placement) => {
      counts[placement.piece] += 1;
      return counts;
    },
    { square: 0, "right-triangle": 0, "track-slope-ramp": 0 },
  );
}

export function studioStepCount(build: StudioBuild) {
  return build.placements.reduce((highest, placement) => Math.max(highest, placement.step), 1);
}
