import { ArrowRight, Eye, Hourglass, PhoneCall, Store } from "lucide-react";
import Link from "next/link";
import { BusinessLogo } from "@/components/business-logo";
import { PageTitle } from "@/components/dashboard/dashboard-shell";
import { StatTile, ViewsChart, sumSeries } from "@/components/dashboard/stats";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { cityName } from "@/lib/localize";
import { countByCity, getCity, listAllBusinesses, listCities } from "@/lib/queries";

const nf = new Intl.NumberFormat("en-US");

export default async function AdminHome() {
  const { t, lang, href } = await getI18n();
  const all = listAllBusinesses();
  const approved = all.filter((b) => b.status === "aprobado");
  const pending = all.filter((b) => b.status === "pendiente");

  const totals = approved.reduce(
    (acc, b) => ({
      views: acc.views + b.stats.views,
      reveals: acc.reveals + b.stats.phoneReveals,
      calls: acc.calls + b.stats.callClicks,
      whatsapp: acc.whatsapp + b.stats.whatsappClicks,
    }),
    { views: 0, reveals: 0, calls: 0, whatsapp: 0 },
  );
  const daily = sumSeries(approved.map((b) => b.stats.viewsByDay));
  const top = [...approved].sort((a, b) => b.stats.callClicks - a.stats.callClicks).slice(0, 8);
  const cityCounts = listCities()
    .map((c) => ({ ...c, count: countByCity(c.slug) }))
    .sort((a, b) => b.count - a.count);
  const maxCity = Math.max(...cityCounts.map((c) => c.count), 1);

  return (
    <>
      <PageTitle
        title={t.admin.overviewTitle}
        description={t.admin.overviewText}
        action={
          <Link href={href("/admin/negocios/nuevo")} className="btn-primary px-6 py-3">
            {t.admin.addBusiness}
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label={t.admin.stats.published} value={approved.length} hint={fmt(t.admin.stats.total, { n: all.length })} icon={<Store aria-hidden className="size-4" />} />
        <StatTile label={t.admin.stats.pending} value={pending.length} hint={t.admin.stats.pendingHint} icon={<Hourglass aria-hidden className="size-4" />} />
        <StatTile label={t.admin.stats.views} value={totals.views} hint={fmt(t.admin.stats.reveals, { n: nf.format(totals.reveals) })} icon={<Eye aria-hidden className="size-4" />} />
        <StatTile label={t.admin.stats.calls} value={totals.calls} hint={fmt(t.admin.stats.whatsapp, { n: nf.format(totals.whatsapp) })} icon={<PhoneCall aria-hidden className="size-4" />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <ViewsChart title={t.admin.stats.chartTitle} values={daily} />

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink-700">{t.admin.toReview}</h2>
            <Link href={`${href("/admin/negocios")}?estado=pendiente`} className="text-sm font-semibold text-ink-700 underline-offset-2 hover:underline">
              {t.admin.seeAll}
            </Link>
          </div>
          {pending.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">{t.admin.noPending}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {pending.map((b) => {
                const base = getCity(b.baseCity);
                return (
                  <li key={b.id}>
                    <Link href={href(`/admin/negocios/${b.id}`)} className="flex items-center gap-3 rounded-lg p-2 hover:bg-ink-50">
                      <BusinessLogo name={b.name} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink-900">{b.name}</span>
                        <span className="text-xs text-ink-500">
                          {base ? cityName(base, lang) : ""} · {b.createdAt}
                        </span>
                      </span>
                      <ArrowRight aria-hidden className="size-4 text-ink-400" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <section className="card overflow-hidden">
          <h2 className="p-5 pb-3 text-lg font-extrabold text-ink-700">{t.admin.topTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-600">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">{t.admin.table.business}</th>
                  <th className="px-3 py-2.5 text-right font-semibold">{t.admin.table.views}</th>
                  <th className="px-3 py-2.5 text-right font-semibold">{t.admin.table.reveals}</th>
                  <th className="px-3 py-2.5 text-right font-semibold">{t.admin.table.calls}</th>
                  <th className="px-5 py-2.5 text-right font-semibold">{t.admin.table.whatsapp}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 tabular-nums">
                {top.map((b) => (
                  <tr key={b.id}>
                    <td className="px-5 py-2.5 font-semibold">
                      <Link href={href(`/negocio/${b.slug}`)} className="text-ink-800 hover:underline">{b.name}</Link>
                    </td>
                    <td className="px-3 py-2.5 text-right">{nf.format(b.stats.views)}</td>
                    <td className="px-3 py-2.5 text-right">{nf.format(b.stats.phoneReveals)}</td>
                    <td className="px-3 py-2.5 text-right font-bold">{nf.format(b.stats.callClicks)}</td>
                    <td className="px-5 py-2.5 text-right">{nf.format(b.stats.whatsappClicks)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-extrabold text-ink-700">{t.admin.byCity}</h2>
          <ul className="mt-4 space-y-3">
            {cityCounts.map((c) => (
              <li key={c.slug} className="text-sm">
                <div className="flex justify-between">
                  <span>{cityName(c, lang)}</span>
                  <span className="font-bold tabular-nums">{c.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-ink-100" aria-hidden>
                  <div className="h-full rounded-full bg-chart" style={{ width: `${(c.count / maxCity) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
