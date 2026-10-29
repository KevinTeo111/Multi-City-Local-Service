import { ArrowUpRight, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function EmptyResults() {
  const { t, href } = await getI18n();
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-14 text-center">
      <SearchX aria-hidden className="size-9 text-ink-300" />
      <h3 className="font-display text-lg font-bold text-ink-900">{t.listing.emptyTitle}</h3>
      <p className="max-w-sm text-sm text-ink-500">{t.listing.emptyText}</p>
      <Link href={href("/registro")} className="btn-primary mt-2">
        {t.listing.emptyCta} <ArrowUpRight aria-hidden className="size-4" />
      </Link>
    </div>
  );
}

/** "‹ Previous  1 of 2  Next ›" */
export async function Pagination({ page, pages, hrefFor }: { page: number; pages: number; hrefFor: (p: number) => string }) {
  if (pages <= 1) return null;
  const { t } = await getI18n();
  const button = "btn-ghost h-8 gap-1 px-2.5 text-[13px] font-medium";
  const off = `${button} pointer-events-none opacity-50`;
  return (
    <nav aria-label={t.listing.pagination} className="mt-8 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={button} aria-label={t.listing.prev}>
          <ChevronLeft aria-hidden className="size-4" /> {t.listing.prevShort}
        </Link>
      ) : (
        <span aria-disabled className={off}>
          <ChevronLeft aria-hidden className="size-4" /> {t.listing.prevShort}
        </span>
      )}
      <span className="text-sm text-ink-600" aria-current="page">
        {fmt(t.listing.pageOf, { current: page, total: pages })}
      </span>
      {page < pages ? (
        <Link href={hrefFor(page + 1)} className={button} aria-label={t.listing.next}>
          {t.listing.nextShort} <ChevronRight aria-hidden className="size-4" />
        </Link>
      ) : (
        <span aria-disabled className={off}>
          {t.listing.nextShort} <ChevronRight aria-hidden className="size-4" />
        </span>
      )}
    </nav>
  );
}
