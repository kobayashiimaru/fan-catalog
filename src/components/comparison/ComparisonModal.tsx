import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogTitle, DialogBody, DialogHeader } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { PowerInputChart } from '@/components/charts/PowerInputChart'
import { EfficiencyChart } from '@/components/charts/EfficiencyChart'
import { AirflowCurveChart } from '@/components/charts/AirflowCurveChart'
import type { Fan } from '@/types/fan'
import { getFanColor } from '@/assets/fanIcons'

interface ComparisonModalProps {
  fans: Fan[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComparisonModal({ fans, open, onOpenChange }: ComparisonModalProps) {
  const { t } = useTranslation()
  const [visibleCurves, setVisibleCurves] = useState<Set<number>>(new Set(fans.map((f) => f.id)))
  const [showMajorGrid, setShowMajorGrid] = useState(true)
  const [showMinorGrid, setShowMinorGrid] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const toggleCurve = (fanId: number) => {
    setVisibleCurves((prev) => {
      const next = new Set(prev)
      if (next.has(fanId)) next.delete(fanId)
      else next.add(fanId)
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader>
          <DialogTitle>{t('comparison.title')}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col lg:flex-row gap-4 overflow-y-auto">
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="performance">
              <TabsList>
                <TabsTrigger value="performance">{t('comparison.performanceDiff')}</TabsTrigger>
                <TabsTrigger value="dimensions">{t('comparison.dimensionsDiff')}</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <PowerInputChart
                    fans={fans}
                    visibleCurves={visibleCurves}
                    showLegend={showLegend}
                    legendPosition="top"
                    showMajorGrid={showMajorGrid}
                    showMinorGrid={showMinorGrid}
                  />
                  <EfficiencyChart
                    fans={fans}
                    visibleCurves={visibleCurves}
                    showLegend={showLegend}
                    legendPosition="top"
                    showMajorGrid={showMajorGrid}
                    showMinorGrid={showMinorGrid}
                  />
                </div>
                <div className="w-full">
                  <AirflowCurveChart
                    fans={fans}
                    visibleCurves={visibleCurves}
                    showLegend={showLegend}
                    legendPosition="top"
                    showMajorGrid={showMajorGrid}
                    showMinorGrid={showMinorGrid}
                  />
                </div>
              </TabsContent>

              <TabsContent value="dimensions">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-color)]">
                        <th className="p-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">{t('table.model')}</th>
                        <th className="p-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">{t('detail.size')}</th>
                        <th className="p-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">{t('detail.mass')}</th>
                        <th className="p-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">{t('detail.material')}</th>
                        <th className="p-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">{t('detail.bladeCount')}</th>
                        <th className="p-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">{t('detail.bearings')}</th>
                        <th className="p-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">{t('detail.ipClass')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fans.map((fan) => (
                        <tr key={fan.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-hover)]">
                          <td className="p-3 text-[var(--text-primary)] font-medium">{fan.model}</td>
                          <td className="p-3 text-[var(--text-secondary)]">{fan.size}mm</td>
                          <td className="p-3 text-[var(--text-secondary)]">{fan.mass}kg</td>
                          <td className="p-3 text-[var(--text-secondary)]">{fan.material}</td>
                          <td className="p-3 text-[var(--text-secondary)]">{fan.bladeCount}</td>
                          <td className="p-3 text-[var(--text-secondary)]">{fan.bearings}</td>
                          <td className="p-3 text-[var(--text-secondary)]">{fan.ipClass}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-full lg:w-64 shrink-0 glass rounded-xl p-4 space-y-4">
            <div>
              <Label className="mb-2 block text-xs font-semibold uppercase text-[var(--text-muted)]">{t('comparison.selectDisplayCurve')}</Label>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {fans.map((fan, idx) => (
                  <label key={fan.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={visibleCurves.has(fan.id)} onCheckedChange={() => toggleCurve(fan.id)} />
                    <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getFanColor(idx) }} />
                      {fan.model} {fan.voltage}V {fan.frequency}Hz
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-xs font-semibold uppercase text-[var(--text-muted)]">{t('comparison.gridControls')}</Label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showMajorGrid} onCheckedChange={() => setShowMajorGrid(!showMajorGrid)} />
                  <span className="text-xs text-[var(--text-secondary)]">{t('comparison.majorGrid')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showMinorGrid} onCheckedChange={() => setShowMinorGrid(!showMinorGrid)} />
                  <span className="text-xs text-[var(--text-secondary)]">{t('comparison.minorGrid')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showLegend} onCheckedChange={() => setShowLegend(!showLegend)} />
                  <span className="text-xs text-[var(--text-secondary)]">{t('comparison.showLegend')}</span>
                </label>
              </div>
            </div>

          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}