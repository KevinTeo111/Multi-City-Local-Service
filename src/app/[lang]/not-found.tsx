import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { t, href } = await getI18n();
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <BrandMark />
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-700">{t.notFound.title}</h1>
      <p className="max-w-md text-ink-600">{t.notFound.text}</p>
      <div className="mt-4 flex gap-2">
        <Link href={href("/")} className="btn-primary">{t.notFound.home}</Link>
        <Link href={href("/buscar")} className="btn-outline">{t.notFound.search}</Link>
      </div>
    </main>
  );
}
