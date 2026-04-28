"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/* ─── content type — every editable field on the page ───────────── */
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



/* ─── animation helpers ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: i * 0.12 },
  }),
};

const floatVariant = (duration: number, yAmt: number, delay = 0) => ({
  animate: {
    y: [0, -yAmt, 0],
    transition: { duration, repeat: Infinity, ease: "easeInOut" as const, delay },
  },
});

/* ─── decorative icons ───────────────────────────────────────────── */
const Cone = ({ color, size = 44 }: { color: string; size?: number }) => (
  <svg viewBox="0 0 40 58" width={size} height={size * 1.45} xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,54 7,28 33,28" fill="#F5C470" />
    <line x1="20" y1="54" x2="13" y2="31" stroke="#D4A53A" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="20" y1="54" x2="27" y2="31" stroke="#D4A53A" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="8" y1="43" x2="32" y2="43" stroke="#D4A53A" strokeWidth="1" strokeLinecap="round" />
    <line x1="8" y1="37" x2="32" y2="37" stroke="#D4A53A" strokeWidth="1" strokeLinecap="round" />
    <ellipse cx="27" cy="27" rx="3" ry="5" fill={color} />
    <circle cx="20" cy="17" r="13" fill={color} />
    <ellipse cx="15" cy="11" rx="5" ry="4" fill="rgba(255,255,255,0.32)" />
  </svg>
);

const Sparkle = ({ size = 16, color = "#FFB020" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L13.2 9.6 L20 12 L13.2 14.4 L12 22 L10.8 14.4 L4 12 L10.8 9.6 Z" fill={color} />
  </svg>
);

/* ─── platform icons (static, not editable) ──────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.004 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.362.637 4.669 1.844 6.686L2.667 29.333l6.823-1.788A13.274 13.274 0 0016.004 29.333C23.367 29.333 29.333 23.363 29.333 16S23.367 2.667 16.004 2.667zm0 2.428c5.994 0 10.9 4.905 10.9 10.905 0 6-4.906 10.905-10.9 10.905a10.87 10.87 0 01-5.553-1.52l-.398-.236-4.05 1.062 1.08-3.94-.26-.41A10.865 10.865 0 015.1 16c0-6 4.906-10.905 10.904-10.905zm-3.234 5.58c-.197 0-.517.074-.787.37-.27.295-1.03 1.005-1.03 2.45 0 1.444 1.055 2.841 1.203 3.038.147.197 2.062 3.147 5.012 4.41.7.302 1.247.482 1.672.617.703.224 1.343.192 1.848.116.564-.084 1.737-.71 1.982-1.396.245-.685.245-1.273.172-1.396-.074-.123-.27-.197-.565-.344-.295-.148-1.737-.857-2.007-.956-.27-.098-.467-.148-.664.148-.197.295-.762.956-.934 1.153-.172.197-.344.222-.639.074-.295-.148-1.244-.459-2.37-1.462-.875-.782-1.466-1.748-1.638-2.043-.172-.296-.018-.455.13-.602.132-.132.294-.344.442-.516.147-.172.196-.296.295-.493.098-.197.049-.37-.025-.517-.074-.148-.664-1.601-.91-2.191-.24-.575-.484-.497-.664-.505l-.565-.01z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.333 2.667h-4v17.777a3.556 3.556 0 11-3.555-3.555c.327 0 .644.044.944.124V12.89a8 8 0 100 10.554V2.667z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2.667c-3.627 0-4.08.016-5.504.08-1.42.065-2.39.29-3.239.619a6.542 6.542 0 00-2.366 1.524A6.542 6.542 0 003.366 7.256c-.328.849-.553 1.819-.618 3.239C2.683 11.919 2.667 12.372 2.667 16s.016 4.08.08 5.504c.065 1.42.29 2.39.619 3.239a6.542 6.542 0 001.524 2.366 6.542 6.542 0 002.366 1.524c.849.329 1.819.554 3.239.619 1.424.064 1.877.08 5.505.08s4.08-.016 5.504-.08c1.42-.065 2.39-.29 3.239-.619a6.542 6.542 0 002.366-1.524 6.542 6.542 0 001.524-2.366c.329-.849.554-1.819.619-3.239.064-1.424.08-1.877.08-5.504s-.016-4.081-.08-5.505c-.065-1.42-.29-2.39-.619-3.239a6.542 6.542 0 00-1.524-2.366 6.542 6.542 0 00-2.366-1.524c-.849-.328-1.819-.553-3.239-.618-1.424-.065-1.877-.08-5.504-.08zm0 2.4c3.565 0 3.986.013 5.394.078 1.302.059 2.009.277 2.479.46.623.242 1.068.531 1.535.998.467.467.756.912.998 1.535.183.47.4 1.177.46 2.48.065 1.407.078 1.828.078 5.393s-.013 3.985-.078 5.393c-.06 1.302-.277 2.009-.46 2.479a4.14 4.14 0 01-.998 1.535 4.14 4.14 0 01-1.535.998c-.47.183-1.177.401-2.48.46-1.407.065-1.828.078-5.393.078s-3.986-.013-5.394-.078c-1.302-.059-2.009-.277-2.479-.46a4.14 4.14 0 01-1.535-.998 4.14 4.14 0 01-.998-1.535c-.183-.47-.4-1.177-.46-2.48-.065-1.407-.078-1.828-.078-5.392s.013-3.986.078-5.394c.06-1.302.277-2.009.46-2.479a4.14 4.14 0 01.998-1.535 4.14 4.14 0 011.535-.998c.47-.183 1.177-.4 2.48-.46 1.407-.065 1.828-.078 5.393-.078zm0 4.08a6.853 6.853 0 100 13.706A6.853 6.853 0 0016 9.147zm0 11.306a4.453 4.453 0 110-8.906 4.453 4.453 0 010 8.906zm8.74-11.573a1.6 1.6 0 11-3.2 0 1.6 1.6 0 013.2 0z" />
  </svg>
);

/* ─── main page ──────────────────────────────────────────────────── */
export default function Home() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Content request failed");
        }
        return r.json();
      })
      .then((data: PageContent) => setContent(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <main className="min-h-dvh flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fff8f9 0%, #fdf4ff 100%)" }}>
        <p className="text-sm font-semibold" style={{ color: "#8134AF" }}>تعذّر تحميل المحتوى. حاول مجدداً.</p>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="min-h-dvh flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fff8f9 0%, #fdf4ff 100%)" }}>
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#FF4D8D", borderTopColor: "transparent" }} />
      </main>
    );
  }

  const socials = [
    {
      key: "whatsapp",
      label: content.whatsapp_label,
      sub: content.whatsapp_sub,
      href: content.whatsapp_url,
      bg: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
      shadow: "rgba(37,211,102,0.35)",
      icon: <WhatsAppIcon />,
    },
    {
      key: "tiktok",
      label: content.tiktok_label,
      sub: content.tiktok_sub,
      href: content.tiktok_url,
      bg: "linear-gradient(135deg, #010101 0%, #1a1a2e 100%)",
      shadow: "rgba(0,0,0,0.28)",
      icon: <TikTokIcon />,
    },
    {
      key: "instagram",
      label: content.instagram_label,
      sub: content.instagram_sub,
      href: content.instagram_url,
      bg: "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
      shadow: "rgba(221,42,123,0.30)",
      icon: <InstagramIcon />,
    },
  ];

  return (
    <main className="min-h-dvh flex flex-col items-center relative overflow-hidden px-4 pb-12 pt-10">

      {/* Background blobs */}
      <div className="blob" style={{ top: "-100px", left: "-100px", width: "380px", height: "380px", background: "radial-gradient(circle, rgba(255,77,141,0.22) 0%, transparent 70%)" }} />
      <div className="blob" style={{ top: "-60px", right: "-80px", width: "320px", height: "320px", background: "radial-gradient(circle, rgba(129,52,175,0.18) 0%, transparent 70%)" }} />
      <div className="blob" style={{ bottom: "-60px", left: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(0,196,140,0.18) 0%, transparent 70%)" }} />
      <div className="blob" style={{ bottom: "-80px", right: "-60px", width: "340px", height: "340px", background: "radial-gradient(circle, rgba(255,176,32,0.22) 0%, transparent 70%)" }} />
      <div className="blob" style={{ top: "38%", left: "50%", transform: "translateX(-50%)", width: "460px", height: "460px", background: "radial-gradient(circle, rgba(255,160,200,0.12) 0%, transparent 65%)" }} />

      {/* Floating cones */}
      <motion.div className="absolute z-[2]" style={{ top: "5%", left: "1%" }} {...floatVariant(6, 16, 0)}><Cone color="#FF6BA8" size={34} /></motion.div>
      <motion.div className="absolute z-[2]" style={{ top: "8%", right: "1%" }} {...floatVariant(8, 12, 1.2)}><Cone color="#5DD690" size={26} /></motion.div>
      <motion.div className="absolute z-[2]" style={{ top: "36%", left: "0%" }} {...floatVariant(7, 18, 2.4)}><Cone color="#FFBB33" size={24} /></motion.div>
      <motion.div className="absolute z-[2]" style={{ top: "40%", right: "0%" }} {...floatVariant(9, 14, 0.8)}><Cone color="#9B6BDB" size={28} /></motion.div>

      {/* Floating sparkles */}
      <motion.div className="absolute" style={{ top: "14%", left: "9%" }} {...floatVariant(4.5, 10, 0.3)}><Sparkle size={14} color="#FF4D8D" /></motion.div>
      <motion.div className="absolute" style={{ top: "22%", right: "10%" }} {...floatVariant(5.5, 8, 1.1)}><Sparkle size={11} color="#9B6BDB" /></motion.div>
      <motion.div className="absolute" style={{ top: "54%", left: "5%" }} {...floatVariant(6, 12, 2.0)}><Sparkle size={10} color="#00C48C" /></motion.div>
      <motion.div className="absolute" style={{ bottom: "32%", right: "6%" }} {...floatVariant(5, 10, 0.6)}><Sparkle size={13} color="#FFB020" /></motion.div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">

        {/* Logo + title */}
        <motion.div className="flex items-center gap-4 w-full justify-center" custom={0} variants={fadeUp} initial="hidden" animate="show">
          <div className="relative flex-shrink-0" style={{ width: "86px", height: "86px" }}>
            <div className="absolute inset-0 rounded-full spin-slow" style={{ background: "conic-gradient(from 0deg, #FF4D8D, #FFB020, #00C48C, #38BDF8, #8134AF, #FF4D8D)", filter: "blur(4px)", opacity: 0.8 }} />
            <div className="absolute inset-[5px] rounded-full" style={{ background: "linear-gradient(135deg, #fffbf8 0%, #f9f0ff 100%)" }} />
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center" style={{ padding: "5px" }}>
              <Image src="/logo.png" alt="Al Malek Ice Cream" width={76} height={76} className="object-contain rounded-full" priority />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold uppercase" style={{ color: "#FF4D8D", letterSpacing: "0.22em" }}>✦ Since 1991 ✦</p>
            <h1 className="font-black leading-tight" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.7rem, 8vw, 2.2rem)", color: "#1A0A2E", lineHeight: 1.1 }}>Al Malek</h1>
            <p className="font-extrabold text-sm" style={{ background: "linear-gradient(90deg, #FF4D8D 0%, #FFB020 50%, #00C48C 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "0.24em" }}>ICE CREAM</p>
          </div>
        </motion.div>

        {/* Arabic brand line */}
        <motion.p custom={1} variants={fadeUp} initial="hidden" animate="show" className="text-lg font-bold text-center" dir="rtl" style={{ color: "#1A0A2E", fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
          ايس كريم الملك
        </motion.p>

        {/* Divider */}
        <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-2.5 w-full">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,77,141,0.35))" }} />
          {["#FF4D8D","#FFB020","#00C48C","#38BDF8","#8134AF"].map((c, i) => (
            <span key={i} className="rounded-full inline-block" style={{ width: i % 2 === 0 ? "8px" : "6px", height: i % 2 === 0 ? "8px" : "6px", background: c }} />
          ))}
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(129,52,175,0.35), transparent)" }} />
        </motion.div>

        {/* Box 1 — tagline */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="w-full flex flex-col items-center gap-2">
          <div className="w-full rounded-2xl px-5 py-4 text-center" style={{ background: "linear-gradient(135deg, rgba(255,77,141,0.12) 0%, rgba(255,176,32,0.10) 100%)", border: "1.5px solid rgba(255,77,141,0.22)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <p className="font-black tracking-wide" dir="rtl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.1rem, 5vw, 1.3rem)", background: "linear-gradient(90deg, #FF4D8D, #FFB020)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", wordBreak: "break-word" }}>
              {content.tagline}
            </p>
          </div>
          <p className="text-xs font-semibold" dir="rtl" style={{ color: "#3D1A6E", opacity: 0.65 }}>{content.tagline_note}</p>
        </motion.div>

        {/* Box 2 — promo */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="w-full flex flex-col items-center gap-2">
          <div className="w-full rounded-3xl px-6 py-5 text-center" style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1.5px solid rgba(255,255,255,0.95)", boxShadow: "0 8px 48px rgba(129,52,175,0.12), 0 2px 12px rgba(255,77,141,0.08)" }}>
            <p className="font-bold leading-snug" dir="rtl" style={{ fontFamily: '"Segoe UI", Tahoma, Arial, sans-serif', fontSize: "clamp(1.1rem, 5.5vw, 1.35rem)", color: "#1A0A2E", wordBreak: "break-word" }}>
              {content.promo_text}
            </p>
          </div>
          <p className="text-xs font-semibold" dir="rtl" style={{ color: "#8134AF", fontFamily: '"Segoe UI", Tahoma, sans-serif', opacity: 0.75 }}>
            {content.promo_note}
          </p>
        </motion.div>

        {/* Social links */}
        <motion.h2 custom={4} variants={fadeUp} initial="hidden" animate="show" className="text-xs font-bold uppercase tracking-widest text-center mt-2" style={{ color: "#8134AF", letterSpacing: "0.28em" }}>
          Follow &amp; Connect
        </motion.h2>

        <div className="w-full flex flex-col gap-4">
          {socials.map((s, i) => (
            <motion.a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" custom={5 + i} variants={fadeUp} initial="hidden" animate="show" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-white" style={{ background: s.bg, boxShadow: `0 8px 32px ${s.shadow}, 0 2px 8px rgba(0,0,0,0.06)`, textDecoration: "none" }}>
              <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                {s.icon}
              </div>
              <div className="flex-1" style={{ textAlign: "right", direction: "rtl" }}>
                <p className="font-bold text-base leading-tight" style={{ wordBreak: "break-word" }}>{s.label}</p>
                <p className="text-xs mt-0.5 font-medium" style={{ opacity: 0.82, wordBreak: "break-word" }}>{s.sub}</p>
              </div>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="white" style={{ opacity: 0.7, flexShrink: 0 }}>
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.p custom={8} variants={fadeUp} initial="hidden" animate="show" className="text-xs text-center pt-2 pb-1" style={{ color: "#8134AF", opacity: 0.55, letterSpacing: "0.05em" }}>
          Scan to discover more flavours &amp; offers
        </motion.p>

      </div>
    </main>
  );
}