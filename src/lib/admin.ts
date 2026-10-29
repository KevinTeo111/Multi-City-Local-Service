import "server-only";
import type { ModerationRow } from "@/components/dashboard/moderation-table";
import type { Locale } from "@/i18n/config";
import { categoryName, cityName } from "./localize";
import { getCategory, getCity, listAllBusinesses } from "./queries";

export function moderationRows(lang: Locale): ModerationRow[] {
  return listAllBusinesses().map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    categories: b.categories.map((c) => getCategory(c)).filter((c) => c !== undefined).map((c) => categoryName(c, lang)).join(", "),
    cities: b.cities.map((c) => getCity(c)).filter((c) => c !== undefined).map((c) => cityName(c, lang)).join(", "),
    status: b.status,
    createdAt: b.createdAt,
    addedByAdmin: b.addedByAdmin,
  }));
}
