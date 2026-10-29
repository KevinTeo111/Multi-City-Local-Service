import { Banknote, CalendarDays, ClipboardCheck, Handshake, MapPin, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { fmt } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import type { CardData } from "@/lib/localize";
import { BusinessLogo } from "./business-logo";
import { ServiceTag } from "./category-icon";
import { AvailabilityBadge } from "./listing-meta";
import { SaveButton } from "./save-button";

// The one listing card used everywhere (home, results, saved). It only takes
// already-translated data, so it also renders inside client components.
// Cards differ by what each business has: avatar, verified badge, rating,
// description, services, price type and availability.

export type CardLabels = Pick<Dictionary, "availability" | "save"> & { verified: string; rating: string };

export function cardLabels(t: Dictionary): CardLabels {
  return { availability: t.availability, save: t.save, verified: t.card.verified, rating: t.card.rating };
}

const priceIcon = { amount: Banknote, agreement: Handshake, estimate: ClipboardCheck };

export function BusinessCard({ card, labels }: { card: CardData; labels: CardLabels }) {
  const extra = card.tags.length - 2;
  const PriceIcon = priceIcon[card.priceKind];
  return (
    <article className="card-link group relative flex h-full flex-col p-4">
      <div className="flex items-start gap-3">
        <BusinessLogo name={card.name} src={card.logo} tone={card.avatarTone} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-[15px] font-semibold text-ink-900 transition-colors group-hover:text-brand-600">
            {/* Stretched link: the whole card opens the profile. */}
            <Link href={card.href} className="truncate after:absolute after:inset-0 after:rounded-xl">
              {card.name}
            </Link>
            {card.verified && <ShieldCheck aria-label={labels.verified} role="img" className="size-4 shrink-0 text-brand-500" />}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
            <MapPin aria-hidden className="size-3 shrink-0" /> <span className="truncate">{card.location}</span>
            {card.rating && (
              <span
                className="inline-flex shrink-0 items-center gap-0.5 before:mx-1 before:text-ink-300 before:content-['•']"
                aria-label={fmt(labels.rating, { rating: card.rating.value.toFixed(1), n: card.rating.count })}
              >
                <Star aria-hidden className="size-3 fill-amber-400 text-amber-400" />
                <span aria-hidden className="font-medium text-ink-700">{card.rating.value.toFixed(1)}</span>
                <span aria-hidden>({card.rating.count})</span>
              </span>
            )}
          </p>
          <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-xs text-ink-500">
            <CalendarDays aria-hidden className="size-3" /> {card.since}
          </p>
        </div>
        <SaveButton slug={card.slug} name={card.name} labels={labels.save} />
      </div>

      {card.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600">{card.description}</p>}

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {card.tags.slice(0, 2).map((tag) => (
          <li key={tag.label}>
            <ServiceTag {...tag} />
          </li>
        ))}
        {extra > 0 && <li className="chip">+{extra}</li>}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-ink-800">
          <PriceIcon aria-hidden className="size-3.5 shrink-0 text-ink-500" /> <span className="truncate">{card.price}</span>
        </span>
        {card.availability && <AvailabilityBadge value={card.availability} labels={labels.availability} />}
      </div>
    </article>
  );
}
