"use client";

import { useState } from "react";

type PrizeEntryFormProps = {
  campaignId: string;
  title: string;
  description: string;
  successMessage: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

export default function PrizeEntryForm({
  campaignId,
  title,
  description,
  successMessage,
}: PrizeEntryFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

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
          phoneNumber: form.phoneNumber,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message || "تعذّر إرسال البيانات حالياً. حاول مرة أخرى.");
      }

      setSubmitted(true);
      setForm(initialState);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "تعذّر إرسال البيانات حالياً. حاول مرة أخرى.");
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
      </div>
    );
  }

  return (
    <div className="w-full rounded-[32px] bg-white/84 px-5 py-6 shadow-[0_22px_72px_rgba(129,52,175,0.14)] backdrop-blur-xl sm:px-6">
      <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-center" style={{ color: "#FF4D8D" }}>Prize Entry</p>
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
          <span className="mb-2 block text-sm font-semibold" style={{ color: "#1A0A2E" }}>First Name</span>
          <input
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            className="min-h-12 w-full rounded-2xl border border-[#f0d8ea] bg-white px-4 py-3 text-base outline-none transition focus:border-[#FF4D8D] focus:ring-2 focus:ring-[#ffd7e8]"
            required
            maxLength={60}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold" style={{ color: "#1A0A2E" }}>Last Name</span>
          <input
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            className="min-h-12 w-full rounded-2xl border border-[#f0d8ea] bg-white px-4 py-3 text-base outline-none transition focus:border-[#FF4D8D] focus:ring-2 focus:ring-[#ffd7e8]"
            required
            maxLength={60}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold" style={{ color: "#1A0A2E" }}>Phone Number</span>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={form.phoneNumber}
            onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
            className="min-h-12 w-full rounded-2xl border border-[#f0d8ea] bg-white px-4 py-3 text-base outline-none transition focus:border-[#FF4D8D] focus:ring-2 focus:ring-[#ffd7e8]"
            required
            maxLength={25}
          />
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