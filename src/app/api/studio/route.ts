import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { getDatabase } from "@/db/client";
import { isStudioBuild } from "@/lib/studio-model";
import { saveStudioBuild } from "@/lib/studio-builds";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { buildId?: string | null; build?: unknown };
    if (!isStudioBuild(payload.build)) {
      return NextResponse.json({ error: "Invalid Studio build." }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = getDatabase((env as { DB: D1Database }).DB);
    const buildId = await saveStudioBuild(db, payload.build, payload.buildId ?? null);
    return NextResponse.json({ buildId });
  } catch (error) {
    console.error("Unable to save Studio build", error);
    return NextResponse.json({ error: "We couldn’t save this Studio build. Please try again." }, { status: 500 });
  }
}
