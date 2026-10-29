"use client";

import { ChevronRight, Search, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import Form from "next/form";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { fmt } from "@/i18n/config";
import type { Availability, PriceType } from "@/lib/types";
import { availabilityDot } from "./listing-meta";
import { type LocationCity, type LocationLabels, LocationField } from "./location-field";

export type FilterGroup = { slug: string; name: string; items: { slug: string; name: string }[] };

export type BrowseFilterLabels = {
  filters: string;
  search: string;
  example: string;
  examples: string[];
  location: string;
  locationPh: string;
  allServices: string;
  price: string;
  priceTypes: Record<"hora" | "dia" | "fijo", string>;
  availability: string;
  availabilityTypes: Record<Availability, string>;
  rating: string;
  ratingOption: string;
  verifiedOnly: string;
  apply: string;
};

const PRICE_FILTERS = ["hora", "dia", "fijo"] as const;
const AVAILABILITY_FILTERS: Availability[] = ["ahora", "hoy", "esta-semana"];

const caption = "mb-2 block text-xs font-medium text-ink-700";
const chip =
  "inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900 has-[:checked]:border-brand-300 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-brand-400/40";

/** Search box whose placeholder cycles through examples ("e.g. plumber Houston"). */
function ExampleSearch({ defaultValue, labels }: { defaultValue?: string; labels: BrowseFilterLabels }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % labels.examples.length), 2600);
    return () => clearInterval(id);
  }, [labels.examples.length]);
  return (
    <div className="field">
      <Search aria-hidden className="size-4 shrink-0" />
      <input id="filter-q" name="q" type="search" defaultValue={defaultValue} placeholder={fmt(labels.example, { q: labels.examples[i] })} />
    </div>
  );
}

/** Five stars; click sets "N stars & up", clicking the same star again clears it. */
function RatingPicker({ value, label, optionLabel, onPick }: { value: number; label: string; optionLabel: string; onPick: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div role="group" aria-label={label} className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-pressed={value === n}
          aria-label={fmt(optionLabel, { n })}
          onMouseEnter={() => setHover(n)}
          onClick={() => onPick(value === n ? 0 : n)}
          className="rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/40"
        >
          <Star aria-hidden className={`size-5 transition-colors ${n <= shown ? "fill-amber-400 text-amber-400" : "text-ink-300"}`} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

/**
 * Results sidebar: search, location, services, price, availability, rating and
 * "verified only" in one GET form. Every change re-runs the search right away.
 */
export function BrowseFilters({
  action,
  q,
  city,
  sort,
  selected,
  prices,
  availability,
  minRating,
  verified,
  groups,
  location,
  labels,
}: {
  action: string;
  q?: string;
  city?: string;
  sort?: string;
  selected: string[];
  prices: PriceType[];
  availability: Availability[];
  minRating: number;
  verified: boolean;
  groups: FilterGroup[];
  location: { cities: LocationCity[]; labels: LocationLabels };
  labels: BrowseFilterLabels;
}) {
  const form = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(minRating);
  const submit = () => form.current?.requestSubmit();
  const active = selected.length + prices.length + availability.length + (minRating ? 1 : 0) + (verified ? 1 : 0) + (city ? 1 : 0);

  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="btn-ghost mb-4 h-10 w-full lg:hidden">
        <SlidersHorizontal aria-hidden className="size-4" /> {labels.filters}
        {active > 0 && <span className="rounded-full bg-brand-500 px-1.5 text-[11px] text-white">{active}</span>}
      </button>

      <Form ref={form} action={action} scroll={false} className={`${open ? "block" : "hidden"} space-y-4 lg:block`}>
        <div>
          <label htmlFor="filter-q" className={caption}>
            {labels.search}
          </label>
          <ExampleSearch defaultValue={q} labels={labels} />
        </div>
        <div>
          <label htmlFor="filter-city" className={caption}>
            {labels.location}
          </label>
          <LocationField id="filter-city" name="ciudad" defaultValue={city} placeholder={labels.locationPh} autoSubmit {...location} />
        </div>
        {sort && <input type="hidden" name="orden" value={sort} />}

        <div className="border-t border-ink-200 pt-4">
          <p className="px-2 text-xs font-medium text-ink-700">{labels.allServices}</p>
          <div className="mt-2 space-y-0.5">
            {groups.map((g, i) => {
              const on = g.items.some((c) => selected.includes(c.slug));
              return (
                <details key={g.slug} open={on || (selected.length === 0 && i === 0)} className="group">
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-2 text-[13px] font-medium transition-colors hover:bg-ink-100 [&::-webkit-details-marker]:hidden ${
                      on ? "text-brand-600" : "text-ink-700"
                    }`}
                  >
                    {g.name}
                    <ChevronRight aria-hidden className="size-3.5 text-ink-400 transition-transform duration-200 group-open:rotate-90" />
                  </summary>
                  <ul className="mb-1 space-y-0.5 group-open:animate-[rise_0.25s_ease-out]">
                    {g.items.map((c) => {
                      const checked = selected.includes(c.slug);
                      return (
                        <li key={c.slug}>
                          <label
                            className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
                              checked ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="categoria"
                              value={c.slug}
                              defaultChecked={checked}
                              onChange={submit}
                              className="size-4 shrink-0 cursor-pointer rounded accent-brand-500"
                            />
                            {c.name}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>
        </div>

        <fieldset className="border-t border-ink-200 pt-4">
          <legend className={`${caption} float-left w-full`}>{labels.price}</legend>
          <div className="clear-left flex flex-wrap gap-2">
            {PRICE_FILTERS.map((p) => (
              <label key={p} className={chip}>
                <input type="checkbox" name="precio" value={p} defaultChecked={prices.includes(p)} onChange={submit} className="sr-only" />
                {labels.priceTypes[p]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-t border-ink-200 pt-4">
          <legend className={`${caption} float-left w-full`}>{labels.availability}</legend>
          <div className="clear-left flex flex-wrap gap-2">
            {AVAILABILITY_FILTERS.map((a) => (
              <label key={a} className={chip}>
                <input type="checkbox" name="disponible" value={a} defaultChecked={availability.includes(a)} onChange={submit} className="sr-only" />
                <span aria-hidden className={`size-1.5 rounded-full ${availabilityDot[a]}`} />
                {labels.availabilityTypes[a]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="border-t border-ink-200 pt-4">
          <p className={caption}>{labels.rating}</p>
          {rating > 0 && <input type="hidden" name="calificacion" value={rating} />}
          <RatingPicker
            value={rating}
            label={labels.rating}
            optionLabel={labels.ratingOption}
            onPick={(n) => {
              flushSync(() => setRating(n));
              submit();
            }}
          />
        </div>

        <div className="border-t border-ink-200 pt-4">
          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 transition-colors hover:border-ink-300 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-brand-400/40">
            <ShieldCheck aria-hidden className="size-4 text-ink-500" />
            <span className="flex-1">{labels.verifiedOnly}</span>
            <input type="checkbox" name="verificado" value="1" defaultChecked={verified} onChange={submit} className="peer sr-only" />
            <span
              aria-hidden
              className="relative h-5 w-9 rounded-full bg-ink-200 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-brand-500 peer-checked:after:translate-x-4"
            />
          </label>
        </div>

        <button type="submit" className="btn-primary sr-only w-full focus:not-sr-only">
          {labels.apply}
        </button>
      </Form>
    </>
  );
}
