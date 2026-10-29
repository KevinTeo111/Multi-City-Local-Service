import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingLayout } from "@/components/listing-layout";
import { fmt, localePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { categorySeoName, cityName } from "@/lib/localize";
import { countByCategory, countByCity, getCategory, listBusinesses, listCategories, listCities, toCards } from "@/lib/queries";

export function generateStaticParams() {
  return listCategories().map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/servicios/[categoria]">): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) return {};
  const { t, lang } = await getI18n();
  const path = `/servicios/${category.slug}`;
  return {
    title: fmt(t.listing.catTitle, { category: categorySeoName(category, lang) }),
    description: fmt(t.listing.metaCat, { category: categorySeoName(category, lang).toLowerCase() }),
    alternates: { canonical: localePath(lang, path), languages: { es: path, en: `/en${path}` } },
    robots: countByCategory(category.slug) === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/servicios/[categoria]">) {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) notFound();
  const { t, lang, href } = await getI18n();

  const results = listBusinesses({ category: category.slug });
  const cities = listCities().filter((c) => countByCity(c.slug, category.slug) > 0);

  return (
    <ListingLayout
      title={fmt(t.listing.catTitle, { category: categorySeoName(category, lang) })}
      intro={t.listing.findAll}
      filters={{ categories: [category.slug], sort: "recomendados" }}
      cards={toCards(results, { lang, t })}
      total={results.length}
      footer={
        cities.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-ink-900">{t.home.byCity}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link key={c.slug} href={href(`/${c.slug}/${category.slug}`)} className="btn-ghost h-9 px-3.5 text-[13px] font-medium">
                  {cityName(c, lang)}
                </Link>
              ))}
            </div>
          </div>
        )
      }
    />
  );
}
