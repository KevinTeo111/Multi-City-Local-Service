import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { BrandMark } from "./brand-mark";
import { HeaderNav } from "./header-nav";
import { LangMenu } from "./lang-switch";
import { SavedCount } from "./saved-count";

export async function SiteHeader() {
  const { t, lang, href } = await getI18n();
  const links = [
    { href: href("/servicios"), label: t.nav.explore, match: [href("/servicios"), href("/buscar")] },
    { href: href("/como-funciona"), label: t.nav.howItWorks, match: [href("/como-funciona")] },
    { href: href("/ciudades"), label: t.nav.cities, match: [href("/ciudades")] },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/95 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center gap-8">
        <BrandMark size="sm" />
        <HeaderNav links={links} label={t.nav.main} />

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <LangMenu current={lang} label={t.nav.language} />
          <Link
            href={href("/guardados")}
            className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 sm:flex"
          >
            <Heart aria-hidden className="size-4" /> {t.nav.saved} <SavedCount />
          </Link>
          <Link
            href={href("/registro")}
            className="hidden rounded-md px-2 py-1.5 text-sm text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 lg:block"
          >
            {t.nav.getListed}
          </Link>
          <Link href={href("/ingresar")} className="btn-primary hidden h-8 px-3 text-[13px] sm:inline-flex">
            {t.nav.login}
          </Link>

          <details className="group relative md:hidden">
            <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md text-ink-700 hover:bg-ink-100 [&::-webkit-details-marker]:hidden">
              <Menu className="size-5" aria-hidden />
              <span className="sr-only">{t.nav.openMenu}</span>
            </summary>
            <div className="absolute right-0 mt-2 w-60 animate-[rise_0.15s_ease-out] rounded-lg border border-ink-200 bg-white p-1.5 shadow-lg">
              {[...links, { href: href("/guardados"), label: t.nav.saved }, { href: href("/registro"), label: t.nav.getListed }].map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-ink-100">
                  {l.label}
                </Link>
              ))}
              <Link href={href("/ingresar")} className="btn-primary mt-1 h-9 w-full">
                {t.nav.login}
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
