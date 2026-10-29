"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { type Locale, fmt } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import { categoryName, categorySeoName, cityName } from "@/lib/localize";
import type { Category, City } from "@/lib/types";
import { CategoryIcon } from "../category-icon";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type WithCount<T> = T & { count: number };

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-brand-600" : "bg-ink-300"}`}
    >
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-[1.125rem]" : "left-0.5"}`} />
    </button>
  );
}

// UI-only for the preview. In production: insert/update rows in the cities and
// categories tables. A new city becomes a search option and gets /<city> pages
// automatically; it stays out of the sitemap until it has approved businesses.
export function CatalogManager({
  cities: initialCities,
  categories: initialCategories,
  t,
  lang,
  businessesLabel,
}: {
  cities: WithCount<City>[];
  categories: WithCount<Category>[];
  t: Dictionary["admin"]["catalog"];
  lang: Locale;
  businessesLabel: { one: string; other: string };
}) {
  const count = (n: number) => fmt(n === 1 ? businessesLabel.one : businessesLabel.other, { n });
  const [cities, setCities] = useState(initialCities);
  const [categories, setCategories] = useState(initialCategories);
  const [cityDraft, setCityDraft] = useState("");
  const [cityState, setCityState] = useState("");
  const [catName, setCatName] = useState("");
  const [catSeo, setCatSeo] = useState("");

  function addCity(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(cityDraft);
    if (!slug || cities.some((c) => c.slug === slug)) return;
    setCities((cs) => [...cs, { slug, name: cityDraft.trim(), state: cityState.toUpperCase(), active: true, count: 0 }]);
    setCityDraft("");
    setCityState("");
  }

  function addCategory(e: React.FormEvent) {
    e.preventDefault();
    const name = catName.trim();
    const seoName = catSeo.trim() || name;
    const slug = slugify(seoName);
    if (!slug || categories.some((c) => c.slug === slug)) return;
    // The same text fills both languages until someone translates it.
    setCategories((cs) => [...cs, { slug, name, seoName, nameEn: name, seoNameEn: seoName, icon: "sparkles", active: true, count: 0 }]);
    setCatName("");
    setCatSeo("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="card overflow-hidden">
        <div className="border-b border-ink-100 p-5">
          <h2 className="text-lg font-extrabold text-ink-700">{fmt(t.cities, { n: cities.length })}</h2>
          <form onSubmit={addCity} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">{t.cityName}</span>
              <input value={cityDraft} onChange={(e) => setCityDraft(e.target.value)} required placeholder={t.cityNamePh} className="input" />
            </label>
            <label className="sm:w-24">
              <span className="sr-only">{t.state}</span>
              <input value={cityState} onChange={(e) => setCityState(e.target.value)} required maxLength={2} placeholder="FL" className="input uppercase" />
            </label>
            <button type="submit" className="btn-primary">
              <Plus aria-hidden className="size-4" /> {t.add}
            </button>
          </form>
          {cityDraft && <p className="mt-2 text-xs text-ink-500">{fmt(t.url, { url: `/${slugify(cityDraft)}` })}</p>}
        </div>
        <ul className="divide-y divide-ink-100">
          {cities.map((c) => (
            <li key={c.slug} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {cityName(c, lang)}, {c.state}
                </p>
                <p className="text-xs text-ink-500">
                  /{c.slug} · {count(c.count)}
                  {c.count === 0 && ` · ${t.notIndexed}`}
                </p>
              </div>
              <Toggle
                checked={c.active}
                label={fmt(t.cityActive, { name: cityName(c, lang) })}
                onChange={() => setCities((cs) => cs.map((x) => (x.slug === c.slug ? { ...x, active: !x.active } : x)))}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-ink-100 p-5">
          <h2 className="text-lg font-extrabold text-ink-700">{fmt(t.categories, { n: categories.length })}</h2>
          <form onSubmit={addCategory} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <label>
              <span className="sr-only">{t.catName}</span>
              <input value={catName} onChange={(e) => setCatName(e.target.value)} required placeholder={t.catNamePh} className="input" />
            </label>
            <label>
              <span className="sr-only">{t.catSeo}</span>
              <input value={catSeo} onChange={(e) => setCatSeo(e.target.value)} placeholder={t.catSeoPh} className="input" />
            </label>
            <button type="submit" className="btn-primary">
              <Plus aria-hidden className="size-4" /> {t.add}
            </button>
          </form>
          {(catSeo || catName) && (
            <p className="mt-2 text-xs text-ink-500">
              {fmt(t.catPreview, { title: catSeo || catName, url: `/houston/${slugify(catSeo || catName)}` })}
            </p>
          )}
        </div>
        <ul className="divide-y divide-ink-100">
          {categories.map((c) => (
            <li key={c.slug} className="flex items-center gap-3 px-5 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-700">
                <CategoryIcon name={c.icon} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink-900">{categoryName(c, lang)}</p>
                <p className="truncate text-xs text-ink-500">
                  “{categorySeoName(c, lang)}” · /{c.slug} · {count(c.count)}
                </p>
              </div>
              <Toggle
                checked={c.active}
                label={fmt(t.catActive, { name: categoryName(c, lang) })}
                onChange={() => setCategories((cs) => cs.map((x) => (x.slug === c.slug ? { ...x, active: !x.active } : x)))}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
