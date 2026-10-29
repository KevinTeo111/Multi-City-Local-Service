"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type HeaderLink = { href: string; label: string; match: string[] };

/** Header links: the current section gets a blue bar along the header's bottom edge. */
export function HeaderNav({ links, label }: { links: HeaderLink[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="hidden h-full items-stretch gap-1 md:flex">
      {links.map((l) => {
        const active = l.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex items-center px-3 text-sm transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-center after:rounded-full after:transition-transform after:duration-200 ${
              active
                ? "font-medium text-ink-900 after:scale-x-100 after:bg-brand-500"
                : "text-ink-600 after:scale-x-0 after:bg-brand-200 hover:text-ink-900 hover:after:scale-x-100"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
