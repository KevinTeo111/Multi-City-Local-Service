import { type Locale, fmt, intlLocale, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import type { Availability, Category, CategoryGroup, CategoryIcon, City, PublicBusiness, Tone } from "./types";

// Pure helpers (no server-only imports) so client components can use them too.

export function categoryName(c: Category, lang: Locale) {
  return lang === "en" ? c.nameEn : c.name;
}

export function categorySeoName(c: Category, lang: Locale) {
  return (lang === "en" ? c.seoNameEn : c.seoName) ?? categoryName(c, lang);
}

export function groupName(g: CategoryGroup, lang: Locale) {
  return lang === "en" ? g.nameEn : g.name;
}

export function cityName(c: City, lang: Locale) {
  return lang === "en" ? (c.nameEn ?? c.name) : c.name;
}

export function cityLabel(c: City, lang: Locale) {
  return `${cityName(c, lang)}, ${c.state}`;
}

/** Swaps in the English text of a listing when there is one. */
export function localizeBusiness<T extends PublicBusiness>(b: T, lang: Locale): T {
  if (lang !== "en" || !b.en) return b;
  return {
    ...b,
    tagline: b.en.tagline || b.tagline,
    description: b.en.description ?? b.description,
    services: b.en.services?.length ? b.en.services : b.services,
    priceNote: b.en.priceNote || b.priceNote,
    highlights: b.en.highlights ?? b.highlights,
  };
}

/** "$45 / hour", "$450 / day", "From $120 per visit", "By agreement"… */
export function priceLabel(b: Pick<PublicBusiness, "priceType" | "price" | "priceNote">, pricing: Dictionary["pricing"]) {
  const amount = b.price !== undefined ? `$${b.price}` : "";
  if (b.priceType === "hora" && amount) return fmt(pricing.hourly, { price: amount });
  if (b.priceType === "dia" && amount) return fmt(pricing.daily, { price: amount });
  if (b.priceType === "fijo") return b.priceNote || amount || pricing.fijo;
  return pricing[b.priceType];
}

export function memberSince(isoDate: string, lang: Locale, template: string) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  const date = d.toLocaleDateString(intlLocale[lang], { month: "short", year: "numeric", timeZone: "UTC" });
  return fmt(template, { date: date.replace(".", "") });
}

/** A service tag: the service name and icon, in its group's color. */
export type ServiceTag = { label: string; icon: CategoryIcon; tone: Tone };

export function serviceTags(
  slugs: string[],
  lang: Locale,
  categoryOf: (slug: string) => Category | undefined,
  groupOf: (slug: string) => CategoryGroup | undefined,
): ServiceTag[] {
  return slugs.flatMap((slug) => {
    const c = categoryOf(slug);
    return c ? [{ label: categoryName(c, lang), icon: c.icon, tone: groupOf(slug)?.tone ?? "blue" }] : [];
  });
}

/** Everything a listing card needs, already translated. Safe to send to the browser. */
export type CardData = {
  slug: string;
  href: string;
  name: string;
  logo?: string;
  avatarTone?: Tone;
  location: string;
  rating?: { value: number; count: number };
  verified: boolean;
  since: string;
  description: string;
  tags: ServiceTag[];
  price: string;
  priceKind: "amount" | "agreement" | "estimate";
  availability?: Availability;
  phoneMasked: string;
  hasWhatsapp: boolean;
};

export function toCardData(
  b: PublicBusiness,
  {
    lang,
    t,
    cityOf,
    categoryOf,
    groupOf,
    highlightCity,
  }: {
    lang: Locale;
    t: Dictionary;
    cityOf: (slug: string) => City | undefined;
    categoryOf: (slug: string) => Category | undefined;
    groupOf: (slug: string) => CategoryGroup | undefined;
    highlightCity?: string;
  },
): CardData {
  const local = localizeBusiness(b, lang);
  // Show the city being browsed, otherwise the business's home city.
  const shown = highlightCity && local.cities.includes(highlightCity) ? highlightCity : local.baseCity;
  const first = cityOf(shown) ?? cityOf(local.cities[0]);
  return {
    slug: local.slug,
    href: localePath(lang, `/negocio/${local.slug}`),
    name: local.name,
    avatarTone: local.avatarTone,
    location: first ? cityLabel(first, lang) : "",
    rating: local.reviewCount > 0 ? { value: local.rating, count: local.reviewCount } : undefined,
    verified: Boolean(local.verified),
    since: memberSince(local.createdAt, lang, t.common.memberSince),
    description: local.description,
    tags: serviceTags(local.categories, lang, categoryOf, groupOf),
    price: priceLabel(local, t.pricing),
    priceKind: local.priceType === "a-convenir" ? "agreement" : local.priceType === "presupuesto-gratis" ? "estimate" : "amount",
    availability: local.availability,
    phoneMasked: local.phoneMasked,
    hasWhatsapp: local.hasWhatsapp,
  };
}
