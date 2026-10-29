"use client";

import { useRouter } from "next/navigation";

/** Re-runs the current search with a different sort order. */
export function SortSelect({
  label,
  options,
  value,
  action,
  params,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  action: string;
  params: [string, string][];
}) {
  const router = useRouter();
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => {
          const qs = new URLSearchParams(params.filter(([k]) => k !== "orden" && k !== "pagina"));
          if (e.target.value !== options[0].value) qs.set("orden", e.target.value);
          const s = qs.toString();
          router.push(s ? `${action}?${s}` : action);
        }}
        className="input h-10 w-auto cursor-pointer py-0 pr-9 text-[13px] text-ink-700"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
