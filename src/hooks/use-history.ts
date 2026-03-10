import { useState, useEffect, useCallback } from "react";

export interface HistoryItem {
  id: string;
  topic: string;
  mode: "text" | "code" | "audio" | "image";
  depth: string;
  language: string;
  content: string;
  favorite: boolean;
  createdAt: number;
}

const STORAGE_KEY = "gyanguru-history";

function loadItems(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveItems(items: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>(loadItems);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const addItem = useCallback((item: Omit<HistoryItem, "id" | "createdAt" | "favorite">) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      favorite: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem.id;
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return { items, addItem, toggleFavorite, removeItem, clearAll };
}
