import { NextRequest, NextResponse } from "next/server";
import { fetchPageContentSafe, isCampaignActive } from "../../lib/content";

type PrizeEntryPayload = {
  campaignId?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  phoneNumber?: unknown;
};

const SAVE_ERROR_MESSAGE = "تعذّر حفظ البيانات حالياً. حاول مرة أخرى.";

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidPhoneNumber(value: string) {
  return /^[0-9+()\-\s]{8,25}$/.test(value);
}

export async function POST(request: NextRequest) {
  const submitUrl = process.env.ENTRY_SUBMIT_URL;

  if (!submitUrl) {
    return NextResponse.json({ message: "ENTRY_SUBMIT_URL is not configured" }, { status: 500 });
  }

  let body: PrizeEntryPayload;

  try {
    body = (await request.json()) as PrizeEntryPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const firstName = stringValue(body.firstName);
  const lastName = stringValue(body.lastName);
  const phoneNumber = stringValue(body.phoneNumber);
  const campaignId = stringValue(body.campaignId);

  if (!firstName || !lastName || !phoneNumber) {
    return NextResponse.json({ message: "يرجى تعبئة جميع الحقول المطلوبة." }, { status: 400 });
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return NextResponse.json({ message: "يرجى إدخال رقم هاتف صحيح." }, { status: 400 });
  }

  try {
    const content = await fetchPageContentSafe();

    if (!isCampaignActive(content)) {
      return NextResponse.json({ message: "انتهت فترة التسجيل الحالية." }, { status: 409 });
    }

    if (content.campaign_id && campaignId && content.campaign_id !== campaignId) {
      return NextResponse.json(
        { message: "تم تحديث الحملة الحالية. أعد المحاولة من الصفحة الرئيسية." },
        { status: 409 },
      );
    }

    const submittedAt = new Date().toISOString();
    const upstreamResponse = await fetch(submitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaign_id: content.campaign_id,
        campaign_title: content.campaign_form_title,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        submitted_at: submittedAt,
        source_path: "/prize-entry",
        referer: request.headers.get("referer") ?? "",
        user_agent: request.headers.get("user-agent") ?? "",
      }),
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      const upstreamBody = await upstreamResponse.text().catch(() => "");
      console.error("Prize entry upstream failed", {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        body: upstreamBody.slice(0, 1000),
      });

      return NextResponse.json({ message: SAVE_ERROR_MESSAGE }, { status: 502 });
    }

    return NextResponse.json({ ok: true, submittedAt });
  } catch (error) {
    console.error("Prize entry submission failed", error);

    return NextResponse.json({ message: SAVE_ERROR_MESSAGE }, { status: 502 });
  }
}
