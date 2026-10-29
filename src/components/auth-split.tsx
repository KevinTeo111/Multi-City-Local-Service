import { Check } from "lucide-react";
import Image from "next/image";
import { getI18n } from "@/i18n/server";
import livingRoom from "../../public/img/living-room.jpg";

/** Sign-up / log-in: a short pitch with a photo on the left, the form card on the right. */
export async function AuthSplit({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  const { t } = await getI18n();
  return (
    <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-24 lg:px-24">
      <div className="animate-rise">
        <p className="eyebrow">{t.auth.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-[2.6rem]">{title}</h1>
        <p className="mt-4 text-ink-500">{text}</p>
        <div className="mt-9 overflow-hidden rounded-2xl">
          <Image src={livingRoom} alt="" sizes="(min-width: 1024px) 36rem, 100vw" className="aspect-[2.75/1] w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
        </div>
        <ul className="mt-6 space-y-3 text-[13px] text-ink-600">
          {t.auth.checks.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <Check aria-hidden className="size-3.5 text-brand-500" /> {c}
            </li>
          ))}
        </ul>
      </div>
      {children}
    </div>
  );
}
