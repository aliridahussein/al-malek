import { NextResponse } from "next/server";
import { fetchPageContentSafe } from "../../lib/content";

export async function GET() {
  try {
    const content = await fetchPageContentSafe();

    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Content fetch failed" }, { status: 502 });
  }
}
