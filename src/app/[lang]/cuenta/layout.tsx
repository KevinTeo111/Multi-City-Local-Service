import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.account.area, robots: { index: false } };
}

export default async function AccountLayout({ children }: LayoutProps<"/[lang]/cuenta">) {
  const { t, href } = await getI18n();
  const n = t.account.nav;
  return (
    <DashboardShell
      label={t.account.workspace}
      nav={[
        { href: href("/cuenta"), label: n.overview },
        { href: href("/cuenta/perfil"), label: n.profile },
        { href: href("/cuenta/ajustes"), label: n.settings },
        { href: href("/guardados"), label: n.saved, external: true },
        { href: href("/"), label: n.back, external: true },
        { href: href("/ingresar"), label: n.logout, external: true },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
