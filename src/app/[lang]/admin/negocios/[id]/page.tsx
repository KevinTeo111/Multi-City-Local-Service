import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/dashboard/dashboard-shell";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { toProfileValues } from "@/lib/profile";
import { profileFormProps } from "@/lib/profile-form-props";
import { getBusinessById, listAllBusinesses } from "@/lib/queries";

export function generateStaticParams() {
  return listAllBusinesses().map((b) => ({ id: b.id }));
}

export default async function EditBusinessPage({ params }: PageProps<"/[lang]/admin/negocios/[id]">) {
  const { id } = await params;
  const b = getBusinessById(id);
  if (!b) notFound();
  const { t, lang, href } = await getI18n();

  return (
    <>
      <PageTitle
        title={b.name}
        description={`${fmt(t.admin.created, { date: b.createdAt })} · ${b.addedByAdmin ? t.admin.byAdmin : t.admin.byOwner}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={b.status} label={t.status[b.status]} />
            {b.status === "aprobado" && (
              <Link href={href(`/negocio/${b.slug}`)} className="btn-outline">
                {t.admin.viewPublic} <ExternalLink aria-hidden className="size-4" />
              </Link>
            )}
            <button type="submit" form="profile-form" className="btn-primary px-6">
              {t.form.saveChanges}
            </button>
          </div>
        }
      />
      <ProfileForm initial={toProfileValues(b, lang)} mode="admin-edit" {...profileFormProps(lang, t)} />
    </>
  );
}
