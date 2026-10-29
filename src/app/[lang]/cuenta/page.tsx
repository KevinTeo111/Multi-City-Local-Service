import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/dashboard/dashboard-shell";
import { SavedTileValue } from "@/components/dashboard/saved-tile";
import { StatTile, ViewsChart } from "@/components/dashboard/stats";
import { fmt, plural } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { categoryName, cityName, localizeBusiness } from "@/lib/localize";
import { getCategory, getCity, getOwnBusiness, toPublic } from "@/lib/queries";

export default async function AccountHome() {
  const { t, lang, href } = await getI18n();
  const own = getOwnBusiness();
  const b = localizeBusiness(toPublic(own), lang);
  const s = own.stats;
  const category = getCategory(b.categories[0]);
  const cities = b.cities.map(getCity).filter((c) => c !== undefined).map((c) => cityName(c, lang));
  const c = t.account.cards;

  const tiles = [
    { label: c.profile, value: t.status[b.status], hint: c.profileHint },
    { label: c.areas, value: plural(cities.length, c.areasValue), hint: c.areasHint },
    { label: c.saved, value: <SavedTileValue template={c.savedValue} />, hint: c.savedHint },
  ];

  return (
    <>
      <PageTitle eyebrow={t.account.eyebrow} title={fmt(t.account.hello, { name: b.name })} description={t.account.overviewText} />

      <div className="grid gap-4 md:grid-cols-3">
        {tiles.map((tile, i) => (
          <div key={tile.label} className="card animate-rise p-6" style={{ animationDelay: `${i * 60}ms` }}>
            <p className="text-xs text-ink-500">{tile.label}</p>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-900">{tile.value}</p>
            <p className="mt-2 text-xs text-ink-500">{tile.hint}</p>
          </div>
        ))}
      </div>

      <section className="panel reveal mt-5 p-8">
        <span className="tag">{t.account.live}</span>
        <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink-900">{b.name}</h2>
        <p className="mt-3 text-sm text-ink-600">{b.tagline}</p>
        <p className="mt-3 text-sm text-ink-600">
          {category ? categoryName(category, lang) : ""} · {cities.join(", ")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={href("/cuenta/perfil")} className="btn-primary group h-11">
            {t.account.editProfile}
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link href={href(`/negocio/${b.slug}`)} className="btn-outline h-11">
            {t.account.viewPublic}
          </Link>
        </div>
      </section>

      <section className="reveal mt-12">
        <h2 className="section-title">{t.account.statsTitle}</h2>
        <p className="mt-1.5 text-sm text-ink-500">{t.account.statsText}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile label={t.account.stats.views} value={s.views} />
          <StatTile label={t.account.stats.reveals} value={s.phoneReveals} />
          <StatTile label={t.account.stats.calls} value={s.callClicks} />
          <StatTile label={t.account.stats.whatsapp} value={s.whatsappClicks} />
        </div>
        <div className="mt-4">
          <ViewsChart title={t.account.stats.chartTitle} values={s.viewsByDay} />
        </div>
      </section>

      <section className="card reveal mt-12 p-8">
        <h2 className="font-display text-xl font-bold text-ink-900">{t.account.tipsTitle}</h2>
        <ol className="mt-4 divide-y divide-ink-200">
          {t.account.tips.map((tip, i) => (
            <li key={tip} className="flex gap-4 py-3.5 text-sm text-ink-800">
              <span className="tabular-nums text-ink-400">{String(i + 1).padStart(2, "0")}</span> {tip}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
