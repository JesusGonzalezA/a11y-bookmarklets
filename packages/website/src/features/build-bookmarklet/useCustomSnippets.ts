import { useCallback, useSyncExternalStore } from "react";
import type { Snippet } from "./snippets";

const STORAGE_KEY = "builder:custom-snippets";

let cached: Snippet[] = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

const listeners = new Set<() => void>();

function notify() {
  for (const cb of listeners) cb();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cached = getSnapshot();
      callback();
    }
  };
  window.addEventListener("storage", handler);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): Snippet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getSnapshotCached() {
  return cached;
}

function persist(snippets: Snippet[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  cached = snippets;
  notify();
}

export function useCustomSnippets() {
  const snippets = useSyncExternalStore(subscribe, getSnapshotCached);

  const save = useCallback((name: string, code: string) => {
    const snippet: Snippet = {
      id: `custom-${Date.now()}`,
      name,
      description: "Custom snippet",
      icon: "Code2",
      code,
    };
    persist([...getSnapshot(), snippet]);
  }, []);

  const remove = useCallback((id: string) => {
    persist(getSnapshot().filter((s) => s.id !== id));
  }, []);

  return { customSnippets: snippets, saveSnippet: save, removeSnippet: remove };
}
