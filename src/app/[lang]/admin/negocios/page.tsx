import Link from "next/link";
import { Suspense } from "react";
import { PageTitle } from "@/components/dashboard/dashboard-shell";
import { ModerationTable } from "@/components/dashboard/moderation-table";
import { getI18n } from "@/i18n/server";
import { moderationRows } from "@/lib/admin";
import type { ListingStatus } from "@/lib/types";

const statuses: ListingStatus[] = ["pendiente", "aprobado", "rechazado", "suspendido"];

export default async function AdminBusinessesPage({ searchParams }: PageProps<"/[lang]/admin/negocios">) {
  const { t, href } = await getI18n();
  return (
    <>
      <PageTitle
        title={t.admin.businessesTitle}
        description={t.admin.businessesText}
        action={
          <Link href={href("/admin/negocios/nuevo")} className="btn-primary px-6 py-3">
            {t.admin.addBusiness}
          </Link>
        }
      />
      <Suspense>
        <Table searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Table({ searchParams }: { searchParams: PageProps<"/[lang]/admin/negocios">["searchParams"] }) {
  const { t, lang, href } = await getI18n();
  const estado = (await searchParams).estado;
  const initialTab = statuses.find((s) => s === estado) ?? "todos";
  return (
    <ModerationTable
      rows={moderationRows(lang)}
      initialTab={initialTab}
      t={t.admin.moderation}
      statusLabels={t.status}
      editHref={href("/admin/negocios")}
    />
  );
}
