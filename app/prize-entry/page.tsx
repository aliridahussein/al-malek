import Link from "next/link";
import PrizeEntryForm from "./PrizeEntryForm";
import { fetchPageContentSafe, isCampaignActive } from "../lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PrizeEntryPage() {
  let content;

  try {
    content = await fetchPageContentSafe({ cache: "no-store" });
  } catch {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[28px] bg-white/84 px-6 py-8 text-center shadow-[0_18px_60px_rgba(129,52,175,0.14)] backdrop-blur-xl">
          <p className="text-sm font-semibold" dir="rtl" style={{ color: "#8134AF" }}>
            تعذّر تحميل صفحة التسجيل حالياً. حاول مرة أخرى.
          </p>
        </div>
      </main>
    );
  }

  if (!isCampaignActive(content)) {
    return (
      <main className="min-h-dvh px-4 py-10">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
          <Link href="/" className="inline-flex items-center justify-center self-start rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#3D1A6E] shadow-[0_10px_30px_rgba(129,52,175,0.12)] backdrop-blur">
            العودة للرئيسية
          </Link>

          <div className="w-full rounded-[28px] bg-white/84 px-6 py-8 text-center shadow-[0_18px_60px_rgba(129,52,175,0.14)] backdrop-blur-xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.28em]" style={{ color: "#FF4D8D" }}>Prize Entry</p>
            <h1 className="mt-3 text-2xl font-black leading-tight" dir="rtl" style={{ color: "#1A0A2E" }}>
              التسجيل غير متاح حالياً
            </h1>
            <p className="mt-3 text-sm leading-6" dir="rtl" style={{ color: "#3D1A6E" }}>
              يرجى العودة إلى الصفحة الرئيسية والمحاولة لاحقاً.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-4 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <Link href="/" className="inline-flex items-center justify-center self-start rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#3D1A6E] shadow-[0_10px_30px_rgba(129,52,175,0.12)] backdrop-blur">
          العودة للرئيسية
        </Link>

        <PrizeEntryForm
          campaignId={content.campaign_id}
          title={content.campaign_form_title}
          description={content.campaign_form_description}
          successMessage={content.campaign_success_message}
        />
      </div>
    </main>
  );
}
