"use client";

import { LoaderCircle, MapPin, Navigation, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";

export type LocationCity = { label: string; lat?: number; lng?: number };
export type LocationLabels = { useLocation: string; clear: string; locating: string; locateError: string };

function nearest(cities: LocationCity[], lat: number, lng: number) {
  // Equirectangular distance is plenty to pick the closest of a few cities.
  const d = (c: LocationCity) =>
    c.lat === undefined || c.lng === undefined ? Infinity : ((c.lng - lng) * Math.cos((lat * Math.PI) / 180)) ** 2 + (c.lat - lat) ** 2;
  return cities.reduce((best, c) => (d(c) < d(best) ? c : best));
}

/**
 * City input with suggestions, a clear button and "use my location", which
 * fills in the nearest city we serve. With `autoSubmit`, changes re-run the search.
 */
export function LocationField({
  id,
  name,
  defaultValue = "",
  placeholder,
  ariaLabel,
  cities,
  labels,
  autoSubmit = false,
  className = "",
}: {
  id?: string;
  name: string;
  defaultValue?: string;
  placeholder: string;
  ariaLabel?: string;
  cities: LocationCity[];
  labels: LocationLabels;
  autoSubmit?: boolean;
  className?: string;
}) {
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "locating" | "error">("idle");

  function commit(next: string) {
    flushSync(() => setValue(next));
    if (autoSubmit) input.current?.form?.requestSubmit();
  }

  function locate() {
    if (!navigator.geolocation) return setStatus("error");
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setStatus("idle");
        commit(nearest(cities, coords.latitude, coords.longitude).label);
      },
      () => setStatus("error"),
      { timeout: 8000, maximumAge: 600_000 },
    );
  }

  return (
    <div className={className}>
      <div className="field pr-1">
        <MapPin aria-hidden className="size-4 shrink-0" />
        <input
          ref={input}
          id={id}
          name={name}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setStatus("idle");
          }}
          placeholder={placeholder}
          aria-label={ariaLabel}
          list={listId}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={() => commit("")}
            aria-label={labels.clear}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-ink-400 transition-colors hover:text-ink-900"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={locate}
          disabled={status === "locating"}
          title={labels.useLocation}
          aria-label={status === "locating" ? labels.locating : labels.useLocation}
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ink-100 text-ink-500 transition-colors hover:bg-ink-200 hover:text-ink-900 disabled:opacity-60"
        >
          {status === "locating" ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Navigation aria-hidden className="size-4" />}
        </button>
        <datalist id={listId}>
          {cities.map((c) => (
            <option key={c.label} value={c.label} />
          ))}
        </datalist>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-1.5 text-xs text-red-700">
          {labels.locateError}
        </p>
      )}
    </div>
  );
}
