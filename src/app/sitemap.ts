import type { MetadataRoute } from "next";
import { locales, localePath } from "@/i18n/config";
import { countByCategory, countByCity, listApprovedSlugs, listCategories, listCities, populatedCityCategoryPairs } from "@/lib/queries";
import { site } from "@/lib/site";

// Only pages with approved businesses are listed, so empty cities stay out of
// Google. Each page is listed in both languages with hreflang alternates.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    ...listCities()
      .filter((c) => countByCity(c.slug) > 0)
      .map((c) => ({ path: `/${c.slug}`, priority: 0.9 })),
    ...populatedCityCategoryPairs().map((p) => ({ path: `/${p.ciudad}/${p.categoria}`, priority: 0.8 })),
    ...listCategories()
      .filter((c) => countByCategory(c.slug) > 0)
      .map((c) => ({ path: `/servicios/${c.slug}`, priority: 0.7 })),
    ...listApprovedSlugs().map((slug) => ({ path: `/negocio/${slug}`, priority: 0.6 })),
  ];

  const url = (lang: (typeof locales)[number], path: string) => `${site.url}${localePath(lang, path)}`;
  return pages.flatMap(({ path, priority }) =>
    locales.map((lang) => ({
      url: url(lang, path),
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])) },
    })),
  );
}
