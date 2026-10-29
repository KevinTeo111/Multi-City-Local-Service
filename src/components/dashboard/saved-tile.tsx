"use client";

import { fmt } from "@/i18n/config";
import { useSaved } from "@/lib/saved";

/** "1 saved": the shortlist lives in the browser, so this is read client-side. */
export function SavedTileValue({ template }: { template: string }) {
  return <>{fmt(template, { n: useSaved().length })}</>;
}
