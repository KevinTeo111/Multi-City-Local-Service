import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.overviewTitle, robots: { index: false } };
}

export default async function AdminLayout({ children }: LayoutProps<"/[lang]/admin">) {
  const { t, href } = await getI18n();
  const n = t.admin.nav;
  return (
    <DashboardShell
      label={t.admin.area}
      nav={[
        { href: href("/admin"), label: n.overview },
        { href: href("/admin/negocios"), label: n.businesses },
        { href: href("/admin/negocios/nuevo"), label: n.add },
        { href: href("/admin/catalogo"), label: n.catalog },
        { href: href("/"), label: t.account.nav.back, external: true },
        { href: href("/ingresar"), label: t.account.nav.logout, external: true },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
