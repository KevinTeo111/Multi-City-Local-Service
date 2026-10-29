"use client";

import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

/** "Share this profile": WhatsApp, copy link, and the phone's own share sheet. */
export function ShareProfile({
  name,
  labels,
}: {
  name: string;
  labels: { whatsapp: string; copy: string; copied: string; more: string; message: string };
}) {
  const [copied, setCopied] = useState(false);
  const url = () => window.location.href.split("#")[0];

  async function copy() {
    await navigator.clipboard.writeText(url());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function more() {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: name, text: labels.message, url: url() });
    } catch {
      // Closing the share sheet is not an error worth showing.
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${labels.message} ${url()}`)}`, "_blank", "noopener")}
        className="btn-whatsapp h-10 w-full"
      >
        <MessageCircle aria-hidden className="size-4" /> {labels.whatsapp}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={copy} className="btn-ghost h-9 px-3 font-medium">
          {copied ? <Check aria-hidden className="size-4 text-emerald-600" /> : <Copy aria-hidden className="size-4" />}
          <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
        </button>
        <button type="button" onClick={more} className="btn-ghost h-9 px-3 font-medium">
          <Share2 aria-hidden className="size-4" /> {labels.more}
        </button>
      </div>
    </div>
  );
}
