import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { BrandMark } from "./brand-mark";
import { LangSwitch } from "./lang-switch";

export async function SiteFooter() {
  const { t, lang, href } = await getI18n();
  const link = "text-[13px] text-ink-600 transition hover:text-brand-500";

  return (
    <footer className="container-page mt-20">
      <div className="flex flex-col gap-8 border-t border-ink-200 py-10 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <BrandMark size="sm" />
          <p className="text-[13px] text-ink-500">{t.footer.about}</p>
        </div>
        <nav className="flex flex-wrap gap-x-7 gap-y-3" aria-label={t.footer.explore}>
          <Link href={href("/servicios")} className={link}>{t.nav.explore}</Link>
          <Link href={href("/ciudades")} className={link}>{t.nav.cities}</Link>
          <Link href={href("/como-funciona")} className={link}>{t.nav.howItWorks}</Link>
          <Link href={href("/cuenta")} className={link}>{t.footer.ownerDemo}</Link>
          <Link href={href("/admin")} className={link}>{t.footer.adminDemo}</Link>
          <Link href={href("/registro")} className={`${link} inline-flex items-center gap-1`}>
            {t.footer.providers} <ArrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </nav>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 py-5 text-xs text-ink-500">
        <p>© 2026 nearby · {t.footer.note}</p>
        <LangSwitch to={lang === "es" ? "en" : "es"} label={t.nav.switchLabel} short={t.nav.switchLabel} className="text-xs font-medium" />
      </div>
    </footer>
  );
}
