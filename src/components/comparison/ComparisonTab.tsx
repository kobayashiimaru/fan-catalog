import { useTranslation } from 'react-i18next'
import { useComparisonStore } from '@/store/comparisonStore'
import { useFanData } from '@/hooks/useFanData'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Eye } from 'lucide-react'

interface ComparisonTabProps {
  onShowDifference?: () => void
}

export function ComparisonTab({ onShowDifference }: ComparisonTabProps) {
  const { t } = useTranslation()
  const { fanIds, toggleFan, clearAll } = useComparisonStore()
  const { fans } = useFanData()

  const selectedFans = fans.filter((f) => fanIds.includes(f.id))

  if (selectedFans.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">{t('comparison.empty')}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{t('comparison.selectHint')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="max-h-48 overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              <th className="p-1 text-left"></th>
              <th className="p-1 text-left font-medium text-[var(--text-secondary)]">{t('comparison.fanModel')}</th>
              <th className="p-1 text-left font-medium text-[var(--text-secondary)]">{t('comparison.voltage')}</th>
              <th className="p-1 text-left font-medium text-[var(--text-secondary)]">{t('comparison.frequency')}</th>
              <th className="p-1 text-left font-medium text-[var(--text-secondary)]">{t('comparison.power')}</th>
              <th className="p-1 text-left font-medium text-[var(--text-secondary)]">{t('comparison.current')}</th>
              <th className="p-1 text-left font-medium text-[var(--text-secondary)]">{t('comparison.airflow')}</th>
              <th className="p-1 text-left font-medium text-[var(--text-secondary)]">{t('comparison.speed')}</th>
            </tr>
          </thead>
          <tbody>
            {selectedFans.map((fan) => (
              <tr key={fan.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-hover)]">
                <td className="p-1">
                  <Checkbox checked={fanIds.includes(fan.id)} onCheckedChange={() => toggleFan(fan.id)} />
                </td>
                <td className="p-1 text-[var(--text-primary)]">{fan.model}</td>
                <td className="p-1 text-[var(--text-secondary)]">{fan.voltage}V</td>
                <td className="p-1 text-[var(--text-secondary)]">{fan.frequency}Hz</td>
                <td className="p-1 text-[var(--text-secondary)]">{fan.power}kW</td>
                <td className="p-1 text-[var(--text-secondary)]">{fan.current}A</td>
                <td className="p-1 text-[var(--text-secondary)]">{fan.airflow} m3/h</td>
                <td className="p-1 text-[var(--text-secondary)]">{fan.speed} RPM</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={clearAll}>
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          {t('comparison.clearAll')}
        </Button>
        <Button variant="default" size="sm" className="flex-1" onClick={onShowDifference} disabled={selectedFans.length < 2}>
          <Eye className="mr-1 h-3.5 w-3.5" />
          {t('comparison.showDifference')}
        </Button>
      </div>
    </div>
  )
}