"use client";

import { useEffect } from "react";

// Profile pages are prerendered, so views are counted from the browser.
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/negocios/${slug}/evento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "view" }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);
  return null;
}
