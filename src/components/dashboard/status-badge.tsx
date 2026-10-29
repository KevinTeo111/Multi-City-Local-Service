import { Ban, CheckCircle2, Hourglass, XCircle } from "lucide-react";
import type { ListingStatus } from "@/lib/types";

// Status colors are reserved for status, and always come with an icon + label.
const styles: Record<ListingStatus, { className: string; icon: React.ReactNode }> = {
  pendiente: { className: "bg-amber-50 text-amber-800 ring-amber-200", icon: <Hourglass aria-hidden className="size-3" /> },
  aprobado: { className: "bg-emerald-50 text-emerald-800 ring-emerald-200", icon: <CheckCircle2 aria-hidden className="size-3" /> },
  rechazado: { className: "bg-red-50 text-red-800 ring-red-200", icon: <XCircle aria-hidden className="size-3" /> },
  suspendido: { className: "bg-ink-100 text-ink-700 ring-ink-200", icon: <Ban aria-hidden className="size-3" /> },
};

export function StatusBadge({ status, label }: { status: ListingStatus; label: string }) {
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${s.className}`}>
      {s.icon}
      {label}
    </span>
  );
}
