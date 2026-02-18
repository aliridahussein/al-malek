export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-800
 px-6">
      <div className="w-full max-w-md text-center space-y-8">

        {/* Logo */}
        <img
          src="/logo.png"
          alt="Al Malek Ice Cream Logo"
          className="mx-auto w-48 h-48 object-contain"
        />

        {/* Title */}
        <h1 className="text-2xl font-semibold text-white leading-relaxed">
          Al Malek Ice Cream | ايس كريم الملك 🍦
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-300 text-lg">
          Frozen Ice Cream Since 1998
        </p>

        {/* Arabic Quote */}
        <p className="text-neutral-200 text-xl font-medium">
          “خلّيها تذوب… وخلي همّك يذوب معها”
        </p>

        {/* WhatsApp Button */}
        <a
          href="https://chat.whatsapp.com/FQJn1YhHFKy9jRzZWNOE3B?mode=gi_t"
          target="_blank"
          className="block w-full rounded-2xl bg-green-500 py-4 text-white text-lg font-semibold shadow-lg active:scale-95 transition-transform"
        >
          Join WhatsApp Community
        </a>

      </div>
    </main>
  );
}
