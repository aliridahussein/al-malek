import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Al Malek Ice Cream | ايس كريم الملك 🍦",
  description: "Premium ice cream since 1991 — خلّيها تذوب… وخلي همّك يذوب معها",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="ltr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
