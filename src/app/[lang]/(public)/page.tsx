import { ArrowRight, MapPin, PhoneCall, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BusinessCard, cardLabels } from "@/components/business-card";
import { CategoryIcon, toneTile } from "@/components/category-icon";
import { SearchBar } from "@/components/search-bar";
import { fmt, localePath, plural } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { cityLabel, cityName, groupName } from "@/lib/localize";
import { countByCity, countByGroup, featuredBusinesses, getCity, listCategoryGroups, listCities, toCards } from "@/lib/queries";
import { jsonLdScript, site } from "@/lib/site";

const HOME_CITY = "austin";
const STEP_ICONS = [MapPin, Users, PhoneCall];

export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getI18n();
  return {
    title: { absolute: t.home.metaTitle },
    alternates: { canonical: localePath(lang, "/"), languages: { es: "/", en: "/en" } },
  };
}

export default async function HomePage() {
  const { t, lang, href } = await getI18n();
  const homeCity = getCity(HOME_CITY);
  const featured = toCards(featuredBusinesses(3), { lang, t, highlightCity: HOME_CITY });
  const cities = listCities().filter((c) => countByCity(c.slug) > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: `${site.url}${localePath(lang, "/")}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}${localePath(lang, "/buscar")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50/80 to-transparent px-5 pb-16 pt-16 text-center sm:pt-20">
        <h1 className="mx-auto max-w-3xl animate-rise font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
          {t.home.heroA}
          <br />
          <span className="text-brand-500">{t.home.heroB}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl animate-rise text-base text-ink-500 [animation-delay:80ms] sm:text-lg">{t.home.heroText}</p>
        <div className="mx-auto mt-8 max-w-3xl animate-rise text-left [animation-delay:160ms]">
          <SearchBar defaultCity={homeCity ? cityLabel(homeCity, lang) : ""} />
        </div>
      </section>

      <div className="container-page">
        {/* Services */}
        <section className="reveal mt-6">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-ink-900">{t.home.helpTitle}</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {listCategoryGroups().map((g) => (
              <li key={g.slug}>
                <Link href={`${href("/buscar")}?grupo=${g.slug}`} className="card-link group flex h-full flex-col items-center gap-2.5 p-5 text-center">
                  <span className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${toneTile(g.tone)}`}>
                    <CategoryIcon name={g.icon} className="size-5" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-medium text-ink-900">{groupName(g, lang)}</span>
                  <span className="text-xs text-ink-500">{plural(countByGroup(g.slug), t.home.profiles)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Professionals */}
        <section className="reveal mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">{t.home.prosTitle}</h2>
              {homeCity && <p className="mt-1.5 text-sm text-ink-500">{fmt(t.listing.findIn, { city: cityName(homeCity, lang) })}</p>}
            </div>
            <Link href={`${href("/buscar")}?ciudad=${HOME_CITY}`} className="link-arrow">
              {t.home.browseAll} <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <BusinessCard key={c.slug} card={c} labels={cardLabels(t)} />
            ))}
          </div>
          <p className="mt-3 text-[11px] text-ink-400">{t.common.designNote}</p>
        </section>

        {/* How it works */}
        <section className="reveal mt-20 border-t border-ink-200/70 pt-16">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-ink-900">{t.nav.howItWorks}</h2>
          <ol className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-3">
            {t.how.steps.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li key={s.title} className="relative flex items-start gap-5 sm:flex-col sm:items-center sm:gap-3 sm:text-center">
                  {i > 0 && (
                    // Thin arrow from the previous step's icon to this one.
                    <span aria-hidden className="absolute right-[calc(50%+2.5rem)] top-7 hidden w-[calc(100%-3rem)] sm:block">
                      <span className="block h-px w-full bg-ink-200" />
                      <span className="absolute -right-0.5 -top-[3px] size-[7px] rotate-45 border-r border-t border-ink-300" />
                    </span>
                  )}
                  <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon aria-hidden className="size-6" />
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </span>
                  <span className="sm:max-w-56">
                    <span className="block font-medium text-ink-900">{s.title}</span>
                    <span className="mt-1 block text-sm text-ink-500">{s.text}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Cities */}
        <section className="reveal mt-20 text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{t.home.byCity}</h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={href(`/${c.slug}`)} className="btn-ghost group h-9 px-3.5 font-normal">
                  <MapPin aria-hidden className="size-3.5 text-ink-400 transition-colors group-hover:text-brand-500" />
                  {cityName(c, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* For businesses */}
      <section className="reveal mt-20 bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-14 text-center text-white sm:py-16">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t.home.ctaTitle}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">{t.home.ctaText}</p>
        <Link href={href("/registro")} className="btn group mt-8 h-10 bg-white px-5 text-brand-600 hover:bg-brand-50">
          {t.home.ctaButton} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <p className="mt-4 text-sm text-white/75">{t.home.ctaNote}</p>
      </section>
    </>
  );
}
