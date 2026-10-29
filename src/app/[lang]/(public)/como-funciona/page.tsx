import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { localePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getI18n();
  return {
    title: t.how.title,
    description: t.how.text,
    alternates: { canonical: localePath(lang, "/como-funciona"), languages: { es: "/como-funciona", en: "/en/como-funciona" } },
  };
}

export default async function HowItWorksPage() {
  const { t, href } = await getI18n();
  const links = [href("/servicios"), href("/buscar"), href("/buscar")];

  return (
    <div className="container-page pt-14">
      <PageIntro eyebrow={t.how.eyebrow} title={t.how.title} text={t.how.text} />

      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {t.how.steps.map((s, i) => (
          <li key={s.title} className="animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <Link href={links[i]} className="card-link group flex h-full flex-col p-8">
              <span className="flex size-11 items-center justify-center rounded-full bg-brand-50 text-sm text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-8 font-display text-xl font-bold text-ink-900">{s.title}</span>
              <span className="mt-3 text-sm leading-relaxed text-ink-500">{s.text}</span>
              <span className="link-arrow mt-10 text-xs">
                {s.link}{" "}
                <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <section className="reveal mx-auto mt-16 max-w-3xl">
        <h2 className="section-title">{t.how.faqTitle}</h2>
        <div className="mt-6 divide-y divide-ink-200 border-y border-ink-200">
          {t.how.faq.map((f, i) => (
            <details key={f.q} open={i === 0} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] text-ink-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown aria-hidden className="size-4 shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3 animate-rise text-sm leading-relaxed text-ink-500">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
