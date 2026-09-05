import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    database: "cloudflare-d1",
    binding: "DB",
    message: "Application health is OK. D1 is supplied by the Cloudflare runtime binding.",
  });
}
