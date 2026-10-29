import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingLayout } from "@/components/listing-layout";
import { fmt, localePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { categorySeoName, cityLabel, cityName } from "@/lib/localize";
import { countByCity, getCategory, getCity, listBusinesses, listCategories, listCities, toCards } from "@/lib/queries";
import { jsonLdScript, site } from "@/lib/site";

export function generateStaticParams() {
  return listCities().flatMap((city) => listCategories().map((cat) => ({ ciudad: city.slug, categoria: cat.slug })));
}

async function resolve(params: PageProps<"/[lang]/[ciudad]/[categoria]">["params"]) {
  const { ciudad, categoria } = await params;
  return { city: getCity(ciudad), category: getCategory(categoria) };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[ciudad]/[categoria]">): Promise<Metadata> {
  const { city, category } = await resolve(params);
  if (!city || !category) return {};
  const { t, lang } = await getI18n();
  const count = countByCity(city.slug, category.slug);
  const path = `/${city.slug}/${category.slug}`;
  return {
    // Matches how people search: "Plomeros en Houston, TX" / "Plumbers in Houston, TX"
    title: fmt(t.listing.catCityTitle, { category: categorySeoName(category, lang), city: cityLabel(city, lang) }),
    description: fmt(t.listing.metaCatCity, { n: count, category: categorySeoName(category, lang).toLowerCase(), city: cityName(city, lang) }),
    alternates: { canonical: localePath(lang, path), languages: { es: path, en: `/en${path}` } },
    robots: count === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function CityCategoryPage({ params }: PageProps<"/[lang]/[ciudad]/[categoria]">) {
  const { city, category } = await resolve(params);
  if (!city || !category) notFound();
  const { t, lang, href } = await getI18n();

  const results = listBusinesses({ city: city.slug, category: category.slug });
  const otherCities = listCities().filter((c) => c.slug !== city.slug && countByCity(c.slug, category.slug) > 0);
  const title = fmt(t.listing.catCityTitle, { category: categorySeoName(category, lang), city: cityLabel(city, lang) });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: results.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}${localePath(lang, `/negocio/${b.slug}`)}`,
      name: b.name,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      <ListingLayout
        title={title}
        intro={fmt(t.listing.findIn, { city: cityName(city, lang) })}
        filters={{ city: city.slug, categories: [category.slug], sort: "recomendados" }}
        cards={toCards(results, { lang, t, highlightCity: city.slug })}
        total={results.length}
        footer={
          otherCities.length > 0 && (
            <div className="mt-12">
              <h2 className="text-sm font-semibold text-ink-900">{fmt(t.listing.inOtherCities, { category: categorySeoName(category, lang) })}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {otherCities.map((c) => (
                  <Link key={c.slug} href={href(`/${c.slug}/${category.slug}`)} className="btn-ghost h-9 px-3.5 text-[13px] font-medium">
                    {cityName(c, lang)}
                  </Link>
                ))}
              </div>
            </div>
          )
        }
      />
    </>
  );
}
