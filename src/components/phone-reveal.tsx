"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import type { Dictionary } from "@/i18n/es";

type Contact = { phone: string; whatsapp?: string };

function track(slug: string, type: "call_click" | "whatsapp_click") {
  const body = JSON.stringify({ type });
  // sendBeacon survives the page switching to the phone / WhatsApp app.
  if (!navigator.sendBeacon?.(`/api/negocios/${slug}/evento`, new Blob([body], { type: "application/json" }))) {
    fetch(`/api/negocios/${slug}/evento`, { method: "POST", body, keepalive: true });
  }
}

/**
 * "Show contact details": the phone number is fetched only when asked for, so
 * it never appears in the page HTML and every reveal is counted.
 */
export function ContactPanel({
  slug,
  hasWhatsapp,
  email,
  labels,
}: {
  slug: string;
  hasWhatsapp: boolean;
  email?: string;
  labels: Dictionary["phone"] & { show: string };
}) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function reveal() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/negocios/${slug}/telefono`, { method: "POST" });
      if (!res.ok) throw new Error();
      setContact(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (!contact) {
    return (
      <div>
        <button type="button" onClick={reveal} disabled={loading} className="btn-primary h-10 w-full">
          <Phone aria-hidden className="size-4" />
          {loading ? labels.loading : labels.show}
        </button>
        {error && <p className="mt-2 text-xs text-red-700" role="alert">{labels.error}</p>}
      </div>
    );
  }

  const tel = contact.phone.replace(/[^\d+]/g, "");
  return (
    <div className="animate-rise space-y-2">
      <a href={`tel:${tel}`} onClick={() => track(slug, "call_click")} className="btn-primary h-10 w-full">
        <Phone aria-hidden className="size-4" /> {labels.call} {contact.phone}
      </a>
      {hasWhatsapp && contact.whatsapp && (
        <a
          href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(labels.waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(slug, "whatsapp_click")}
          className="btn-whatsapp h-10 w-full"
        >
          <MessageCircle aria-hidden className="size-4" /> {labels.whatsapp}
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} className="btn-ghost h-10 w-full font-normal">
          <Mail aria-hidden className="size-4" /> {email}
        </a>
      )}
    </div>
  );
}
