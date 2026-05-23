const FALLBACK_CONTENT_URL =
  "https://script.google.com/macros/s/AKfycbwccMrp8Kf4Sg26z2fBHILKgaEu9xl6MvbyAWCBAGe7UQkAzC_rpmWQVye1oRFCcRG4/exec";

const CONTENT_REVALIDATE_SECONDS = 60;
const CONTENT_TIMEOUT_MS = 10000;

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

let lastGoodContent: PageContent | null = null;

const DEFAULT_CONTENT: PageContent = {
  tagline: "لم يحالفك الحظ اليوم...",
  tagline_note: "القادم أجمل",
  promo_text: "ابتسم... الدنيا ما بتقاوم اللي بيضحك",
  promo_note: "كن جزءا من عائلتنا",
  whatsapp_label: "قناة الواتساب",
  whatsapp_sub: "تابع جديدنا ونكهاتنا وعروضنا أولا بأول",
  whatsapp_url: "https://whatsapp.com/channel/0029VbCh4rxLtOjFazQUdv0Q",
  tiktok_label: "تيك توك",
  tiktok_sub: "عائلة آيس كريم الملك تكبر بكم",
  tiktok_url: "https://www.tiktok.com/@almalek.icecream?_r=1&_t=ZS-95ulf7OvPwC",
  instagram_label: "إنستغرام",
  instagram_sub: "ستورياتكم بتسعدنا",
  instagram_url: "https://www.instagram.com/almalek_icecream?igsh=MXZtbGE0eGpwNDhmeQ==",
  campaign_id: "",
  campaign_enabled: false,
  campaign_start_at: "",
  campaign_end_at: "",
  campaign_badge_label: "Prize Window",
  campaign_button_label: "ادخل معلوماتك للفوز",
  campaign_form_title: "ادخل معلوماتك للفوز بجوائز قيمة",
  campaign_form_description: "املأ النموذج التالي وسنتواصل معك عند السحب",
  campaign_success_message: "تم تسجيل معلوماتك بنجاح، بالتوفيق",
};

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

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONTENT_TIMEOUT_MS);
  const useFreshFetch = init?.cache === "no-store";

  try {
    return await fetch(url, {
      ...init,
      next: useFreshFetch ? init?.next : { revalidate: CONTENT_REVALIDATE_SECONDS, ...init?.next },
      signal: init?.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPageContent(init?: RequestInit) {
  const response = await fetchWithTimeout(getContentSourceUrl(), init);

  if (!response.ok) {
    throw new Error("Upstream content request failed");
  }

  const data = (await response.json()) as Partial<Record<keyof PageContent, unknown>>;
  const content = normalizeContent(data);

  if (!hasRequiredContent(content)) {
    throw new Error("Invalid content payload");
  }

  lastGoodContent = content;

  return content;
}

export async function fetchPageContentSafe(init?: RequestInit) {
  try {
    return await fetchPageContent(init);
  } catch (error) {
    if (lastGoodContent) {
      console.error("Content fetch failed, using last good content", error);
      return lastGoodContent;
    }

    console.error("Content fetch failed, using default content", error);
    return DEFAULT_CONTENT;
  }
}
