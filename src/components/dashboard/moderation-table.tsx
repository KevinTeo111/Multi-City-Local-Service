"use client";

import { Ban, Check, Pencil, RotateCcw, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { fmt } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import type { ListingStatus } from "@/lib/types";
import { BusinessLogo } from "../business-logo";
import { StatusBadge } from "./status-badge";

export type ModerationRow = {
  id: string;
  slug: string;
  name: string;
  categories: string;
  cities: string;
  status: ListingStatus;
  createdAt: string;
  addedByAdmin: boolean;
};

const tabs: (ListingStatus | "todos")[] = ["todos", "pendiente", "aprobado", "rechazado", "suspendido"];

// UI-only for the preview: in production each action is a server action that
// updates businesses.status (protected by an admin-only RLS policy).
export function ModerationTable({
  rows: initialRows,
  initialTab = "todos",
  t,
  statusLabels,
  editHref,
}: {
  rows: ModerationRow[];
  initialTab?: ListingStatus | "todos";
  t: Dictionary["admin"]["moderation"];
  statusLabels: Record<ListingStatus, string>;
  editHref: string;
}) {
  const [rows, setRows] = useState(initialRows);
  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string>();

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const visible = rows.filter(
    (r) =>
      (tab === "todos" || r.status === tab) &&
      (!query || `${r.name} ${r.categories} ${r.cities}`.toLowerCase().includes(query.toLowerCase())),
  );

  function setStatus(id: string, status: ListingStatus) {
    const row = rows.find((r) => r.id === id);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    if (row) setNotice(`${row.name}: ${statusLabels[status]}`);
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label={t.filterBy}>
          {tabs.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === key ? "bg-ink-700 text-white" : "text-ink-700 hover:bg-ink-50"
              }`}
            >
              {key === "todos" ? t.all : statusLabels[key]}{" "}
              <span className={tab === key ? "text-ink-200" : "text-ink-500"}>{counts[key] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="relative lg:w-72">
          <span className="sr-only">{t.search}</span>
          <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh} className="input pl-9" />
        </label>
      </div>

      {notice && (
        <div role="status" className="flex items-center justify-between bg-ink-700 px-4 py-2 text-sm text-white">
          {notice}
          <button type="button" onClick={() => setNotice(undefined)} aria-label={t.closeNotice}>
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3 font-medium">{t.business}</th>
              <th className="px-4 py-3 font-medium">{t.cities}</th>
              <th className="px-4 py-3 font-medium">{t.status}</th>
              <th className="px-4 py-3 font-medium">{t.created}</th>
              <th className="px-4 py-3 text-right font-medium">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {visible.map((r) => (
              <tr key={r.id} className="hover:bg-ink-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <BusinessLogo name={r.name} size="sm" />
                    <div>
                      <p className="font-semibold text-ink-900">{r.name}</p>
                      <p className="text-xs text-ink-500">
                        {r.categories}
                        {r.addedByAdmin && <span className="ml-1.5 rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-600">{t.addedByAdmin}</span>}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-600">{r.cities}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} label={statusLabels[r.status]} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink-500">{r.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    {(r.status === "pendiente" || r.status === "rechazado") && (
                      <button type="button" onClick={() => setStatus(r.id, "aprobado")} className="btn bg-emerald-600 px-2.5 py-1.5 text-xs text-white hover:bg-emerald-700">
                        <Check aria-hidden className="size-3.5" /> {t.approve}
                      </button>
                    )}
                    {r.status === "pendiente" && (
                      <button type="button" onClick={() => setStatus(r.id, "rechazado")} className="btn-ghost px-2.5 py-1.5 text-xs text-red-700">
                        <X aria-hidden className="size-3.5" /> {t.reject}
                      </button>
                    )}
                    {r.status === "aprobado" && (
                      <button type="button" onClick={() => setStatus(r.id, "suspendido")} className="btn-ghost px-2.5 py-1.5 text-xs">
                        <Ban aria-hidden className="size-3.5" /> {t.suspend}
                      </button>
                    )}
                    {r.status === "suspendido" && (
                      <button type="button" onClick={() => setStatus(r.id, "aprobado")} className="btn-ghost px-2.5 py-1.5 text-xs">
                        <RotateCcw aria-hidden className="size-3.5" /> {t.reactivate}
                      </button>
                    )}
                    <Link href={`${editHref}/${r.id}`} className="btn-ghost px-2.5 py-1.5 text-xs" aria-label={fmt(t.edit, { name: r.name })}>
                      <Pencil aria-hidden className="size-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-ink-500">
                  {t.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
