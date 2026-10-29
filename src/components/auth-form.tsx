"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/i18n/es";

// UI-only for the preview. In production: Supabase Auth (sign up / sign in);
// a new business starts as "pendiente" and waits for admin approval.
export function AuthForm({
  mode,
  t,
  links,
}: {
  mode: "login" | "register";
  t: Dictionary["auth"];
  links: { next: string; other: string; back: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const register = mode === "register";

  return (
    <div className="card animate-rise p-9 [animation-delay:120ms]">
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">{register ? t.registerCard : t.loginCard}</h2>
      <p className="mt-3 text-sm text-ink-500">
        {register ? t.haveAccount : t.newHere}{" "}
        <Link href={links.other} className="text-brand-500 hover:text-brand-700 hover:underline">
          {register ? t.login : t.createAccount}
        </Link>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          router.push(links.next);
        }}
        className="mt-6 space-y-4"
      >
        {register && (
          <div>
            <label htmlFor="name" className="label">{t.name}</label>
            <input id="name" required autoComplete="name" placeholder={t.namePh} className="input h-11" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="label">{t.email}</label>
          <input id="email" type="email" required autoComplete="email" placeholder={t.emailPh} className="input h-11" />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary group h-12 w-full">
          {submitting ? t.working : register ? t.createDemo : t.continueDemo}
          <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </form>
      <p className="mt-4 text-[11px] text-ink-400">{t.previewNote}</p>
      <Link href={links.back} className="group mt-7 inline-flex items-center gap-1.5 text-[13px] text-brand-500 hover:text-brand-700">
        <ArrowLeft aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-0.5" /> {t.back}
      </Link>
    </div>
  );
}
