import { NextResponse } from "next/server";
import { fetchPageContent } from "../../lib/content";

export async function GET() {
  try {
    const content = await fetchPageContent();

    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ error: "Content fetch failed" }, { status: 502 });
  }
}