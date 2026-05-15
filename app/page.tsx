import HomePageClient from "./HomePageClient";
import { fetchPageContent } from "./lib/content";

export default async function Home() {
  let content;

  try {
    content = await fetchPageContent();
  } catch {
    return (
      <main className="min-h-dvh flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fff8f9 0%, #fdf4ff 100%)" }}>
        <p className="text-sm font-semibold" style={{ color: "#8134AF" }}>تعذّر تحميل المحتوى. حاول مجدداً.</p>
      </main>
    );
  }

  return <HomePageClient content={content} />;
}