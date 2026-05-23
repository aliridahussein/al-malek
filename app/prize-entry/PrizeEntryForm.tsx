"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput, { getCountryCallingCode, type Country, type Value } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

type PrizeEntryFormProps = {
  campaignId: string;
  title: string;
  description: string;
  successMessage: string;
};

type FormState = {
  firstName: string;
  lastName: string;
};

const SUBMIT_ERROR_MESSAGE = "تعذّر إرسال البيانات حالياً. حاول مرة أخرى.";

const initialState: FormState = {
  firstName: "",
  lastName: "",
};

export default function PrizeEntryForm({
  campaignId,
  title,
  description,
  successMessage,
}: PrizeEntryFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [phoneNumber, setPhoneNumber] = useState<Value>();
  const [selectedCountry, setSelectedCountry] = useState<Country>("LB");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.replace("/");
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [router, submitted]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!phoneNumber) {
      setError("يرجى إدخال رقم هاتف صحيح.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/prize-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId,
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message || SUBMIT_ERROR_MESSAGE);
      }

      setSubmitted(true);
      setForm(initialState);
      setPhoneNumber(undefined);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : SUBMIT_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="w-full rounded-[28px] bg-white/85 px-6 py-8 text-center shadow-[0_18px_60px_rgba(129,52,175,0.14)] backdrop-blur-xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.28em]" style={{ color: "#FF4D8D" }}>Submitted</p>
        <h1 className="mt-3 text-2xl font-black leading-tight" dir="rtl" style={{ color: "#1A0A2E" }}>
          {successMessage || "تم تسجيل معلوماتك بنجاح"}
        </h1>
        <p className="mt-4 text-sm font-semibold" dir="rtl" style={{ color: "#3D1A6E" }}>
          سيتم إعادتك إلى الصفحة الرئيسية...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[32px] bg-white/84 px-5 py-6 shadow-[0_22px_72px_rgba(129,52,175,0.14)] backdrop-blur-xl sm:px-6">
      <p className="text-center text-sm font-extrabold uppercase tracking-[0.28em]" style={{ color: "#FF4D8D" }}>Prize Entry</p>
      <h1 className="mt-3 text-center text-2xl font-black leading-tight" dir="rtl" style={{ color: "#1A0A2E" }}>
        {title}
      </h1>
      {description ? (
        <p className="mt-3 text-center text-sm leading-6" dir="rtl" style={{ color: "#3D1A6E" }}>
          {description}
        </p>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-right text-sm font-semibold" dir="rtl" style={{ color: "#1A0A2E" }}>
            الاسم الأول
          </span>
          <input
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            className="min-h-12 w-full rounded-2xl border border-[#f0d8ea] bg-white px-4 py-3 text-right text-base outline-none transition focus:border-[#FF4D8D] focus:ring-2 focus:ring-[#ffd7e8]"
            dir="rtl"
            required
            maxLength={60}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-right text-sm font-semibold" dir="rtl" style={{ color: "#1A0A2E" }}>
            اسم العائلة
          </span>
          <input
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            className="min-h-12 w-full rounded-2xl border border-[#f0d8ea] bg-white px-4 py-3 text-right text-base outline-none transition focus:border-[#FF4D8D] focus:ring-2 focus:ring-[#ffd7e8]"
            dir="rtl"
            required
            maxLength={60}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-right text-sm font-semibold" dir="rtl" style={{ color: "#1A0A2E" }}>
            رقم الهاتف
          </span>
          <div className="prize-phone-shell">
            <PhoneInput
              defaultCountry="LB"
              flags={flags}
              value={phoneNumber}
              onChange={setPhoneNumber}
              onCountryChange={(country) => {
                if (country) {
                  setSelectedCountry(country);
                }
              }}
              className="prize-phone-input"
              numberInputProps={{
                required: true,
                autoComplete: "tel",
              }}
            />
            <span className="prize-phone-code">+{getCountryCallingCode(selectedCountry)}</span>
          </div>
        </label>

        {error ? (
          <p className="rounded-2xl border border-[#ffc8d9] bg-[#fff2f7] px-4 py-3 text-sm font-medium" dir="rtl" style={{ color: "#B4235B" }}>
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full rounded-2xl px-5 py-3 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, #FF4D8D 0%, #8134AF 100%)", boxShadow: "0 14px 30px rgba(129,52,175,0.22)" }}
        >
          {isSubmitting ? "جارٍ الإرسال..." : "إرسال البيانات"}
        </button>
      </form>
    </div>
  );
}
