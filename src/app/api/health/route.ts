import { count } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDatabase } from "@/db/client";
import { brands, pieceFamilies, sets, userCollections } from "@/db/schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDatabase();
    const [[brandCount], [familyCount], [setCount], [collectionCount]] = await Promise.all([
      db.select({ value: count() }).from(brands), db.select({ value: count() }).from(pieceFamilies),
      db.select({ value: count() }).from(sets), db.select({ value: count() }).from(userCollections),
    ]);
    return NextResponse.json({ status: "ok", database: "connected", seededData: { brands: brandCount.value, pieceFamilies: familyCount.value, sets: setCount.value, collections: collectionCount.value } });
  } catch (error) {
    console.error("Database health check failed", error);
    return NextResponse.json({ status: "error", message: "Database unavailable. Run migrations and seed data, then try again." }, { status: 503 });
  }
}
