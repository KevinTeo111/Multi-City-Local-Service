import { Search } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import { getI18n } from "@/i18n/server";
import { cityLabel } from "@/lib/localize";
import { listCities } from "@/lib/queries";
import { LocationField } from "./location-field";

/** Cities and labels the location field needs. */
export function locationProps(lang: Locale, t: Dictionary) {
  return {
    cities: listCities().map((c) => ({ label: cityLabel(c, lang), lat: c.lat, lng: c.lng })),
    labels: { useLocation: t.search.useLocation, clear: t.search.clear, locating: t.search.locating, locateError: t.search.locateError },
  };
}

// Plain GET form: works without JavaScript and produces shareable URLs.
export async function SearchBar({ defaultQuery = "", defaultCity = "" }: { defaultQuery?: string; defaultCity?: string }) {
  const { t, lang, href } = await getI18n();
  return (
    <form action={href("/buscar")} role="search" className="flex flex-col gap-2 md:flex-row md:items-start">
      <input
        name="q"
        defaultValue={defaultQuery}
        placeholder={t.search.servicePlaceholder}
        aria-label={t.search.serviceLabel}
        className="input h-10 py-0 md:flex-[1.15]"
      />
      <LocationField
        name="ciudad"
        defaultValue={defaultCity}
        placeholder={t.search.cityPlaceholder}
        ariaLabel={t.search.cityLabel}
        className="md:flex-1"
        {...locationProps(lang, t)}
      />
      <button type="submit" className="btn-primary h-10 px-4">
        <Search aria-hidden className="size-4" /> {t.search.submit}
      </button>
    </form>
  );
}
