import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageIntro } from "@/components/page-intro";
import { fmt, localePath, plural } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { cityName } from "@/lib/localize";
import { countByCity, listCities } from "@/lib/queries";

const STATES: Record<string, string> = { TX: "Texas", FL: "Florida", CA: "California", IL: "Illinois", NY: "New York", AZ: "Arizona" };

export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getI18n();
  return {
    title: t.listing.allCitiesTitle,
    description: t.listing.allCitiesIntro,
    alternates: { canonical: localePath(lang, "/ciudades"), languages: { es: "/ciudades", en: "/en/ciudades" } },
  };
}

export default async function CitiesPage() {
  const { t, lang, href } = await getI18n();
  return (
    <div className="container-page pt-14">
      <PageIntro eyebrow={t.listing.citiesEyebrow} title={t.listing.allCitiesTitle} text={t.listing.allCitiesIntro} />
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {listCities().map((c, i) => (
          <li key={c.slug} className="animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
            <Link
              href={href(`/${c.slug}`)}
              className="card-link group flex items-center gap-7 bg-gradient-to-br from-ink-50 to-white px-9 py-10"
            >
              <span className="font-display text-4xl font-medium tabular-nums text-brand-200 transition group-hover:text-brand-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="eyebrow block">{STATES[c.state] ?? c.state}</span>
                <span className="mt-1.5 block font-display text-[1.7rem] font-bold tracking-tight text-ink-900">{cityName(c, lang)}</span>
                <span className="mt-2 block text-xs text-ink-500">
                  {fmt(t.listing.cityCardText, { n: plural(countByCity(c.slug), t.common.businesses) })}
                </span>
              </span>
              <ArrowUpRight aria-hidden className="size-6 text-brand-500 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
      <CtaBand title={t.listing.citiesCtaTitle} text={t.listing.citiesCtaText} href={href("/registro")} label={t.home.ctaButton} variant="outline" />
    </div>
  );
}
