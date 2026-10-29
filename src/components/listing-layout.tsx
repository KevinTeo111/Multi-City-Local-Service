import { X } from "lucide-react";
import Link from "next/link";
import { fmt, plural } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { type CardData, categoryName, cityLabel, groupName } from "@/lib/localize";
import { SORTS, type Sort, getCategory, getCity, listCategoryGroups } from "@/lib/queries";
import type { Availability, PriceType } from "@/lib/types";
import { BrowseFilters } from "./browse-filters";
import { BusinessCard, cardLabels } from "./business-card";
import { EmptyResults } from "./listing-parts";
import { locationProps } from "./search-bar";
import { SortSelect } from "./sort-select";

export type FilterState = {
  q?: string;
  city?: string;
  categories: string[];
  prices?: PriceType[];
  availability?: Availability[];
  minRating?: number;
  verified?: boolean;
  sort: Sort;
};

/** Query-string pairs for a filter state (shared by filters, chips, sort and pagination). */
export function filterParams(f: FilterState): [string, string][] {
  const pairs: [string, string][] = [];
  if (f.q) pairs.push(["q", f.q]);
  if (f.city) pairs.push(["ciudad", f.city]);
  for (const c of f.categories) pairs.push(["categoria", c]);
  for (const p of f.prices ?? []) pairs.push(["precio", p]);
  for (const a of f.availability ?? []) pairs.push(["disponible", a]);
  if (f.minRating) pairs.push(["calificacion", String(f.minRating)]);
  if (f.verified) pairs.push(["verificado", "1"]);
  if (f.sort !== "recomendados") pairs.push(["orden", f.sort]);
  return pairs;
}

/**
 * Results page: title, filter sidebar on the left, active filter chips, count +
 * sort, and the cards. SEO pages render it statically; any change goes to /buscar.
 */
export async function ListingLayout({
  title,
  intro,
  filters,
  cards,
  total,
  pagination,
  footer,
}: {
  title: string;
  intro?: string;
  filters: FilterState;
  cards: CardData[];
  total: number;
  pagination?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { t, lang, href } = await getI18n();
  const action = href("/buscar");
  const urlFor = (f: FilterState) => {
    const qs = new URLSearchParams(filterParams(f)).toString();
    return qs ? `${action}?${qs}` : action;
  };
  const without = (patch: Partial<FilterState>) => urlFor({ ...filters, ...patch });
  const groups = listCategoryGroups();

  // A fully selected group shows as one chip ("Cleaning ×") instead of one per service.
  const whole = groups.filter((g) => g.items.every((c) => filters.categories.includes(c.slug)));
  const inWhole = new Set(whole.flatMap((g) => g.categories));
  const city = filters.city ? getCity(filters.city) : undefined;
  const chips = [
    ...(filters.q ? [{ key: "q", label: `“${filters.q}”`, href: without({ q: undefined }) }] : []),
    ...(city ? [{ key: "city", label: cityLabel(city, lang), href: without({ city: undefined }) }] : []),
    ...whole.map((g) => ({ key: g.slug, label: groupName(g, lang), href: without({ categories: filters.categories.filter((c) => !g.categories.includes(c)) }) })),
    ...filters.categories
      .filter((slug) => !inWhole.has(slug))
      .flatMap((slug) => {
        const c = getCategory(slug);
        return c ? [{ key: slug, label: categoryName(c, lang), href: without({ categories: filters.categories.filter((x) => x !== slug) }) }] : [];
      }),
    ...(filters.prices ?? []).map((p) => ({ key: p, label: t.pricing[p], href: without({ prices: filters.prices?.filter((x) => x !== p) }) })),
    ...(filters.availability ?? []).map((a) => ({ key: a, label: t.availability[a], href: without({ availability: filters.availability?.filter((x) => x !== a) }) })),
    ...(filters.minRating ? [{ key: "rating", label: fmt(t.filters.ratingOption, { n: filters.minRating }), href: without({ minRating: undefined }) }] : []),
    ...(filters.verified ? [{ key: "verified", label: t.filters.verifiedOnly, href: without({ verified: undefined }) }] : []),
  ];

  return (
    <div className="container-page pt-10">
      <div className="animate-rise">
        <h1 className="page-title">{title}</h1>
        {intro && <p className="mt-2 max-w-2xl text-sm text-ink-500">{intro}</p>}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside
          aria-label={t.filters.filters}
          className="animate-rise [animation-delay:60ms] lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pb-4 lg:pr-1"
        >
          <BrowseFilters
            // Remount when the URL changes so the controls match after a chip is removed.
            key={filterParams(filters).join("|")}
            action={action}
            q={filters.q}
            city={city ? cityLabel(city, lang) : undefined}
            sort={filters.sort !== "recomendados" ? filters.sort : undefined}
            selected={filters.categories}
            prices={filters.prices ?? []}
            availability={filters.availability ?? []}
            minRating={filters.minRating ?? 0}
            verified={Boolean(filters.verified)}
            groups={groups.map((g) => ({ slug: g.slug, name: groupName(g, lang), items: g.items.map((c) => ({ slug: c.slug, name: categoryName(c, lang) })) }))}
            location={locationProps(lang, t)}
            labels={{
              filters: t.filters.filters,
              search: t.filters.search,
              example: t.filters.example,
              examples: t.filters.examples,
              location: t.filters.location,
              locationPh: t.filters.locationPh,
              allServices: t.filters.allServices,
              price: t.filters.price,
              priceTypes: t.filters.priceTypes,
              availability: t.filters.availability,
              availabilityTypes: t.availability,
              rating: t.filters.rating,
              ratingOption: t.filters.ratingOption,
              verifiedOnly: t.filters.verifiedOnly,
              apply: t.filters.apply,
            }}
          />
        </aside>

        <section aria-label={title}>
          {chips.length > 0 && (
            <ul className="mb-3 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <li key={c.key} className="animate-rise">
                  <Link
                    href={c.href}
                    scroll={false}
                    aria-label={fmt(t.filters.remove, { name: c.label })}
                    className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-medium text-ink-700 transition-colors hover:border-ink-300 hover:bg-ink-100"
                  >
                    {c.label} <X aria-hidden className="size-3" />
                  </Link>
                </li>
              ))}
              {chips.length > 1 && (
                <li>
                  <Link href={action} scroll={false} className="text-xs text-brand-600 hover:underline">
                    {t.filters.clearAll}
                  </Link>
                </li>
              )}
            </ul>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-600" role="status">
              {plural(total, t.filters.results)} <span className="text-xs text-ink-400">· {t.common.designNote}</span>
            </p>
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <span aria-hidden>{t.filters.sortBy}:</span>
              <SortSelect
                label={t.filters.sortBy}
                value={filters.sort}
                options={SORTS.map((s) => ({ value: s, label: t.filters.sort[s] }))}
                action={action}
                params={filterParams(filters)}
              />
            </div>
          </div>

          {cards.length === 0 ? (
            <EmptyResults />
          ) : (
            <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((c, i) => (
                <div key={c.slug} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                  <BusinessCard card={c} labels={cardLabels(t)} />
                </div>
              ))}
            </div>
          )}
          {pagination}
          {footer}
        </section>
      </div>
    </div>
  );
}
