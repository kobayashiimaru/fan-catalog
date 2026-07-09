import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { Fan, ChartDataPoint, LegendPosition } from '@/types/fan'
import { getFanColor } from '@/assets/fanIcons'

function generateAirflowCurve(fan: Fan): ChartDataPoint[] {
  const points: ChartDataPoint[] = []
  for (let i = 0; i <= 10; i++) {
    const ratio = i / 10
    const airflow = Math.round(fan.airflow * ratio)
    const pressure = fan.pressure * (1 - Math.pow(ratio, 1.8)) * (0.9 + 0.1 * Math.sin(ratio * Math.PI))
    const efficiency = fan.bepEfficiency * Math.exp(-Math.pow(ratio - 0.4, 2) * 4) * (0.9 + 0.1 * Math.cos(ratio * Math.PI * 0.3))
    points.push({
      airflow,
      pressure: Math.round(Math.max(0, pressure)),
      efficiency: Math.round(Math.min(100, efficiency) * 10) / 10,
    })
  }
  return points
}

interface AirflowCurveChartProps {
  fans: Fan[]
  visibleCurves?: Set<number>
  showLegend?: boolean
  legendPosition?: LegendPosition
  showMajorGrid?: boolean
  showMinorGrid?: boolean
}

export function AirflowCurveChart({
  fans,
  visibleCurves,
  showLegend = true,
  legendPosition = 'bottom',
  showMajorGrid = true,
  showMinorGrid = false,
}: AirflowCurveChartProps) {
  const { t } = useTranslation()

  const { data, pressureLines, efficiencyLines } = useMemo(() => {
    const allData: ChartDataPoint[] = []
    const pLines: { dataKey: string; color: string; name: string; fanId: number }[] = []
    const eLines: { dataKey: string; color: string; name: string; fanId: number }[] = []

    fans.forEach((fan, idx) => {
      const color = getFanColor(idx)
      const curve = generateAirflowCurve(fan)
      curve.forEach((pt, i) => {
        if (!allData[i]) allData[i] = { airflow: pt.airflow }
        if (!allData[i].airflow || pt.airflow > (allData[i].airflow ?? 0)) {
          allData[i].airflow = pt.airflow
        }
        allData[i][`pres_${fan.id}`] = pt.pressure
        allData[i][`eff_${fan.id}`] = pt.efficiency
      })
      pLines.push({
        dataKey: `pres_${fan.id}`,
        color: `${color}CC`,
        name: `${fan.model} ${fan.voltage}V (Pa)`,
        fanId: fan.id,
      })
      eLines.push({
        dataKey: `eff_${fan.id}`,
        color,
        name: `${fan.model} ${fan.voltage}V (%)`,
        fanId: fan.id,
      })
    })

    return { data: allData, pressureLines: pLines, efficiencyLines: eLines }
  }, [fans])

  const isVisible = (fanId: number) => !visibleCurves || visibleCurves.has(fanId)

  return (
    <div className="w-full h-full px-2">
      <h3 className="mb-4 text-sm font-medium text-[var(--text-primary)]">{t('charts.airflowCurve')}</h3>
      <div className="overflow-x-auto">
        <div className="h-[320px] sm:h-[380px] lg:h-[430px] min-w-[500px]">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 10 }}>
          {showMajorGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />}
          {showMinorGrid && <CartesianGrid strokeDasharray="1 1" stroke="var(--border-color)" opacity={0.3} />}
          <XAxis dataKey="airflow" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} label={{ value: t('charts.airflow'), position: 'bottom', fontSize: 10, fill: 'var(--text-muted)' }} />

          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
            label={{ value: t('charts.pressure'), angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--text-muted)' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[100, 0]}
            reversed
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
            label={{ value: t('charts.efficiencyPercent'), angle: 90, position: 'insideRight', fontSize: 10, fill: 'var(--text-muted)' }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          {pressureLines.map((line) =>
            isVisible(line.fanId) ? (
              <Line
                key={line.dataKey}
                yAxisId="left"
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
          {efficiencyLines.map((line) =>
            isVisible(line.fanId) ? (
              <Line
                key={line.dataKey}
                yAxisId="right"
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                name={line.name}
                connectNulls
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
        </div>
      </div>
      {showLegend && legendPosition !== 'disable' && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center text-xs mt-6">
          {pressureLines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
              <span className="text-[var(--text-secondary)]">{line.name}</span>
            </div>
          ))}
          {efficiencyLines.length > 0 && (
            <div className="flex items-center gap-1.5 pl-3 ml-1 border-l border-[var(--border-color)]">
              {efficiencyLines.map((line) => (
                <div key={line.dataKey} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
                  <span className="text-[var(--text-secondary)]">{line.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}