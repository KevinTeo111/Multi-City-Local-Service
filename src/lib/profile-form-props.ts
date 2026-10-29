import "server-only";
import type { ProfileFormText } from "@/components/dashboard/profile-form";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import { listCategoryGroups, listCities } from "./queries";

/** The props every profile editor (owner, admin new, admin edit) shares. */
export function profileFormProps(lang: Locale, t: Dictionary) {
  const text: ProfileFormText = { form: t.form, availability: t.availability, pricing: t.pricing, languageNames: t.languageNames };
  return { lang, t: text, cities: listCities(), groups: listCategoryGroups() };
}
