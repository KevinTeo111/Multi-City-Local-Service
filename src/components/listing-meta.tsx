import type { Availability } from "@/lib/types";

export const AVAILABILITIES: Availability[] = ["ahora", "hoy", "esta-semana", "ocupado"];

export const availabilityDot: Record<Availability, string> = {
  ahora: "bg-emerald-500",
  hoy: "bg-blue-500",
  "esta-semana": "bg-amber-500",
  ocupado: "bg-ink-400",
};

const pills: Record<Availability, string> = {
  ahora: "bg-emerald-50 text-emerald-700",
  hoy: "bg-blue-50 text-blue-700",
  "esta-semana": "bg-amber-50 text-amber-700",
  ocupado: "bg-ink-100 text-ink-600",
};

/** Colored pill with a dot: "• Available today". */
export function AvailabilityBadge({ value, labels }: { value: Availability; labels: Record<Availability, string> }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${pills[value]}`}>
      <span aria-hidden className={`size-1.5 rounded-full ${availabilityDot[value]}`} />
      {labels[value]}
    </span>
  );
}
