"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type Locale, fmt } from "@/i18n/config";
import type { CardData } from "@/lib/localize";
import { useSaved } from "@/lib/saved";
import { BusinessCard, type CardLabels } from "./business-card";

export function SavedList({
  lang,
  labels,
  text,
  exploreHref,
}: {
  lang: Locale;
  labels: CardLabels;
  text: { empty: string; emptyText: string; emptyCta: string; loading: string; showing: string };
  exploreHref: string;
}) {
  const slugs = useSaved();
  const key = slugs.join(",");
  const [result, setResult] = useState<{ key: string; cards: CardData[] }>();

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    fetch(`/api/tarjetas?lang=${lang}&slugs=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((cards: CardData[]) => {
        if (!cancelled) setResult({ key, cards });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key, lang]);

  if (!key) {
    return (
      <div className="panel flex animate-rise flex-col items-center gap-3 px-6 py-16 text-center">
        <Heart aria-hidden className="size-9 text-brand-200" />
        <h2 className="font-display text-lg font-bold text-ink-900">{text.empty}</h2>
        <p className="max-w-sm text-sm text-ink-500">{text.emptyText}</p>
        <Link href={exploreHref} className="btn-primary mt-2">
          {text.emptyCta}
        </Link>
      </div>
    );
  }
  if (!result) return <p className="py-16 text-center text-sm text-ink-500">{text.loading}</p>;

  // Removing a card hides it right away; the list re-fetches in the background.
  const cards = result.cards.filter((c) => slugs.includes(c.slug));
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <div key={c.slug} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <BusinessCard card={c} labels={labels} />
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-ink-500">{fmt(text.showing, { n: cards.length })}</p>
    </>
  );
}
