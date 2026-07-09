import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { Fan, ChartDataPoint, LegendPosition } from '@/types/fan'
import { getFanColor } from '@/assets/fanIcons'

function generateEfficiencyCurve(fan: Fan): ChartDataPoint[] {
  const points: ChartDataPoint[] = []
  for (let i = 0; i <= 10; i++) {
    const ratio = i / 10
    const pressure = Math.round(fan.bepPressure * ratio * 1.2)
    const efficiency = fan.bepEfficiency * Math.exp(-Math.pow(ratio - 0.5, 2) * 3) * (1 + 0.1 * Math.sin(ratio * Math.PI * 0.5))
    points.push({ airflow: 0, pressure, efficiency: Math.round(efficiency * 10) / 10 })
  }
  return points
}

interface EfficiencyChartProps {
  fans: Fan[]
  visibleCurves?: Set<number>
  showLegend?: boolean
  legendPosition?: LegendPosition
  showMajorGrid?: boolean
  showMinorGrid?: boolean
}

export function EfficiencyChart({
  fans,
  visibleCurves,
  showLegend = true,
  legendPosition = 'bottom',
  showMajorGrid = true,
  showMinorGrid = false,
}: EfficiencyChartProps) {
  const { t } = useTranslation()

  const { data, lines } = useMemo(() => {
    const allData: ChartDataPoint[] = []
    const lineConfigs: { dataKey: string; color: string; name: string; fanId: number }[] = []

    fans.forEach((fan, idx) => {
      const color = getFanColor(idx)
      const curve = generateEfficiencyCurve(fan)
      curve.forEach((pt, i) => {
        if (!allData[i]) allData[i] = { airflow: 0, pressure: pt.pressure }
        allData[i][`eff_${fan.id}`] = pt.efficiency
      })
      lineConfigs.push({
        dataKey: `eff_${fan.id}`,
        color,
        name: `${fan.model} ${fan.voltage}V ${fan.frequency}Hz`,
        fanId: fan.id,
      })
    })

    return { data: allData, lines: lineConfigs }
  }, [fans])

  const isVisible = (fanId: number) => !visibleCurves || visibleCurves.has(fanId)

  return (
    <div className="w-full h-full px-2">
      <h3 className="mb-4 text-sm font-medium text-[var(--text-primary)]">{t('charts.efficiency')}</h3>
      <div className="h-[260px] sm:h-[300px] lg:h-[330px]">
        <ResponsiveContainer width="100%" height="100%" className="mb-3">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
          {showMajorGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />}
          {showMinorGrid && <CartesianGrid strokeDasharray="1 1" stroke="var(--border-color)" opacity={0.3} />}
          <XAxis dataKey="pressure" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} label={{ value: t('charts.pressure'), position: 'bottom', fontSize: 10, fill: 'var(--text-muted)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} label={{ value: t('charts.efficiencyPercent'), angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--text-muted)' }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          {lines.map((line) =>
            isVisible(line.fanId) ? (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                name={line.name}
                connectNulls
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
      </div>
      {showLegend && legendPosition !== 'disable' && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center text-xs mt-6">
          {lines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
              <span className="text-[var(--text-secondary)]">{line.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}