const FALLBACK_CONTENT_URL =
  "https://script.google.com/macros/s/AKfycbwccMrp8Kf4Sg26z2fBHILKgaEu9xl6MvbyAWCBAGe7UQkAzC_rpmWQVye1oRFCcRG4/exec";

export type PageContent = {
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
  campaign_id: string;
  campaign_enabled: boolean;
  campaign_start_at: string;
  campaign_end_at: string;
  campaign_badge_label: string;
  campaign_button_label: string;
  campaign_form_title: string;
  campaign_form_description: string;
  campaign_success_message: string;
};

const requiredKeys: Array<keyof Pick<
  PageContent,
  | "tagline"
  | "tagline_note"
  | "promo_text"
  | "promo_note"
  | "whatsapp_label"
  | "whatsapp_sub"
  | "whatsapp_url"
  | "tiktok_label"
  | "tiktok_sub"
  | "tiktok_url"
  | "instagram_label"
  | "instagram_sub"
  | "instagram_url"
>> = [
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

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function booleanValue(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return false;
}

export function getContentSourceUrl() {
  return process.env.CONTENT_URL ?? process.env.NEXT_PUBLIC_CONTENT_URL ?? FALLBACK_CONTENT_URL;
}

export function normalizeContent(data: Partial<Record<keyof PageContent, unknown>>): PageContent {
  return {
    tagline: stringValue(data.tagline),
    tagline_note: stringValue(data.tagline_note),
    promo_text: stringValue(data.promo_text),
    promo_note: stringValue(data.promo_note),
    whatsapp_label: stringValue(data.whatsapp_label),
    whatsapp_sub: stringValue(data.whatsapp_sub),
    whatsapp_url: stringValue(data.whatsapp_url),
    tiktok_label: stringValue(data.tiktok_label),
    tiktok_sub: stringValue(data.tiktok_sub),
    tiktok_url: stringValue(data.tiktok_url),
    instagram_label: stringValue(data.instagram_label),
    instagram_sub: stringValue(data.instagram_sub),
    instagram_url: stringValue(data.instagram_url),
    campaign_id: stringValue(data.campaign_id),
    campaign_enabled: booleanValue(data.campaign_enabled),
    campaign_start_at: stringValue(data.campaign_start_at),
    campaign_end_at: stringValue(data.campaign_end_at),
    campaign_badge_label: stringValue(data.campaign_badge_label),
    campaign_button_label: stringValue(data.campaign_button_label),
    campaign_form_title: stringValue(data.campaign_form_title),
    campaign_form_description: stringValue(data.campaign_form_description),
    campaign_success_message: stringValue(data.campaign_success_message),
  };
}

export function hasRequiredContent(content: PageContent) {
  return requiredKeys.every((key) => content[key].trim().length > 0);
}

export function isCampaignActive(content: PageContent) {
  return content.campaign_enabled;
}

export async function fetchPageContent(init?: RequestInit) {
  const response = await fetch(getContentSourceUrl(), { cache: "no-store", ...init });

  if (!response.ok) {
    throw new Error("Upstream content request failed");
  }

  const data = (await response.json()) as Partial<Record<keyof PageContent, unknown>>;
  const content = normalizeContent(data);

  if (!hasRequiredContent(content)) {
    throw new Error("Invalid content payload");
  }

  return content;
}