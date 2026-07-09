import { create } from 'zustand'

interface FilterState {
  poles: number[]
  supplies: string[]
  voltages: number[]
  frequencies: number[]
  protectionClasses: string[]
  insulationClasses: string[]
  erpLevels: string[]
  tags: string[]
  search: string
  setPoles: (poles: number[]) => void
  setSupplies: (supplies: string[]) => void
  setVoltages: (voltages: number[]) => void
  setFrequencies: (frequencies: number[]) => void
  setTags: (tags: string[]) => void
  setSearch: (search: string) => void
  togglePole: (pole: number) => void
  toggleSupply: (supply: string) => void
  toggleVoltage: (voltage: number) => void
  toggleFrequency: (frequency: number) => void
  toggleProtectionClass: (cls: string) => void
  toggleInsulationClass: (cls: string) => void
  toggleErpLevel: (level: string) => void
  toggleTag: (tag: string) => void
  resetFilters: () => void
}

const initialState = {
  poles: [] as number[],
  supplies: [] as string[],
  voltages: [] as number[],
  frequencies: [] as number[],
  protectionClasses: [] as string[],
  insulationClasses: [] as string[],
  erpLevels: [] as string[],
  tags: [] as string[],
  search: '',
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
}

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setPoles: (poles) => set({ poles }),
  setSupplies: (supplies) => set({ supplies }),
  setVoltages: (voltages) => set({ voltages }),
  setFrequencies: (frequencies) => set({ frequencies }),
  setTags: (tags) => set({ tags }),
  setSearch: (search) => set({ search }),
  togglePole: (pole) => set((s) => ({ poles: toggle(s.poles, pole) })),
  toggleSupply: (supply) => set((s) => ({ supplies: toggle(s.supplies, supply) })),
  toggleVoltage: (voltage) => set((s) => ({ voltages: toggle(s.voltages, voltage) })),
  toggleFrequency: (frequency) => set((s) => ({ frequencies: toggle(s.frequencies, frequency) })),
  toggleProtectionClass: (cls) => set((s) => ({ protectionClasses: toggle(s.protectionClasses, cls) })),
  toggleInsulationClass: (cls) => set((s) => ({ insulationClasses: toggle(s.insulationClasses, cls) })),
  toggleErpLevel: (level) => set((s) => ({ erpLevels: toggle(s.erpLevels, level) })),
  toggleTag: (tag) => set((s) => ({ tags: toggle(s.tags, tag) })),
  resetFilters: () => set(initialState),
}))
