export default function PrizeEntryLoading() {
  return (
    <main className="min-h-dvh px-4 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="h-10 w-32 rounded-full bg-white/70 shadow-[0_10px_30px_rgba(129,52,175,0.10)]" />

        <div className="w-full rounded-[32px] bg-white/84 px-5 py-8 text-center shadow-[0_22px_72px_rgba(129,52,175,0.14)] backdrop-blur-xl sm:px-6">
          <div className="mx-auto h-5 w-36 rounded-full bg-[#ffd7e8]" />
          <div className="mx-auto mt-6 h-14 w-14 animate-spin rounded-full border-4 border-[#f0d8ea] border-t-[#FF4D8D]" />
          <p className="mt-6 text-sm font-semibold" dir="rtl" style={{ color: "#3D1A6E" }}>
            جاري تجهيز النموذج...
          </p>
        </div>
      </div>
    </main>
  );
}
