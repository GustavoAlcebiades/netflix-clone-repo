import { create } from "zustand";

export type ListItem = {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
};

type State = {
  items: ListItem[];
  add: (i: ListItem) => void;
  remove: (id: number, type: "movie" | "tv") => void;
  has: (id: number, type: "movie" | "tv") => boolean;
};

const KEY = "netflux-mylist";

const load = (): ListItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persist = (items: ListItem[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
};

export const useMyList = create<State>((set, get) => ({
  items: load(),
  add: (i) =>
    set((s) => {
      if (s.items.some((x) => x.id === i.id && x.type === i.type)) return s;
      const next = [i, ...s.items];
      persist(next);
      return { items: next };
    }),
  remove: (id, type) =>
    set((s) => {
      const next = s.items.filter((x) => !(x.id === id && x.type === type));
      persist(next);
      return { items: next };
    }),
  has: (id, type) => get().items.some((x) => x.id === id && x.type === type),
}));
