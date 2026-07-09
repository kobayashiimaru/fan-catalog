import { create } from 'zustand'

interface ComparisonState {
  fanIds: number[]
  addFan: (id: number) => void
  removeFan: (id: number) => void
  toggleFan: (id: number) => void
  clearAll: () => void
}

export const useComparisonStore = create<ComparisonState>((set) => ({
  fanIds: [],
  addFan: (id) => set((s) => (s.fanIds.includes(id) ? s : { fanIds: [...s.fanIds, id] })),
  removeFan: (id) => set((s) => ({ fanIds: s.fanIds.filter((i) => i !== id) })),
  toggleFan: (id) => set((s) => ({
    fanIds: s.fanIds.includes(id) ? s.fanIds.filter((i) => i !== id) : [...s.fanIds, id],
  })),
  clearAll: () => set({ fanIds: [] }),
}))
