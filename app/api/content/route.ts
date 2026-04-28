import { NextResponse } from "next/server";

const FALLBACK_CONTENT_URL =
  "https://script.google.com/macros/s/AKfycbwccMrp8Kf4Sg26z2fBHILKgaEu9xl6MvbyAWCBAGe7UQkAzC_rpmWQVye1oRFCcRG4/exec";

type PageContent = {
  tagline: string;
  tagline_note: string;
  promo_text: string;
  promo_note: string;
  whatsapp_label: string;
  whatsapp_sub: string;
  whatsapp_url: string;
  tiktok_label: string;
  tiktok_sub: string;
  tiktok_url: string;
  instagram_label: string;
  instagram_sub: string;
  instagram_url: string;
};

const requiredKeys: Array<keyof PageContent> = [
  "tagline",
  "tagline_note",
  "promo_text",
  "promo_note",
  "whatsapp_label",
  "whatsapp_sub",
  "whatsapp_url",
  "tiktok_label",
  "tiktok_sub",
  "tiktok_url",
  "instagram_label",
  "instagram_sub",
  "instagram_url",
];

export async function GET() {
  const sourceUrl = process.env.CONTENT_URL ?? process.env.NEXT_PUBLIC_CONTENT_URL ?? FALLBACK_CONTENT_URL;

  try {
    const response = await fetch(sourceUrl, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({ error: "Upstream content request failed" }, { status: 502 });
    }

    const data = (await response.json()) as Partial<PageContent>;
    const hasAllKeys = requiredKeys.every((key) => typeof data[key] === "string" && data[key]!.trim().length > 0);

    if (!hasAllKeys) {
      return NextResponse.json({ error: "Invalid content payload" }, { status: 502 });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ error: "Content fetch failed" }, { status: 502 });
  }
}