"use client";

import { useCallback, useSyncExternalStore } from "react";

const storageKey = (shortId: string) => `mapamus:couple:${shortId}`;
const CHANGE_EVENT = "mapamus:selected-couple-change";

function subscribe(callback: () => void) {
  // `storage` fires on other tabs; the custom event covers same-tab updates.
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function readCouple(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Persists which couple the player is, scoped to a tournament, in `localStorage`.
 * No auth required: the selection lives on the device and is remembered on return.
 *
 * Backed by `useSyncExternalStore` so reads are SSR-safe (server snapshot is `null`)
 * and stay in sync across tabs without calling `setState` inside an effect.
 */
export function useSelectedCouple(shortId: string) {
  const key = storageKey(shortId);

  const coupleId = useSyncExternalStore(
    subscribe,
    () => readCouple(key),
    () => null
  );

  const select = useCallback(
    (id: string) => {
      try {
        window.localStorage.setItem(key, id);
      } catch {
        // Ignore storage write errors (private mode, disabled storage, ...).
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key]
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage removal errors.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, [key]);

  return { coupleId, select, clear };
}
