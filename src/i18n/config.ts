// Spanish is the default and lives at the root (/houston/plomeros); English
// lives under /en (/en/houston/plomeros). proxy.ts maps both onto app/[lang].

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const intlLocale: Record<Locale, string> = { es: "es-US", en: "en-US" };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** "/houston" -> "/houston" (es) or "/en/houston" (en). */
export function localePath(lang: Locale, path: string) {
  if (lang === defaultLocale) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Splits a browser pathname into its locale and the locale-free path. */
export function splitLocale(pathname: string): { lang: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) return { lang: first, path: `/${rest.join("/")}` };
  return { lang: defaultLocale, path: pathname || "/" };
}

/** Fills "{name}" placeholders: fmt("Hola {name}", { name: "Ana" }). */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

/** Picks the singular or plural template and fills {n}. */
export function plural(n: number, forms: { one: string; other: string }) {
  return fmt(n === 1 ? forms.one : forms.other, { n });
}
