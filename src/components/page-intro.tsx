import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/** Eyebrow + title + one line, as at the top of every content page. */
export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="animate-rise">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title mt-3">{title}</h1>
      {text && <p className="mt-3 max-w-2xl text-ink-500">{text}</p>}
    </div>
  );
}

/** Soft gray call-to-action band. */
export function CtaBand({ title, text, href, label, variant = "primary" }: { title: string; text: string; href: string; label: string; variant?: "primary" | "outline" }) {
  return (
    <section className="panel reveal mt-10 flex flex-col gap-5 px-8 py-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-bold text-ink-900">{title}</h2>
        <p className="mt-2 text-sm text-ink-500">{text}</p>
      </div>
      <Link href={href} className={`${variant === "primary" ? "btn-primary" : "btn-outline"} group h-11 px-6`}>
        {label} <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
