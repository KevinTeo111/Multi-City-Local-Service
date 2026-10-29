import { Banknote, CalendarDays, Check, ClipboardCheck, Handshake, Info, MapPin, Route, ShieldCheck, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard, cardLabels } from "@/components/business-card";
import { BusinessLogo } from "@/components/business-logo";
import { CategoryIcon, ServiceTag } from "@/components/category-icon";
import { AvailabilityBadge } from "@/components/listing-meta";
import { ContactPanel } from "@/components/phone-reveal";
import { SaveButton } from "@/components/save-button";
import { ShareProfile } from "@/components/share-profile";
import { ViewTracker } from "@/components/view-tracker";
import { fmt, localePath, plural } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { categoryName, cityLabel, cityName, localizeBusiness, memberSince, priceLabel, serviceTags } from "@/lib/localize";
import { getCategory, getCity, getPublicBusiness, groupOf, listApprovedSlugs, relatedBusinesses, toCards } from "@/lib/queries";
import { jsonLdScript, site } from "@/lib/site";

export function generateStaticParams() {
  return listApprovedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/negocio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getPublicBusiness(slug);
  if (!found) return {};
  const { t, lang } = await getI18n();
  const b = localizeBusiness(found, lang);
  const base = getCity(b.baseCity);
  const path = `/negocio/${b.slug}`;
  return {
    title: base ? fmt(t.profile.metaTitle, { name: b.name, city: cityLabel(base, lang) }) : b.name,
    description: b.description ? `${b.tagline}. ${b.description.slice(0, 120)}…` : b.tagline,
    alternates: { canonical: localePath(lang, path), languages: { es: path, en: `/en${path}` } },
  };
}

const box = "card p-6";
const boxTitle = "font-display text-lg font-semibold text-ink-900";

export default async function BusinessPage({ params }: PageProps<"/[lang]/negocio/[slug]">) {
  const { slug } = await params;
  const found = getPublicBusiness(slug);
  if (!found) notFound();
  const { t, lang, href } = await getI18n();
  const b = localizeBusiness(found, lang);

  const primary = getCategory(b.categories[0]);
  const cities = b.cities.map(getCity).filter((c) => c !== undefined);
  const base = getCity(b.baseCity);
  const related = toCards(relatedBusinesses(b), { lang, t, highlightCity: b.baseCity });
  const tags = serviceTags(b.categories, lang, getCategory, groupOf);
  const tagNames = new Set(tags.map((x) => x.label));
  // Detailed services beyond the tag names ("Panel upgrades", "EV chargers"…).
  const details = (b.highlights?.map((h) => h.title) ?? b.services).filter((x) => !tagNames.has(x));
  const PriceIcon = b.priceType === "a-convenir" ? Handshake : b.priceType === "presupuesto-gratis" ? ClipboardCheck : Banknote;
  const since = memberSince(b.createdAt, lang, t.common.memberSince);
  const serves = plural(cities.length, t.profile.serves);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: b.name,
    description: b.description,
    url: `${site.url}${localePath(lang, `/negocio/${b.slug}`)}`,
    address: b.address,
    areaServed: cities.map((c) => cityLabel(c, lang)),
  };

  return (
    <>
      <ViewTracker slug={b.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />

      {/* Header band */}
      <section className="border-b border-ink-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl animate-rise flex-wrap items-center gap-6 px-5 py-8 sm:px-8">
          <BusinessLogo name={b.name} tone={b.avatarTone} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900">{b.name}</h1>
              {b.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                  <ShieldCheck aria-hidden className="size-3.5" /> {t.profile.verified}
                </span>
              )}
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
              {base && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden className="size-4" /> {cityLabel(base, lang)}
                </span>
              )}
              {primary && (
                <span className="inline-flex items-center gap-1.5">
                  <CategoryIcon name={primary.icon} className="size-4" /> {categoryName(primary, lang)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Route aria-hidden className="size-4" /> {serves}
              </span>
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-sm">
              {b.reviewCount > 0 ? (
                <span className="inline-flex items-center gap-1.5" aria-label={fmt(t.card.rating, { rating: b.rating.toFixed(1), n: b.reviewCount })}>
                  <span aria-hidden className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`size-4 ${n <= Math.round(b.rating) ? "fill-amber-400 text-amber-400" : "text-ink-300"}`} strokeWidth={1.5} />
                    ))}
                  </span>
                  <span aria-hidden className="font-medium text-ink-900">{b.rating.toFixed(1)}</span>
                  <span aria-hidden className="text-ink-500">({plural(b.reviewCount, t.profile.reviews)})</span>
                </span>
              ) : (
                <span className="text-ink-500">{t.profile.newProfile}</span>
              )}
              {b.availability && <AvailabilityBadge value={b.availability} labels={t.availability} />}
            </div>
          </div>
          <SaveButton slug={b.slug} name={b.name} labels={t.save} variant="button" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-5">
            <section className={`${box} reveal`}>
              <h2 className={boxTitle}>{t.profile.services}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag.label}>
                    <ServiceTag {...tag} size="md" />
                  </li>
                ))}
              </ul>
              {details.length > 0 && (
                <ul className="mt-4 grid gap-x-6 gap-y-2 border-t border-ink-200/70 pt-4 text-sm text-ink-700 sm:grid-cols-2">
                  {details.map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <Check aria-hidden className="size-4 shrink-0 text-brand-500" /> {d}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {b.description && (
              <section className={`${box} reveal`}>
                <h2 className={boxTitle}>{t.profile.about}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{b.description}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.profile.aboutExtra}</p>
              </section>
            )}

            {b.photos && b.photos.length > 0 && (
              <section className={`${box} reveal`}>
                <h2 className={boxTitle}>{t.profile.recentWork}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {b.photos.map((src) => (
                    <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image src={src} alt="" fill sizes="(min-width: 1024px) 15rem, (min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className={`${box} reveal`}>
              <h2 className={boxTitle}>{t.profile.areas}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link href={href(primary ? `/${c.slug}/${primary.slug}` : `/${c.slug}`)} className="btn-ghost group h-9 px-3.5 text-[13px] font-normal">
                      <MapPin aria-hidden className="size-3.5 text-ink-400 transition-colors group-hover:text-brand-500" /> {cityLabel(c, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <section className={`${box} animate-rise [animation-delay:80ms]`}>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
                  <PriceIcon aria-hidden className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-ink-900">{priceLabel(b, t.pricing)}</span>
                  {(b.priceType === "hora" || b.priceType === "dia" || b.priceType === "fijo") && (
                    <span className="block text-xs text-ink-500">{t.pricing[b.priceType]}</span>
                  )}
                </span>
              </div>
              <p className="mt-3 flex gap-1.5 text-xs leading-relaxed text-ink-500">
                <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" /> {t.profile.priceInfo}
              </p>
              <div className="mt-5 border-t border-ink-200/70 pt-5">
                <ContactPanel slug={b.slug} hasWhatsapp={b.hasWhatsapp} email={b.email} labels={{ ...t.phone, show: t.profile.showContact }} />
                <p className="mt-3 text-center text-xs text-ink-500">{t.profile.freeContact}</p>
              </div>
            </section>

            <section className={`${box} animate-rise py-2 [animation-delay:140ms]`}>
              <ul className="divide-y divide-ink-200/70 text-sm text-ink-700">
                {[
                  ...(b.verified ? [{ icon: ShieldCheck, text: t.profile.identity, tone: "bg-emerald-50 text-emerald-600" }] : []),
                  { icon: ClipboardCheck, text: t.profile.reviewed, tone: "bg-ink-100 text-ink-500" },
                  { icon: Route, text: serves, tone: "bg-ink-100 text-ink-500" },
                  { icon: CalendarDays, text: since, tone: "bg-ink-100 text-ink-500" },
                ].map(({ icon: Icon, text, tone }) => (
                  <li key={text} className="flex items-center gap-3 py-3">
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${tone}`}>
                      <Icon aria-hidden className="size-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${box} animate-rise [animation-delay:200ms]`}>
              <h2 className="font-display text-base font-semibold text-ink-900">{t.profile.shareTitle}</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{t.profile.shareText}</p>
              <ShareProfile
                name={b.name}
                labels={{
                  whatsapp: t.profile.shareWhatsapp,
                  copy: t.profile.copyLink,
                  copied: t.profile.copied,
                  more: t.profile.more,
                  message: fmt(t.profile.shareMessage, { name: b.name }),
                }}
              />
            </section>
            <p className="px-1 text-[11px] text-ink-400">{t.profile.footnote}</p>
          </aside>
        </div>

        {related.length > 0 && base && (
          <section className="reveal mt-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="section-title">{fmt(t.profile.related, { city: cityName(base, lang) })}</h2>
              <Link href={href(`/${base.slug}`)} className="link-arrow text-[13px]">
                {fmt(t.profile.viewAllIn, { city: cityName(base, lang) })}
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <BusinessCard key={c.slug} card={c} labels={cardLabels(t)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
