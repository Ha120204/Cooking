"use client";

import { useMemo, useSyncExternalStore } from "react";

const storageKey = "bep-nha-minh:favorites";
const changedEvent = "bep-nha-minh:favorites-changed";

function getSnapshot() {
  try {
    return window.localStorage.getItem(storageKey) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changedEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changedEvent, callback);
  };
}

function parseFavorites(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return useMemo(() => parseFavorites(raw), [raw]);
}

export function toggleFavorite(slug: string) {
  const next = new Set(parseFavorites(getSnapshot()));
  if (next.has(slug)) next.delete(slug);
  else next.add(slug);
  try {
    window.localStorage.setItem(storageKey, JSON.stringify([...next]));
    window.dispatchEvent(new Event(changedEvent));
  } catch {
    // The site remains usable when browser storage is disabled.
  }
}
