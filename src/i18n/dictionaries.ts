import type { Locale } from "./config";
import { en } from "./en";
import { es } from "./es";

const dictionaries = { es, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
