import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicBusinesses, toCards } from "@/lib/queries";

// Card data for the "Saved" page, which only knows slugs from localStorage.
// Public fields only (no phone numbers), same as the listing pages.
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const langParam = params.get("lang") ?? "es";
  const lang = isLocale(langParam) ? langParam : "es";
  const slugs = (params.get("slugs") ?? "").split(",").filter(Boolean).slice(0, 50);
  const cards = toCards(getPublicBusinesses(slugs), { lang, t: getDictionary(lang) });
  return Response.json(cards);
}
