import { create } from 'zustand'

interface ThemeState {
  theme: 'light' | 'dark'
  lang: 'en' | 'ru'
  toggleTheme: () => void
  setLang: (lang: 'en' | 'ru') => void
}

const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem('fan-theme') : null) as 'light' | 'dark' | null
const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('fan-lang') : null) as 'en' | 'ru' | null

export const useThemeStore = create<ThemeState>((set) => ({
  theme: savedTheme ?? 'light',
  lang: savedLang ?? 'en',
  toggleTheme: () => {
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('fan-theme', next)
      return { theme: next }
    })
  },
  setLang: (lang) => {
    localStorage.setItem('fan-lang', lang)
    set({ lang })
  },
}))
