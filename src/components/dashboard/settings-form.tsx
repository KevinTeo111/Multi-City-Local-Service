"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Dictionary } from "@/i18n/es";

// UI-only for the preview. In production: Supabase Auth updateUser + a
// notification_prefs column on the owner's profile.
export function SettingsForm({ t, email, language }: { t: Dictionary["account"]["settings"]; email: string; language: "es" | "en" }) {
  const [saved, setSaved] = useState(false);
  const section = "card p-6";
  const title = "text-xl font-extrabold text-ink-700";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
      onChange={() => setSaved(false)}
      className="max-w-3xl space-y-6"
    >
      {saved && (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 aria-hidden className="size-4" /> {t.saved}
        </p>
      )}
      <section className={section}>
        <h2 className={title}>{t.login}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label">{t.email}</label>
            <input id="email" type="email" defaultValue={email} autoComplete="email" className="input h-11" />
          </div>
          <div>
            <label htmlFor="new-password" className="label">{t.newPassword}</label>
            <input id="new-password" type="password" minLength={8} autoComplete="new-password" className="input h-11" />
          </div>
        </div>
      </section>

      <section className={section}>
        <h2 className={title}>{t.prefs}</h2>
        <div className="mt-5 max-w-xs">
          <label htmlFor="language" className="label">{t.language}</label>
          <select id="language" defaultValue={language} className="input h-11 cursor-pointer">
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <fieldset className="mt-6">
          <legend className="label">{t.emails}</legend>
          <div className="space-y-2">
            {[t.emailApproved, t.emailWeekly].map((label) => (
              <label key={label} className="flex items-center gap-2.5 text-sm text-ink-800">
                <input type="checkbox" defaultChecked className="size-4 accent-ink-700" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary px-8 py-3">{t.save}</button>
      </div>

      <section className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-extrabold text-red-800">{t.danger}</h2>
        <p className="mt-1 text-sm text-ink-600">{t.dangerText}</p>
        <button type="button" className="btn mt-4 border border-red-300 bg-white text-red-800 hover:bg-red-50">
          {t.delete}
        </button>
      </section>
    </form>
  );
}
