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

export const studioPalette = ["#ff5c8a", "#ffb347", "#58c6ff", "#9b7bff", "#52d273", "#ffd84d"];

export const studioPieceOptions: StudioPieceKind[] = ["square", "right-triangle", "ramp"];

export const studioPieceLabels: Record<StudioPieceKind, string> = {
  square: "Square",
  "right-triangle": "Right Triangle",
  ramp: "Track Slope Ramp",
};

export function createBlankStudioBuild(title = "Untitled Build"): StudioBuild {
  return { id: cryptoSafeId(), title, placements: [] };
}

function cryptoSafeId() {
  return `studio-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function isStudioBuild(value: unknown): value is StudioBuild {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StudioBuild>;
  return typeof candidate.title === "string" && Array.isArray(candidate.placements);
}

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
