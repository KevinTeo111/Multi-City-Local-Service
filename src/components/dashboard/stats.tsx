import { type Locale, fmt, intlLocale } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { REPORT_END_DATE } from "@/lib/data";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat("en-US");

export function StatTile({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: number;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="card p-6 transition hover:border-brand-200">
      <p className="flex items-center gap-2 text-xs text-ink-500">
        {icon}
        {label}
      </p>
      <p className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-900" title={full.format(value)}>
        {value >= 10000 ? compact.format(value) : full.format(value)}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

function dayLabels(count: number, lang: Locale) {
  const end = new Date(`${REPORT_END_DATE}T12:00:00Z`);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - (count - 1 - i));
    return {
      short: d.toLocaleDateString(intlLocale[lang], { day: "numeric", month: "short", timeZone: "UTC" }),
      long: d.toLocaleDateString(intlLocale[lang], { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }),
    };
  });
}

/** Single-series bar chart of profile views per day. */
export async function ViewsChart({ title, values }: { title: string; values: number[] }) {
  const { t, lang } = await getI18n();
  const max = Math.max(...values, 1);
  // Round the axis top up to a friendly number.
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const labels = dayLabels(values.length, lang);
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-base font-bold text-ink-900">{title}</h2>
        <p className="text-sm text-ink-500">
          {t.chart.total} <span className="font-semibold text-ink-900">{full.format(total)}</span>
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        {/* Y axis */}
        <div className="flex h-48 flex-col justify-between pb-0 text-right text-[11px] tabular-nums text-ink-400" aria-hidden>
          <span>{full.format(top)}</span>
          <span>{full.format(top / 2)}</span>
          <span>0</span>
        </div>
        <div className="relative flex-1">
          {/* Recessive gridlines */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48" aria-hidden>
            <div className="absolute inset-x-0 top-0 border-t border-dashed border-ink-100" />
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-ink-100" />
            <div className="absolute inset-x-0 bottom-0 border-t border-ink-200" />
          </div>
          <ul className="relative flex h-48 items-end gap-[2px]" aria-label={title}>
            {values.map((v, i) => (
              <li key={i} className="group relative flex h-full flex-1 items-end justify-center">
                <button
                  type="button"
                  className="flex h-full w-full items-end justify-center focus:outline-none"
                  aria-label={`${labels[i].long}: ${fmt(t.chart.visits, { n: v })}`}
                >
                  <span
                    className="w-full max-w-7 rounded-t-[4px] bg-chart transition-opacity group-hover:opacity-80 group-focus-within:opacity-80"
                    style={{ height: `${(v / top) * 100}%` }}
                  />
                </button>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs text-white shadow-lg group-focus-within:block group-hover:block"
                >
                  <span className="block text-ink-300 capitalize">{labels[i].long}</span>
                  <span className="font-semibold">{fmt(t.chart.visits, { n: v })}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between text-[11px] text-ink-400" aria-hidden>
            <span>{labels[0].short}</span>
            <span>{labels[Math.floor(labels.length / 2)].short}</span>
            <span>{labels[labels.length - 1].short}</span>
          </div>
        </div>
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-xs font-medium text-ink-500 hover:text-ink-800">{t.chart.asTable}</summary>
        <table className="mt-3 w-full text-left text-xs">
          <thead className="text-ink-500">
            <tr>
              <th className="py-1 font-medium">{t.chart.day}</th>
              <th className="py-1 text-right font-medium">{t.chart.views}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {values.map((v, i) => (
              <tr key={i} className="border-t border-ink-100">
                <td className="py-1 capitalize">{labels[i].long}</td>
                <td className="py-1 text-right">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

export function sumSeries(series: number[][]) {
  return series[0]?.map((_, i) => series.reduce((acc, s) => acc + (s[i] ?? 0), 0)) ?? [];
}
