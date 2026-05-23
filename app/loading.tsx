export default function Loading() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#f0d8ea] border-t-[#FF4D8D]" />
        <p className="text-sm font-semibold" dir="rtl" style={{ color: "#3D1A6E" }}>
          جاري التحميل...
        </p>
      </div>
    </main>
  );
}
