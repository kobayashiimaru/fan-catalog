import { useTranslation } from 'react-i18next'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/store/filterStore'
import { ComparisonTab } from '@/components/comparison/ComparisonTab'

const polesList = [2, 4, 6]
const suppliesList = ['1~230V', '3~400V', '3~230V', '3~690V']
const voltagesList = [230, 400, 460, 690]
const frequenciesList = [50, 60]
const protectionList = ['IP44', 'IP54', 'IP55', 'IP65']
const insulationList = ['F', 'H', 'B']
const erpList = ['2015', '2018', '2020', '2022']
const tagsList = [
  'Ventilation', 'Industrial Cooling', 'Air Conditioning', 'Heat Exchange',
  'Agriculture', 'Transportation', 'Clean Room', 'Data Center',
  'Marine', 'Mining', 'Tunnel', 'Commercial Kitchen',
]

interface FilterPanelProps {
  onShowDifference?: () => void
}

export function FilterPanel({ onShowDifference }: FilterPanelProps) {
  const { t } = useTranslation()
  const filters = useFilterStore()

  return (
    <div className="glass rounded-2xl p-4 w-full">
      <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">{t('filters.title')}</h2>
      <Tabs defaultValue="electrical" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="electrical">{t('filters.electrical')}</TabsTrigger>
          <TabsTrigger value="operating">{t('filters.operating')}</TabsTrigger>
          <TabsTrigger value="physical">{t('filters.physical')}</TabsTrigger>
          <TabsTrigger value="tags">{t('filters.tags')}</TabsTrigger>
          <TabsTrigger value="comparison">{t('filters.comparison')}</TabsTrigger>
        </TabsList>

        <TabsContent value="electrical" className="space-y-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div>
              <Label className="mb-2 block">{t('filters.motorPoles')}</Label>
              <div className="flex flex-wrap gap-3">
                {polesList.map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filters.poles.includes(p)} onCheckedChange={() => filters.togglePole(p)} />
                    <span className="text-sm text-[var(--text-secondary)]">{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('filters.supply')}</Label>
              <div className="flex flex-wrap gap-3">
                {suppliesList.map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filters.supplies.includes(s)} onCheckedChange={() => filters.toggleSupply(s)} />
                    <span className="text-sm text-[var(--text-secondary)]">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('filters.ratedVoltage')}</Label>
              <div className="flex flex-wrap gap-3">
                {voltagesList.map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filters.voltages.includes(v)} onCheckedChange={() => filters.toggleVoltage(v)} />
                    <span className="text-sm text-[var(--text-secondary)]">{v}V</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('filters.frequency')}</Label>
              <div className="flex flex-wrap gap-3">
                {frequenciesList.map((f) => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filters.frequencies.includes(f)} onCheckedChange={() => filters.toggleFrequency(f)} />
                    <span className="text-sm text-[var(--text-secondary)]">{f}Hz</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="operating" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <Label className="mb-2 block">{t('filters.airflowVolume')}</Label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="h-9 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-accent" />
                <span className="text-[var(--text-muted)]">-</span>
                <input type="number" placeholder="Max" className="h-9 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('filters.pressure')}</Label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="h-9 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-accent" />
                <span className="text-[var(--text-muted)]">-</span>
                <input type="number" placeholder="Max" className="h-9 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="physical" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div>
              <Label className="mb-2 block">{t('filters.protectionClass')}</Label>
              <div className="flex flex-wrap gap-3">
                {protectionList.map((ip) => (
                  <label key={ip} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filters.protectionClasses.includes(ip)} onCheckedChange={() => filters.toggleProtectionClass(ip)} />
                    <span className="text-sm text-[var(--text-secondary)]">{ip}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('filters.insulationClass')}</Label>
              <div className="flex flex-wrap gap-3">
                {insulationList.map((ins) => (
                  <label key={ins} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filters.insulationClasses.includes(ins)} onCheckedChange={() => filters.toggleInsulationClass(ins)} />
                    <span className="text-sm text-[var(--text-secondary)]">{ins}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('filters.erpLevel')}</Label>
              <div className="flex flex-wrap gap-3">
                {erpList.map((e) => (
                  <label key={e} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filters.erpLevels.includes(e)} onCheckedChange={() => filters.toggleErpLevel(e)} />
                    <span className="text-sm text-[var(--text-secondary)]">{e}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tags" className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
            {tagsList.map((tag) => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={filters.tags.includes(tag)} onCheckedChange={() => filters.toggleTag(tag)} />
                <span className="text-sm text-[var(--text-secondary)]">{tag}</span>
              </label>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="w-full">
          <ComparisonTab onShowDifference={onShowDifference} />
        </TabsContent>
      </Tabs>
      <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={filters.resetFilters}>
        {t('filters.reset')}
      </Button>
    </div>
  )
}
