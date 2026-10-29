"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { type Locale, localePath, splitLocale } from "@/i18n/config";

const LANGS: { code: Locale; name: string }[] = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
];

/** Small flag for each language (Mexico for Spanish: the site's main audience). */
function Flag({ code }: { code: Locale }) {
  return (
    <svg aria-hidden viewBox="0 0 18 12" className="h-3 w-[1.125rem] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10">
      {code === "en" ? (
        <>
          <rect width="18" height="12" fill="#fff" />
          {[0, 2, 4, 6, 8, 10].map((y) => (
            <rect key={y} y={(y * 12) / 13} width="18" height={12 / 13} fill="#b22234" />
          ))}
          <rect y={(12 * 12) / 13} width="18" height={12 / 13} fill="#b22234" />
          <rect width="7.2" height={(7 * 12) / 13} fill="#3c3b6e" />
        </>
      ) : (
        <>
          <rect width="6" height="12" fill="#006847" />
          <rect x="6" width="6" height="12" fill="#fff" />
          <rect x="12" width="6" height="12" fill="#ce1126" />
          <circle cx="9" cy="6" r="1.6" fill="#8c5a2b" />
        </>
      )}
    </svg>
  );
}

/** Keeps the search query and hash when switching language. */
function keepQuery(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.currentTarget.href = href + window.location.search + window.location.hash;
}

/** Header: current language with a flag, opening a small menu. */
export function LangMenu({ current, label }: { current: Locale; label: string }) {
  const { path } = splitLocale(usePathname());
  const menu = useRef<HTMLDetailsElement>(null);

  // Close when clicking anywhere else.
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menu.current?.open && !menu.current.contains(e.target as Node)) menu.current.open = false;
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <details ref={menu} className="group relative">
      <summary
        aria-label={label}
        className="flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 [&::-webkit-details-marker]:hidden"
      >
        <Flag code={current} /> {current.toUpperCase()}
        <ChevronDown aria-hidden className="size-3.5 text-ink-400 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="absolute right-0 z-40 mt-1.5 w-40 animate-[rise_0.15s_ease-out] rounded-lg border border-ink-200 bg-white p-1 shadow-lg">
        {LANGS.map((l) => {
          const href = localePath(l.code, path);
          return (
            <li key={l.code}>
              <a
                href={href}
                hrefLang={l.code}
                lang={l.code}
                aria-current={l.code === current ? "true" : undefined}
                onClick={(e) => keepQuery(e, href)}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                <Flag code={l.code} /> {l.name}
                {l.code === current && <Check aria-hidden className="ml-auto size-3.5 text-brand-500" />}
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/** Footer: plain link to the same page in the other language. */
export function LangSwitch({ to, label, short, className = "" }: { to: Locale; label: string; short: string; className?: string }) {
  const { path } = splitLocale(usePathname());
  const href = localePath(to, path);
  return (
    <a
      href={href}
      hrefLang={to}
      lang={to}
      title={label}
      onClick={(e) => keepQuery(e, href)}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-bold text-ink-700 hover:bg-ink-50 ${className}`}
    >
      <Globe aria-hidden className="size-4" />
      <span aria-hidden>{short}</span>
      <span className="sr-only">{label}</span>
    </a>
  );
}
