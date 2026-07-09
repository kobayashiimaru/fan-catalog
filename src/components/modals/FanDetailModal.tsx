import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogTitle, DialogBody, DialogHeader } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useComparisonStore } from '@/store/comparisonStore'
import { PowerInputChart } from '@/components/charts/PowerInputChart'
import { EfficiencyChart } from '@/components/charts/EfficiencyChart'
import { AirflowCurveChart } from '@/components/charts/AirflowCurveChart'
import { getFanIcon } from '@/assets/fanIcons'
import type { Fan } from '@/types/fan'

interface FanDetailModalProps {
  fan: Fan | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FanDetailModal({ fan, open, onOpenChange }: FanDetailModalProps) {
  const { t } = useTranslation()
  const { addFan, fanIds, removeFan } = useComparisonStore()

  if (!fan) return null

  const Icon = getFanIcon(fan.fanType)
  const inComparison = fanIds.includes(fan.id)

  const details = [
    { label: t('detail.model'), value: fan.model },
    { label: t('detail.motorType'), value: fan.motorType },
    { label: t('detail.fanType'), value: fan.fanType },
    { label: t('detail.size'), value: `${fan.size}mm` },
    { label: t('detail.supply'), value: fan.supply },
    { label: t('detail.poles'), value: fan.poles },
    { label: t('detail.voltage'), value: `${fan.voltage}V` },
    { label: t('detail.frequency'), value: `${fan.frequency}Hz` },
    { label: t('detail.power'), value: `${fan.power}kW` },
    { label: t('detail.current'), value: `${fan.current}A` },
    { label: t('detail.airflow'), value: `${fan.airflow} m3/h` },
    { label: t('detail.pressure'), value: `${fan.pressure}Pa` },
    { label: t('detail.speed'), value: `${fan.speed}RPM` },
    { label: t('detail.noise'), value: `${fan.noise}dB(A)` },
    { label: t('detail.ambTempPerm'), value: fan.ambTempPerm },
    { label: t('detail.mass'), value: `${fan.mass}kg` },
    { label: t('detail.insulation'), value: fan.insulation },
    { label: t('detail.ipClass'), value: fan.ipClass },
    { label: t('detail.erpLevel'), value: fan.erpLevel },
    { label: t('detail.bepEfficiency'), value: `${fan.bepEfficiency}%` },
    { label: t('detail.bepAirflow'), value: `${fan.bepAirflow} m3/h` },
    { label: t('detail.bepPressure'), value: `${fan.bepPressure}Pa` },
    { label: t('detail.direction'), value: fan.direction },
    { label: t('detail.bearings'), value: fan.bearings },
    { label: t('detail.material'), value: fan.material },
    { label: t('detail.bladeCount'), value: fan.bladeCount },
    { label: t('detail.capacitor'), value: fan.capacitor },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Icon className="h-8 w-8 text-primary shrink-0 mt-0.5" />
            <div>
              <DialogTitle>
                {fan.model}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="info">{fan.motorType}</Badge>
                <Badge>{fan.fanType}</Badge>
                <Button
                  variant={inComparison ? 'danger' : 'default'}
                  size="sm"
                  onClick={() => inComparison ? removeFan(fan.id) : addFan(fan.id)}
                >
                  {inComparison ? t('comparison.clearAll') : t('table.contextAddCompare')}
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="overflow-y-auto">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">{t('detail.generalInfo')}</TabsTrigger>
              <TabsTrigger value="charts">{t('detail.performanceCharts')}</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
                {details.map((d) => (
                  <div key={d.label}>
                    <span className="text-xs text-[var(--text-muted)]">{d.label}</span>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{d.value}</p>
                  </div>
                ))}
              </div>
              {fan.industryRecommendations.length > 0 && (
                <div className="mt-6">
                  <span className="text-xs text-[var(--text-muted)]">{t('detail.industryRecommendations')}</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {fan.industryRecommendations.map((rec) => (
                      <Badge key={rec} variant="success">{rec}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="charts" className="space-y-10">
              <PowerInputChart fans={[fan]} />
              <EfficiencyChart fans={[fan]} />
              <AirflowCurveChart fans={[fan]} />
            </TabsContent>
          </Tabs>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}