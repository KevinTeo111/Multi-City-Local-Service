"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { splitLocale } from "@/i18n/config";

export type NavItem = { href: string; label: string; external?: boolean };

export function DashboardNav({ items, label }: { items: NavItem[]; label: string }) {
  const { path } = splitLocale(usePathname());
  // Most specific match wins, so "/admin" isn't active on "/admin/negocios".
  const active = items
    .filter((i) => !i.external)
    .map((i) => ({ href: i.href, path: splitLocale(i.href).path }))
    .filter((i) => path === i.path || path.startsWith(`${i.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]?.href;

  return (
    <nav className="mt-6 flex gap-x-6 gap-y-1 overflow-x-auto lg:flex-col" aria-label={label}>
      {items.map((item) => {
        const isActive = item.href === active;
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group inline-flex shrink-0 items-center gap-1 py-2.5 text-[13px] transition ${
              isActive ? "font-semibold text-brand-500" : "text-ink-700 hover:translate-x-0.5 hover:text-ink-900"
            }`}
          >
            {item.label}
            {item.external && <ArrowUpRight aria-hidden className="size-3 text-ink-400 transition group-hover:text-brand-500" />}
          </Link>
        );
      })}
    </nav>
  );
}
