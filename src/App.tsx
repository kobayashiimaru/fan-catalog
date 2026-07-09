import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/store/themeStore'
import { useFanData } from '@/hooks/useFanData'
import { useComparisonStore } from '@/store/comparisonStore'
import { Header } from '@/components/layout/Header'
import { HomeSection } from '@/components/layout/HomeSection'
import { FilterPanel } from '@/components/filters/FilterPanel'

const DataTable = lazy(() => import('@/components/table/DataTable').then(m => ({ default: m.DataTable })))
const FanDetailModal = lazy(() => import('@/components/modals/FanDetailModal').then(m => ({ default: m.FanDetailModal })))
const ComparisonModal = lazy(() => import('@/components/comparison/ComparisonModal').then(m => ({ default: m.ComparisonModal })))
import type { Fan, ViewSection } from '@/types/fan'


export default function App() {
  const { i18n } = useTranslation()
  const { theme, lang } = useThemeStore()
  const { fans, loading } = useFanData()
  const { fanIds } = useComparisonStore()

  const [section, setSection] = useState<ViewSection>('home')
  const [selectedFan, setSelectedFan] = useState<Fan | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [comparisonOpen, setComparisonOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    void i18n.changeLanguage(lang)
  }, [lang, i18n])

  const comparisonFans = useMemo(
    () => fans.filter((f) => fanIds.includes(f.id)),
    [fans, fanIds],
  )

  const handleFanClick = (fan: Fan) => {
    setSelectedFan(fan)
    setDetailOpen(true)
  }

  return (
    <div className="h-dvh flex flex-col bg-[var(--bg-primary)] transition-colors duration-500">
      <Header activeSection={section} onNavigate={setSection} />

      {section === 'home' ? (
        <div className="flex-1 overflow-y-auto pt-20">
          <HomeSection onNavigate={setSection} />
        </div>
      ) : (
        <main className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto min-h-0 px-4 pt-20 pb-4 sm:px-6">
          <div className="flex flex-col gap-6">
            <FilterPanel onShowDifference={() => setComparisonOpen(true)} />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /></div>}>
              <DataTable fans={fans} loading={loading} onFanClick={handleFanClick} />
            </Suspense>
          </div>
        </main>
      )}

      <Suspense fallback={null}>
        <FanDetailModal
          fan={selectedFan}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />

        <ComparisonModal
          fans={comparisonFans}
          open={comparisonOpen}
          onOpenChange={setComparisonOpen}
        />
      </Suspense>
    </div>
  )
}
