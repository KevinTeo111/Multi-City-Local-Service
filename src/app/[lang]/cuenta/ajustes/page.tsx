import { PageTitle } from "@/components/dashboard/dashboard-shell";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { getI18n } from "@/i18n/server";
import { getOwnBusiness } from "@/lib/queries";

export default async function SettingsPage() {
  const { t, lang } = await getI18n();
  return (
    <>
      <PageTitle title={t.account.settingsTitle} description={t.account.settingsText} />
      <SettingsForm t={t.account.settings} email={getOwnBusiness().email ?? ""} language={lang} />
    </>
  );
}
