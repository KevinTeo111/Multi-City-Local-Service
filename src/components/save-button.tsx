"use client";

import { Heart } from "lucide-react";
import { fmt } from "@/i18n/config";
import type { Dictionary } from "@/i18n/es";
import { toggleSaved, useSaved } from "@/lib/saved";

export function SaveButton({
  slug,
  name,
  labels,
  variant = "icon",
}: {
  slug: string;
  name: string;
  labels: Dictionary["save"];
  variant?: "icon" | "button";
}) {
  const saved = useSaved().includes(slug);
  const label = fmt(saved ? labels.remove : labels.add, { name });
  // `key` remounts the icon so the little pop plays on every toggle.
  const heart = (
    <Heart key={String(saved)} aria-hidden className={`${variant === "icon" ? "size-3.5" : "size-4"} ${saved ? "animate-[rise_0.3s_ease-out] fill-brand-500 text-brand-500" : ""}`} />
  );

  if (variant === "button") {
    return (
      <button type="button" onClick={() => toggleSaved(slug)} aria-pressed={saved} aria-label={label} className="btn-outline h-11 px-5">
        {heart}
        {saved ? labels.buttonSaved : labels.button}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleSaved(slug)}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full transition hover:scale-110 ${
        saved ? "bg-brand-50" : "text-ink-400 hover:bg-ink-100 hover:text-brand-500"
      }`}
    >
      {heart}
    </button>
  );
}
