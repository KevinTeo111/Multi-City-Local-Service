import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthSplit } from "@/components/auth-split";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.registerMeta, description: t.auth.registerMetaText };
}

export default async function RegisterPage() {
  const { t, href } = await getI18n();
  return (
    <AuthSplit title={t.auth.registerHeadline} text={t.auth.registerText}>
      <AuthForm mode="register" t={t.auth} links={{ next: `${href("/cuenta/perfil")}?nuevo=1`, other: href("/ingresar"), back: href("/") }} />
    </AuthSplit>
  );
}
