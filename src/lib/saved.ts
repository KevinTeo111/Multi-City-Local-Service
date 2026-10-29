"use client";

import { useSyncExternalStore } from "react";

// Saved providers are kept in localStorage, so visitors don't need an account.
// (A customer account could sync them later.)

const KEY = "nearby:saved";
const EVENT = "nearby:saved-change";
const EMPTY: string[] = [];

let cacheRaw: string | null = null;
let cache: string[] = EMPTY;

function read(): string[] {
  const raw = window.localStorage.getItem(KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      cache = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : EMPTY;
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useSaved() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleSaved(slug: string) {
  const current = read();
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}
