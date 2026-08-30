import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "CineMood — Find Your Perfect Movie or Series",
    template: "%s — CineMood",
  },
  description: "Answer a few mood-based questions and CineMood matches you with movies and TV series worth your evening.",
  openGraph: {
    title: "CineMood — Find Your Perfect Movie or Series",
    description: "Mood-first movie and TV discovery. Tell CineMood how you feel, get matched instantly.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-ink font-sans text-paper antialiased">
        <Navbar />
        <main className="min-h-screen pt-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
