import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon, toneTile } from "@/components/category-icon";
import { CtaBand, PageIntro } from "@/components/page-intro";
import { localePath, plural } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { categoryName, groupName } from "@/lib/localize";
import { countByCategory, countByGroup, listCategoryGroups } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getI18n();
  return {
    title: t.listing.allServicesTitle,
    description: t.listing.allServicesIntro,
    alternates: { canonical: localePath(lang, "/servicios"), languages: { es: "/servicios", en: "/en/servicios" } },
  };
}

/** Every group with its services: a directory of what can be listed. */
export default async function ServicesPage() {
  const { t, lang, href } = await getI18n();
  return (
    <div className="container-page pt-14">
      <PageIntro eyebrow={t.listing.servicesEyebrow} title={t.listing.allServicesTitle} text={t.listing.allServicesIntro} />
      <ul className="mt-10 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listCategoryGroups().map((g, i) => (
          <li key={g.slug} className="card animate-rise p-5" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
            <Link href={`${href("/buscar")}?grupo=${g.slug}`} className="group flex items-center gap-3">
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${toneTile(g.tone)}`}>
                <CategoryIcon name={g.icon} className="size-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-semibold text-ink-900 transition-colors group-hover:text-brand-600">{groupName(g, lang)}</span>
                <span className="text-xs text-ink-500">{plural(countByGroup(g.slug), t.home.profiles)}</span>
              </span>
              <ArrowRight aria-hidden className="size-4 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
            </Link>
            <ul className="mt-4 space-y-0.5 border-t border-ink-200/70 pt-3">
              {g.items.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={href(`/servicios/${c.slug}`)}
                    className="group/item flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
                  >
                    <CategoryIcon name={c.icon} className="size-4 text-ink-400 transition-colors group-hover/item:text-brand-500" />
                    <span className="flex-1">{categoryName(c, lang)}</span>
                    <span className="text-xs text-ink-400">{countByCategory(c.slug)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <CtaBand title={t.listing.servicesCtaTitle} text={t.listing.servicesCtaText} href={href("/registro")} label={t.nav.getListed} />
    </div>
  );
}
