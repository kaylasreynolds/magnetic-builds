export const UNTITLED_BUILD = "Untitled Build";
export const INITIAL_BUILD_STATUS = "saved";
export const INITIAL_VERSION_STATUS = "current";

export function normalizeBuildTitle(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const title = value.trim();
  return title.length > 0 ? title : null;
}

export function displayBuildTitle(title: string | null): string {
  return title?.trim() || UNTITLED_BUILD;
}

export function makeInitialBuild(title: string | null, buildId: string, versionId: string, now: Date) {
  return {
    build: {
      id: buildId,
      title,
      status: INITIAL_BUILD_STATUS,
      visibility: "private" as const,
      createdAt: now,
      updatedAt: now,
    },
    version: {
      id: versionId,
      buildId,
      versionOrder: 1,
      status: INITIAL_VERSION_STATUS,
      createdAt: now,
      updatedAt: now,
    },
  };
}
