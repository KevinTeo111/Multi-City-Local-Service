import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthSplit } from "@/components/auth-split";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.loginMeta, robots: { index: false } };
}

export default async function LoginPage() {
  const { t, href } = await getI18n();
  return (
    <AuthSplit title={t.auth.loginHeadline} text={t.auth.loginText}>
      <AuthForm mode="login" t={t.auth} links={{ next: href("/cuenta"), other: href("/registro"), back: href("/") }} />
    </AuthSplit>
  );
}
