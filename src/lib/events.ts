import "server-only";

// Counts profile events per business. In-memory for the preview; in production
// this inserts a row into a Supabase `listing_events` table
// (business_id, type, city, created_at) that the dashboards aggregate.

export const EVENT_TYPES = ["view", "phone_reveal", "call_click", "whatsapp_click"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

const counters = new Map<string, Record<EventType, number>>();

export function recordEvent(slug: string, type: EventType) {
  const current = counters.get(slug) ?? { view: 0, phone_reveal: 0, call_click: 0, whatsapp_click: 0 };
  current[type] += 1;
  counters.set(slug, current);
  return current;
}

export function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}
