"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import { categoryName, cityLabel, groupName } from "@/lib/localize";
import type { ProfileValues } from "@/lib/profile";
import type { Availability, Category, CategoryGroup, City, ListingStatus, PriceType } from "@/lib/types";
import { BusinessLogo } from "../business-logo";
import { AVAILABILITIES } from "../listing-meta";

const PRICE_TYPES: PriceType[] = ["hora", "dia", "fijo", "a-convenir", "presupuesto-gratis"];
const STATUSES: ListingStatus[] = ["pendiente", "aprobado", "rechazado", "suspendido"];

export type ProfileFormText = Pick<Dictionary, "form" | "availability" | "pricing" | "languageNames">;

const toList = (text: string) => text.split(",").map((s) => s.trim()).filter(Boolean);

function Section({ id, title, text, children }: { id?: string; title: string; text?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-ink-200 pt-8 first:border-0 first:pt-0">
      <h2 className="font-display text-xl font-bold text-ink-900">{title}</h2>
      {text && <p className="mt-2 text-sm text-ink-500">{text}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ id, label, wide, children }: { id: string; label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="label">{label}</label>
      {children}
    </div>
  );
}

// UI-only for the preview: in production "save" is a server action that writes
// the business row (and sends owner edits back to review).
export function ProfileForm({
  initial,
  cities,
  groups,
  mode,
  lang,
  t,
}: {
  initial: ProfileValues;
  cities: City[];
  groups: (CategoryGroup & { items: Category[] })[];
  mode: "owner" | "admin-new" | "admin-edit";
  lang: Locale;
  t: ProfileFormText;
}) {
  const f = t.form;
  const [values, setValues] = useState(initial);
  const [services, setServices] = useState(initial.services.join(", "));
  const [logo, setLogo] = useState<string>();
  const [saved, setSaved] = useState(false);

  function set<K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  const [primary, ...extra] = values.categories;
  const successText = mode === "owner" ? f.savedOwner : values.status === "aprobado" ? f.savedPublished : f.saved;

  return (
    <form
      id="profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        set("services", toList(services));
        setSaved(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="card animate-rise space-y-8 p-8 sm:p-9"
    >
      {saved && (
        <p role="status" className="flex animate-rise items-center gap-2 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <CheckCircle2 aria-hidden className="size-4" /> {successText}
        </p>
      )}

      <Section title={f.essentials}>
        <div className="flex items-center gap-4 sm:col-span-2">
          <BusinessLogo name={values.name || f.sampleName} src={logo} size="lg" />
          <div>
            <p className="text-sm font-medium text-ink-800">{f.logo}</p>
            <p className="mt-0.5 text-xs text-ink-500">{f.logoHint}</p>
            <label className="btn-outline mt-2 h-9 cursor-pointer px-4 text-xs has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100">
              {f.upload}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setLogo(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>
        <Field id="name" label={f.name}>
          <input id="name" required value={values.name} onChange={(e) => set("name", e.target.value)} className="input h-11" />
        </Field>
        <Field id="category" label={f.primaryService}>
          <select
            id="category"
            required
            value={primary ?? ""}
            onChange={(e) => set("categories", [e.target.value, ...extra.filter((c) => c !== e.target.value)])}
            className="input h-11 cursor-pointer"
          >
            <option value="" disabled>—</option>
            {groups.map((g) => (
              <optgroup key={g.slug} label={groupName(g, lang)}>
                {g.items.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {categoryName(c, lang)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field id="description" label={f.about} wide>
          <textarea
            id="description"
            rows={3}
            required
            maxLength={500}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder={f.aboutPh}
            className="input resize-y leading-relaxed"
          />
        </Field>
        <Field id="services" label={f.servicesOffered} wide>
          <input id="services" value={services} onChange={(e) => setServices(e.target.value)} placeholder={f.servicesOfferedPh} className="input h-11" />
        </Field>
      </Section>

      <Section id="zonas" title={f.whereTitle} text={f.whereText}>
        <fieldset className="sm:col-span-2">
          <legend className="sr-only">{f.citiesTitle}</legend>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => {
              const on = values.cities.includes(c.slug);
              return (
                <label
                  key={c.slug}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100 ${
                    on ? "border-brand-500 bg-brand-500 text-white" : "border-ink-200 text-ink-700 hover:border-brand-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => set("cities", on ? values.cities.filter((x) => x !== c.slug) : [...values.cities, c.slug])}
                  />
                  {on && <Check aria-hidden className="size-3.5" />}
                  {cityLabel(c, lang)}
                </label>
              );
            })}
          </div>
          {values.cities.length === 0 && <p className="mt-2 text-xs text-amber-800">{f.noCity}</p>}
        </fieldset>
        <Field id="baseCity" label={f.baseCity}>
          <select id="baseCity" value={values.baseCity} onChange={(e) => set("baseCity", e.target.value)} className="input h-11 cursor-pointer">
            <option value="">—</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {cityLabel(c, lang)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="address" label={f.address}>
          <input id="address" value={values.address} onChange={(e) => set("address", e.target.value)} placeholder={f.addressPh} className="input h-11" />
        </Field>
      </Section>

      <Section id="contacto" title={f.contactTitle} text={f.contactText}>
        <Field id="phone" label={f.phone}>
          <input id="phone" type="tel" required value={values.phone} onChange={(e) => set("phone", e.target.value)} className="input h-11" />
        </Field>
        <Field id="whatsapp" label={f.whatsapp}>
          <input id="whatsapp" type="tel" value={values.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="input h-11" />
        </Field>
        <Field id="email" label={f.email}>
          <input id="email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} className="input h-11" />
        </Field>
        <Field id="website" label={f.website}>
          <input id="website" type="url" value={values.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" className="input h-11" />
        </Field>
      </Section>

      <Section title={f.priceTitle}>
        <Field id="priceType" label={f.priceType}>
          <select id="priceType" value={values.priceType} onChange={(e) => set("priceType", e.target.value as PriceType)} className="input h-11 cursor-pointer">
            {PRICE_TYPES.map((p) => (
              <option key={p} value={p}>
                {t.pricing[p]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="availability" label={f.availability}>
          <select id="availability" value={values.availability} onChange={(e) => set("availability", e.target.value as Availability)} className="input h-11 cursor-pointer">
            {AVAILABILITIES.map((a) => (
              <option key={a} value={a}>
                {t.availability[a]}
              </option>
            ))}
          </select>
        </Field>
        {(values.priceType === "hora" || values.priceType === "dia") && (
          <Field id="price" label={f.price}>
            <input id="price" type="number" min="1" inputMode="numeric" value={values.price} onChange={(e) => set("price", e.target.value)} className="input h-11" />
          </Field>
        )}
        {values.priceType === "fijo" && (
          <Field id="priceNote" label={f.priceNote}>
            <input id="priceNote" maxLength={40} value={values.priceNote} onChange={(e) => set("priceNote", e.target.value)} placeholder={f.priceNotePh} className="input h-11" />
          </Field>
        )}
      </Section>

      <Section title={f.translationTitle} text={f.translationText}>
        <Field id="descriptionAlt" label={f.descriptionEn} wide>
          <textarea
            id="descriptionAlt"
            lang={lang === "es" ? "en" : "es"}
            rows={3}
            maxLength={500}
            value={values.descriptionAlt}
            onChange={(e) => set("descriptionAlt", e.target.value)}
            className="input resize-y leading-relaxed"
          />
        </Field>
        <Field id="servicesAlt" label={f.servicesEn} wide>
          <input
            id="servicesAlt"
            lang={lang === "es" ? "en" : "es"}
            value={values.servicesAlt}
            onChange={(e) => set("servicesAlt", e.target.value)}
            className="input h-11"
          />
        </Field>
      </Section>

      {mode !== "owner" && (
        <Section title={f.statusTitle}>
          <Field id="status" label={f.status}>
            <select id="status" value={values.status} onChange={(e) => set("status", e.target.value as ListingStatus)} className="input h-11 cursor-pointer">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {f.statusOptions[s]}
                </option>
              ))}
            </select>
          </Field>
        </Section>
      )}

      <div className="flex justify-end border-t border-ink-200 pt-8">
        <button type="submit" disabled={values.cities.length === 0 || !primary} className="btn-primary h-12 px-8">
          {mode === "admin-new" ? f.saveNew : f.save}
        </button>
      </div>
    </form>
  );
}
