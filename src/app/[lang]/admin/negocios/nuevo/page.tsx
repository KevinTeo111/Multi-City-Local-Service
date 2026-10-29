import { PageTitle } from "@/components/dashboard/dashboard-shell";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getI18n } from "@/i18n/server";
import { emptyProfile } from "@/lib/profile";
import { profileFormProps } from "@/lib/profile-form-props";

export default async function NewBusinessPage() {
  const { t, lang } = await getI18n();
  return (
    <>
      <PageTitle title={t.admin.newTitle} description={t.admin.newText} />
      <ProfileForm initial={emptyProfile} mode="admin-new" {...profileFormProps(lang, t)} />
    </>
  );
}
