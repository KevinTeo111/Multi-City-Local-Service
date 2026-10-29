import type { Tone } from "@/lib/types";
import { toneSolid } from "./category-icon";

// Business avatar: the uploaded logo, a colored letter, or gray initials.
export function BusinessLogo({ name, src, tone, size = "md" }: { name: string; src?: string; tone?: Tone; size?: "sm" | "md" | "lg" | "xl" }) {
  const words = name.split(/\s+/).filter((w) => w.length > 2 || /^[A-Z]/.test(w));
  const initials = words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const sizes = { sm: "size-10 text-sm", md: "size-12 text-sm", lg: "size-20 text-2xl", xl: "size-24 text-3xl" };
  const letter = { sm: "text-lg", md: "text-xl", lg: "text-3xl", xl: "text-4xl" };
  const frame = `${sizes[size]} shrink-0 rounded-full`;

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={`${frame} border border-ink-200 bg-white object-cover`} />;
  }
  if (tone) {
    return (
      <div aria-hidden className={`${frame} ${letter[size]} flex items-center justify-center font-medium text-white ${toneSolid(tone)}`}>
        {initials[0]}
      </div>
    );
  }
  return (
    <div aria-hidden className={`${frame} flex items-center justify-center border border-ink-200 bg-ink-100 font-medium text-ink-500`}>
      {initials}
    </div>
  );
}
