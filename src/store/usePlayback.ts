import { create } from "zustand";

export type PlaybackItem = {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  progress: number;         // 0..100
  lastWatched: number;      // timestamp
  genres?: number[];        // pra recomendações simples
};

type State = {
  items: PlaybackItem[];
  upsert: (p: Omit<PlaybackItem, "lastWatched">) => void;
  clearFinishedBelow?: (minPercent?: number) => void;
  topGenres: () => number[]; // gêneros mais vistos
};

const KEY = "netflux-playback";

const load = (): PlaybackItem[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const persist = (items: PlaybackItem[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
};

export const usePlayback = create<State>((set, get) => ({
  items: load(),
  upsert: (p) => set((s) => {
    const i = s.items.findIndex(x => x.id === p.id && x.type === p.type);
    const nextItem: PlaybackItem = {
      ...s.items[i],
      ...p,
      lastWatched: Date.now(),
    } as PlaybackItem;
    const next = [...s.items];
    if (i >= 0) next[i] = nextItem; else next.unshift(nextItem);
    persist(next);
    return { items: next };
  }),
  clearFinishedBelow: (min = 1) => set((s) => {
    const next = s.items.filter(it => it.progress >= min && it.progress < 100);
    persist(next);
    return { items: next };
  }),
  topGenres: () => {
    const counts: Record<number, number> = {};
    for (const it of get().items) {
      (it.genres || []).forEach(g => counts[g] = (counts[g] || 0) + 1);
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([g]) => Number(g));
  },
}));
