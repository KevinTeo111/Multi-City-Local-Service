"use client";

import { useSaved } from "@/lib/saved";

/** "(2)" next to "Saved"; nothing when the list is empty. */
export function SavedCount() {
  const n = useSaved().length;
  return n > 0 ? <span className="tabular-nums">({n})</span> : null;
}
