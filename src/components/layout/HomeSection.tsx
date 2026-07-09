import { useTranslation } from 'react-i18next'
import { Fan, Sliders, BarChart3, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HomeSectionProps {
  onNavigate: (section: 'home' | 'catalog') => void
}

export function HomeSection({ onNavigate }: HomeSectionProps) {
  const { t } = useTranslation()

  const features = [
    { icon: Sliders, label: t('home.features.filter') },
    { icon: BarChart3, label: t('home.features.compare') },
    { icon: Fan, label: t('home.features.charts') },
    { icon: Download, label: t('home.features.export') },
  ]

  return (
    <section className="flex min-h-full items-center justify-center py-8">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <div className="glass-strong mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl">
          <Fan className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          {t('home.welcome')}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--text-secondary)]">
          {t('home.description')}
        </p>
        <Button size="lg" onClick={() => onNavigate('catalog')}>
          {t('home.startButton')}
        </Button>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat) => (
            <div
              key={feat.label}
              className="glass rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feat.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{feat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
