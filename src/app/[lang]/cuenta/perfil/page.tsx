import { Hourglass } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PageTitle } from "@/components/dashboard/dashboard-shell";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getI18n } from "@/i18n/server";
import { emptyProfile, toProfileValues } from "@/lib/profile";
import { profileFormProps } from "@/lib/profile-form-props";
import { getOwnBusiness } from "@/lib/queries";

export default async function ProfilePage({ searchParams }: PageProps<"/[lang]/cuenta/perfil">) {
  const { t, href } = await getI18n();
  return (
    <>
      <PageTitle
        eyebrow={t.account.profileEyebrow}
        title={t.account.profileTitle}
        description={t.account.profileText}
        action={
          <Link href={href(`/negocio/${getOwnBusiness().slug}`)} className="btn-outline h-11">
            {t.form.previewProfile}
          </Link>
        }
      />
      <Suspense>
        <ProfileEditor searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ProfileEditor({ searchParams }: { searchParams: PageProps<"/[lang]/cuenta/perfil">["searchParams"] }) {
  const { t, lang } = await getI18n();
  // ?nuevo=1 comes from the registration form: start with an empty profile.
  const isNew = (await searchParams).nuevo === "1";
  const initial = isNew ? emptyProfile : toProfileValues(getOwnBusiness(), lang);

  return (
    <>
      {isNew && (
        <div className="mb-6 flex animate-rise items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
          <Hourglass aria-hidden className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-semibold">{t.account.welcomeTitle}</p>
            <p className="mt-0.5">{t.account.welcomeText}</p>
          </div>
        </div>
      )}
      <ProfileForm initial={initial} mode="owner" {...profileFormProps(lang, t)} />
    </>
  );
}
