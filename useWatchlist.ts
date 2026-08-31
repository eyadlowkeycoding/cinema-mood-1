"use client";

import { useCallback, useEffect, useState } from "react";
import { MediaItem } from "./types";

const KEY = "cinemood.watchlist.v1";

function read(): MediaItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MediaItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: MediaItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cinemood:watchlist"));
}

export function useWatchlist() {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener("cinemood:watchlist", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cinemood:watchlist", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const isSaved = useCallback((type: string, id: number) => items.some((i) => i.type === type && i.id === id), [items]);

  const add = useCallback((item: MediaItem) => {
    const current = read();
    if (current.some((i) => i.type === item.type && i.id === item.id)) return;
    const next = [item, ...current];
    write(next);
    setItems(next);
  }, []);

  const remove = useCallback((type: string, id: number) => {
    const next = read().filter((i) => !(i.type === type && i.id === id));
    write(next);
    setItems(next);
  }, []);

  const toggle = useCallback(
    (item: MediaItem) => {
      if (isSaved(item.type, item.id)) remove(item.type, item.id);
      else add(item);
    },
    [isSaved, add, remove]
  );

  return { items, isSaved, add, remove, toggle };
}
