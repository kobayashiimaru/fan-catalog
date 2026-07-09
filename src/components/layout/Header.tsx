import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon, Languages, Search, Fan } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/themeStore'
import { useFilterStore } from '@/store/filterStore'

interface HeaderProps {
  activeSection: 'home' | 'catalog'
  onNavigate: (section: 'home' | 'catalog') => void
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const { theme, lang, toggleTheme, setLang } = useThemeStore()
  const { search, setSearch } = useFilterStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const switchLang = () => {
    const next = lang === 'en' ? 'ru' : 'en'
    setLang(next)
    void i18n.changeLanguage(next)
  }

  const navItems = [
    { key: 'home' as const, label: t('nav.home') },
    { key: 'catalog' as const, label: t('nav.catalog') },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => { onNavigate('home'); setMenuOpen(false) }}
          >
            <div className="glass-strong flex h-14 w-14 items-center justify-center rounded-2xl">
              <Fan className="h-7 w-7 text-primary" />
            </div>
            <span className="hidden text-2xl font-bold text-[var(--text-primary)] sm:inline">
              {t('app.title')}
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={activeSection === item.key ? 'default' : 'ghost'}
                onClick={() => onNavigate(item.key)}
                className="text-base"
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className={'hidden sm:flex relative ' + (searchOpen ? 'md:flex' : 'md:hidden lg:flex')}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={t('header.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-40 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-accent lg:w-60"
            />
          </div>

          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={switchLang} title={t('header.language')}>
            <Languages className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'light' ? t('theme.dark') : t('theme.light')}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={activeSection === item.key ? 'default' : 'ghost'}
                className="justify-start text-base"
                onClick={() => { onNavigate(item.key); setMenuOpen(false) }}
              >
                {item.label}
              </Button>
            ))}
            <div className="relative mt-2 sm:hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={t('header.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}