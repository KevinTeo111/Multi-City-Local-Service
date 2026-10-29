import "server-only";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import { businesses, categories, categoryGroups, cities } from "./data";
import { toCardData } from "./localize";
import type { Availability, Business, PriceType, PublicBusiness } from "./types";

// Data-access layer. Every page reads through these functions, so swapping the
// sample data for Supabase queries only touches this file.

export const PAGE_SIZE = 12;

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function maskPhone(phone: string) {
  const area = phone.match(/\(\d{3}\)/)?.[0] ?? "";
  return `${area} •••-••••`;
}

export function toPublic(b: Business): PublicBusiness {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { phone, whatsapp, stats, ...rest } = b;
  return { ...rest, phoneMasked: maskPhone(phone), hasWhatsapp: Boolean(whatsapp) };
}

export function listCities() {
  return cities.filter((c) => c.active);
}

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug && c.active);
}

/** City from a slug or typed text ("houston", "Houston, TX", "Nueva York"). */
export function findCity(text: string) {
  const key = normalize(text.split(",")[0]);
  if (!key) return undefined;
  return listCities().find((c) => c.slug === key || normalize(c.name) === key || normalize(c.nameEn ?? "") === key);
}

export function listCategories() {
  return categories.filter((c) => c.active);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug && c.active);
}

/**
 * Splits a city out of free text: "plumber Houston" -> Houston + "plumber".
 * Lets people type the place in the search box, as on poslici.
 */
export function extractCity(q: string) {
  const text = ` ${normalize(q)} `;
  for (const c of listCities()) {
    for (const name of [c.name, c.nameEn, c.slug.replace(/-/g, " ")]) {
      const key = name && ` ${normalize(name)} `;
      if (key && text.includes(key)) return { city: c, rest: text.replace(key, " ").replace(/\s+/g, " ").trim() };
    }
  }
  return { city: undefined, rest: q };
}

export function getGroup(slug: string) {
  return categoryGroups.find((g) => g.slug === slug);
}

/** The group a category belongs to (for its tag color). */
export function groupOf(categorySlug: string) {
  return categoryGroups.find((g) => g.categories.includes(categorySlug));
}

/** Sidebar groups, each with its active categories. */
export function listCategoryGroups() {
  return categoryGroups
    .map((g) => ({ ...g, items: g.categories.map(getCategory).filter((c) => c !== undefined) }))
    .filter((g) => g.items.length > 0);
}

function approved() {
  return businesses.filter((b) => b.status === "aprobado");
}

export const SORTS = ["recomendados", "calificacion", "recientes", "nombre"] as const;
export type Sort = (typeof SORTS)[number];

function rank(a: Business, b: Business) {
  if (a.plan !== b.plan) return a.plan === "destacado" ? -1 : 1;
  if (Boolean(a.verified) !== Boolean(b.verified)) return a.verified ? -1 : 1;
  return b.rating - a.rating || b.reviewCount - a.reviewCount;
}

const sorters: Record<Sort, (a: Business, b: Business) => number> = {
  recomendados: rank,
  calificacion: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  recientes: (a, b) => b.createdAt.localeCompare(a.createdAt),
  nombre: (a, b) => a.name.localeCompare(b.name, "es"),
};

// Matches Spanish and English text, so "plumber" and "plomero" both work.
function haystack(b: Business) {
  const categoryNames = b.categories.map((slug) => {
    const c = getCategory(slug);
    const g = groupOf(slug);
    return c ? [c.name, c.seoName, c.nameEn, c.seoNameEn, g?.name, g?.nameEn].filter(Boolean).join(" ") : "";
  });
  const en = b.en ? [b.en.tagline ?? "", b.en.description ?? "", ...(b.en.services ?? [])] : [];
  return normalize([b.name, b.tagline, b.description, ...b.services, ...en, ...categoryNames].join(" "));
}

export type SearchInput = {
  q?: string;
  city?: string;
  categories?: string[];
  prices?: PriceType[];
  availability?: Availability[];
  minRating?: number;
  verified?: boolean;
  sort?: Sort;
  page?: number;
};

export function searchBusinesses({ q, city, categories, prices, availability, minRating, verified, sort = "recomendados", page = 1 }: SearchInput) {
  const words = q ? normalize(q).split(/\s+/).filter(Boolean) : [];
  const matches = approved()
    .filter((b) => !city || b.cities.includes(city))
    .filter((b) => !categories?.length || categories.some((c) => b.categories.includes(c)))
    .filter((b) => !prices?.length || prices.includes(b.priceType))
    .filter((b) => !availability?.length || (b.availability !== undefined && availability.includes(b.availability)))
    .filter((b) => !minRating || (b.reviewCount > 0 && b.rating >= minRating))
    .filter((b) => !verified || b.verified)
    .filter((b) => {
      if (words.length === 0) return true;
      const text = haystack(b);
      // Loose plural handling: "plumbers" still finds "plumber".
      return words.every((w) => text.includes(w) || (w.length > 4 && text.includes(w.replace(/e?s$/, ""))));
    })
    .sort(sorters[sort]);

  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const items = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map(toPublic);
  return { items, total: matches.length, page: current, pages };
}

/** All approved listings for a city and/or category (SEO landing pages). */
export function listBusinesses({ city, category }: { city?: string; category?: string }) {
  return approved()
    .filter((b) => (!city || b.cities.includes(city)) && (!category || b.categories.includes(category)))
    .sort(rank)
    .map(toPublic);
}

export function featuredBusinesses(limit = 6) {
  return approved().sort(rank).slice(0, limit).map(toPublic);
}

export function getPublicBusiness(slug: string) {
  const b = approved().find((x) => x.slug === slug);
  return b ? toPublic(b) : undefined;
}

export function getPublicBusinesses(slugs: string[]) {
  return slugs.map(getPublicBusiness).filter((b) => b !== undefined);
}

/** Other listings in the same city, same category first ("related professionals"). */
export function relatedBusinesses(b: PublicBusiness, limit = 3) {
  const shares = (x: Business) => Number(x.categories.some((c) => b.categories.includes(c)));
  return approved()
    .filter((x) => x.id !== b.id && x.cities.includes(b.baseCity))
    .sort((x, y) => shares(y) - shares(x) || rank(x, y))
    .slice(0, limit)
    .map(toPublic);
}

export function listApprovedSlugs() {
  return approved().map((b) => b.slug);
}

export function countByCity(citySlug: string, categorySlug?: string) {
  return approved().filter(
    (b) => b.cities.includes(citySlug) && (!categorySlug || b.categories.includes(categorySlug)),
  ).length;
}

export function countByGroup(groupSlug: string) {
  const g = getGroup(groupSlug);
  return g ? approved().filter((b) => b.categories.some((c) => g.categories.includes(c))).length : 0;
}

export function countByCategory(categorySlug: string) {
  return approved().filter((b) => b.categories.includes(categorySlug)).length;
}

/** City + category pairs that have at least one approved listing (for SEO pages). */
export function populatedCityCategoryPairs() {
  return listCities().flatMap((city) =>
    listCategories()
      .filter((cat) => countByCity(city.slug, cat.slug) > 0)
      .map((cat) => ({ ciudad: city.slug, categoria: cat.slug })),
  );
}

/** Translated card view models for a list of listings. */
export function toCards(items: PublicBusiness[], ctx: { lang: Locale; t: Dictionary; highlightCity?: string }) {
  return items.map((b) => toCardData(b, { ...ctx, cityOf: getCity, categoryOf: getCategory, groupOf }));
}

// ---- Private (owner / admin) ----

export function getContact(slug: string) {
  const b = approved().find((x) => x.slug === slug);
  return b ? { phone: b.phone, whatsapp: b.whatsapp } : undefined;
}

export function listAllBusinesses() {
  return [...businesses].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBusinessById(id: string) {
  return businesses.find((b) => b.id === id);
}

/** The business that belongs to the signed-in demo account. */
export function getOwnBusiness() {
  return businesses.find((b) => b.slug === "brightside-electrical") ?? businesses[0];
}
