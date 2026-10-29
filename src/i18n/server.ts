import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, localePath } from "./config";
import { getDictionary } from "./dictionaries";

/**
 * Current locale, dictionary and a link helper for Server Components.
 * Reads the [lang] root segment, so nothing has to be passed down as props.
 */
export async function getI18n() {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return {
    lang: value,
    t: getDictionary(value),
    href: (path: string) => localePath(value, path),
  };
}
