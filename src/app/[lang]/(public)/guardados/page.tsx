import type { Metadata } from "next";
import { cardLabels } from "@/components/business-card";
import { PageIntro } from "@/components/page-intro";
import { SavedList } from "@/components/saved-list";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.saved.title, robots: { index: false } };
}

export default async function SavedPage() {
  const { t, lang, href } = await getI18n();
  return (
    <div className="container-page pt-14">
      <PageIntro eyebrow={t.saved.eyebrow} title={t.saved.title} text={t.saved.text} />
      <p className="mt-2 text-[11px] text-ink-400">{t.saved.note}</p>
      <div className="mt-10">
        <SavedList lang={lang} labels={cardLabels(t)} text={t.saved} exploreHref={href("/buscar")} />
      </div>
    </div>
  );
}
