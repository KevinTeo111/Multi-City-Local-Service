import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import "./globals.css";

// Bundled variable font (no network needed at build time).
const geist = localFont({ src: "./fonts/geist-latin.woff2", weight: "100 900", variable: "--font-geist", display: "swap" });

export const metadata: Metadata = { title: "404", robots: { index: false } };

// Shown for URLs that match no route at all. The language is unknown here,
// so the message is bilingual.
export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-24 text-center font-sans">
        <Link href="/" aria-label="nearby.">
          <BrandWordmark />
        </Link>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-900">{es.notFound.title}</h1>
        <p className="text-ink-500" lang="en">{en.notFound.title}</p>
        <div className="mt-4 flex gap-2">
          <Link href="/" className="btn-primary">{es.notFound.home}</Link>
          <Link href="/en" className="btn-outline" lang="en">{en.notFound.home}</Link>
        </div>
      </body>
    </html>
  );
}
