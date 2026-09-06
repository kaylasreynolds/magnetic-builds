"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db/client";
import { createBuild, normalizeBuildTitle } from "@/lib/builds";

export type CreateBuildState = { error: string | null };

export async function createBuildAction(
  _state: CreateBuildState,
  formData: FormData,
): Promise<CreateBuildState> {
  let buildId: string;
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDatabase((env as { DB: D1Database }).DB);
    buildId = await createBuild(db, normalizeBuildTitle(formData.get("title")));
  } catch (error) {
    console.error("Unable to create build", error);
    return { error: "We couldn’t save this build. Please try again." };
  }

  redirect(`/builds/${buildId}`);
}
