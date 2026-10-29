import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingLayout } from "@/components/listing-layout";
import { fmt, localePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { cityLabel, cityName } from "@/lib/localize";
import { countByCity, getCity, listBusinesses, listCities, toCards } from "@/lib/queries";

export function generateStaticParams() {
  return listCities().map((c) => ({ ciudad: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[ciudad]">): Promise<Metadata> {
  const { ciudad } = await params;
  const city = getCity(ciudad);
  if (!city) return {};
  const { t, lang } = await getI18n();
  const count = countByCity(city.slug);
  const path = `/${city.slug}`;
  return {
    title: fmt(t.listing.cityTitle, { city: cityLabel(city, lang) }),
    description: fmt(t.listing.metaCity, { n: count, city: cityName(city, lang) }),
    alternates: { canonical: localePath(lang, path), languages: { es: path, en: `/en${path}` } },
    // A city with no approved listings stays out of Google until it has content.
    robots: count === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function CityPage({ params }: PageProps<"/[lang]/[ciudad]">) {
  const { ciudad } = await params;
  const city = getCity(ciudad);
  if (!city) notFound();
  const { t, lang } = await getI18n();
  const results = listBusinesses({ city: city.slug });

  return (
    <ListingLayout
      title={fmt(t.listing.cityTitle, { city: cityLabel(city, lang) })}
      intro={fmt(t.listing.findIn, { city: cityName(city, lang) })}
      filters={{ city: city.slug, categories: [], sort: "recomendados" }}
      cards={toCards(results, { lang, t, highlightCity: city.slug })}
      total={results.length}
    />
  );
}
