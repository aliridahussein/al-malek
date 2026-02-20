export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-8 relative overflow-hidden">
      {/* Decorative Ice Cream Icons - Top Left */}
      <div className="absolute top-8 left-8 text-4xl animate-pulse" style={{ animationDelay: '0s' }}>
        🍦
      </div>

      {/* Decorative Ice Cream Icons - Top Right */}
      <div className="absolute top-12 right-8 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>
        🍨
      </div>

      {/* Decorative Scoops - Bottom Left */}
      <div className="absolute bottom-16 left-6 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>
        🍧
      </div>

      {/* Decorative Scoops - Bottom Right */}
      <div className="absolute bottom-20 right-6 text-2xl animate-pulse" style={{ animationDelay: '1.5s' }}>
        🍦
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-md text-center space-y-6 relative z-10">
        <div className="animate-float">
          <img
            src="/logo.png"
            alt="Al Malek Ice Cream Logo"
            className="mx-auto w-48 h-48 object-contain drop-shadow-lg"
          />
        </div>

        {/* Title - Clear and Bold */}
        <h1 className="text-3xl font-bold leading-relaxed animate-fade-in-up delay-1 text-[#2D1B14]">
          Al Malek Ice Cream<br /> ايس كريم الملك 🍦
        </h1>

        {/* Subtitle */}
        <p className="text-lg font-semibold text-[#5C3D2E] animate-fade-in-up delay-2">
          Frozen Ice Cream Since 1998
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-2 animate-fade-in-up delay-2">
          <div className="h-1 w-8 rounded-full" style={{ background: 'linear-gradient(90deg, #FFB6D9, transparent)' }}></div>
          <span className="text-2xl">✨</span>
          <div className="h-1 w-8 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #B8F3E6)' }}></div>
        </div>

        {/* Arabic Quote - Premium styling */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl px-6 py-5 shadow-lg border border-white/20 animate-fade-in-up delay-3">
          <p className="text-xl font-bold text-[#2D1B14] leading-relaxed">
            "خلّيها تذوب… وخلي همّك يذوب معها"
          </p>
        </div>

        {/* WhatsApp Button - Premium gradient */}
        <a
          href="https://chat.whatsapp.com/FQJn1YhHFKy9jRzZWNOE3B?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-3xl py-4 px-6 text-white text-lg font-bold shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 animate-fade-in-up delay-4 cursor-pointer flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #FFB6D9 0%, #B8F3E6 100%)',
            boxShadow: '0 10px 25px rgba(255, 182, 217, 0.4)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Join WhatsApp Community
        </a>

        {/* Bonus Text */}
        <p className="text-sm text-[#5C3D2E] font-medium animate-fade-in-up delay-4">
          كن جزءاً من عائلتنا الحلوة! 💚
        </p>

      </div>
    </main>
  );
}
