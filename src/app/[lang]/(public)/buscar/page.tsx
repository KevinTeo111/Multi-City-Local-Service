import type { Metadata } from "next";
import { Suspense } from "react";
import { type FilterState, ListingLayout, filterParams } from "@/components/listing-layout";
import { Pagination } from "@/components/listing-parts";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { cityLabel } from "@/lib/localize";
import { AVAILABILITIES } from "@/components/listing-meta";
import { SORTS, extractCity, findCity, getCategory, getGroup, searchBusinesses, toCards } from "@/lib/queries";
import type { Availability, PriceType } from "@/lib/types";

const PRICE_FILTERS: PriceType[] = ["hora", "dia", "fijo"];

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.listing.searchTitle,
    // Search result URLs are not indexed; city/category pages are the SEO landing pages.
    robots: { index: false, follow: true },
  };
}

type SP = Awaited<PageProps<"/[lang]/buscar">["searchParams"]>;

function all(v: string | string[] | undefined) {
  return v === undefined ? [] : Array.isArray(v) ? v : [v];
}

export default function SearchPage({ searchParams }: PageProps<"/[lang]/buscar">) {
  return (
    <Suspense fallback={<div className="container-page py-24" />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { t, lang, href } = await getI18n();

  // "plumber Houston" in the search box also sets the location.
  let q = all(sp.q)[0]?.trim() ?? "";
  let city = findCity(all(sp.ciudad)[0] ?? "");
  if (!city && q) {
    const found = extractCity(q);
    if (found.city) [city, q] = [found.city, found.rest];
  }
  const sort = all(sp.orden).find((s): s is FilterState["sort"] => (SORTS as readonly string[]).includes(s));
  // ?grupo=limpieza-grupo (home tiles) selects every service in the group.
  const grouped = all(sp.grupo).flatMap((g) => getGroup(g)?.categories ?? []);
  const rating = Number(all(sp.calificacion)[0]);
  const filters: FilterState = {
    q: q || undefined,
    city: city?.slug,
    categories: [...new Set([...all(sp.categoria), ...grouped])].filter((c) => getCategory(c)),
    prices: PRICE_FILTERS.filter((p) => all(sp.precio).includes(p)),
    availability: AVAILABILITIES.filter((a): a is Availability => all(sp.disponible).includes(a)),
    minRating: rating >= 1 && rating <= 5 ? Math.round(rating) : undefined,
    verified: all(sp.verificado)[0] === "1",
    sort: sort ?? "recomendados",
  };
  const page = Number(all(sp.pagina)[0]) || 1;
  const result = searchBusinesses({ ...filters, page });

  const base = filterParams(filters);
  const hrefFor = (p: number) => {
    const qs = new URLSearchParams(base);
    if (p > 1) qs.set("pagina", String(p));
    const s = qs.toString();
    return s ? `${href("/buscar")}?${s}` : href("/buscar");
  };

  return (
    <ListingLayout
      title={t.listing.browseServices}
      intro={city ? fmt(t.listing.findIn, { city: cityLabel(city, lang) }) : t.listing.findAll}
      filters={filters}
      cards={toCards(result.items, { lang, t, highlightCity: city?.slug })}
      total={result.total}
      pagination={<Pagination page={result.page} pages={result.pages} hrefFor={hrefFor} />}
    />
  );
}
