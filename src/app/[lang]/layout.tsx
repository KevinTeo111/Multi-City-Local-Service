import type { Metadata } from "next";
import localFont from "next/font/local";
import { locales } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { site } from "@/lib/site";
import "../globals.css";

// Bundled variable font (no network needed at build time).
const geist = localFont({ src: "../fonts/geist-latin.woff2", weight: "100 900", variable: "--font-geist", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `nearby · ${t.meta.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: t.meta.description,
    openGraph: { siteName: site.name, locale: t.meta.ogLocale, type: "website" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { lang } = await getI18n();
  return (
    <html lang={lang} className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
