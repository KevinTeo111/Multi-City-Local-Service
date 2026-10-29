import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { site } from "@/lib/site";
import { BrandWordmark } from "./brand-wordmark";

export async function BrandMark({ size = "md" }: { size?: "md" | "sm" }) {
  const { t, href } = await getI18n();
  return (
    <Link href={href("/")} className="flex shrink-0 items-center rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/50" aria-label={`${site.name} ${t.brand.home}`}>
      <BrandWordmark size={size} />
    </Link>
  );
}
