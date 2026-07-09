import { Download } from 'lucide-react'
import Papa from 'papaparse'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { Fan } from '@/types/fan'

interface ExportButtonProps {
  fans: Fan[]
}

export function ExportButton({ fans }: ExportButtonProps) {
  const { t } = useTranslation()

  const handleExport = () => {
    const data = fans.map((f) => ({
      ID: f.id,
      Model: f.model,
      'Motor Type': f.motorType,
      'Fan Type': f.fanType,
      Size: f.size,
      Supply: f.supply,
      Poles: f.poles,
      Voltage: f.voltage,
      Frequency: f.frequency,
      Power: f.power,
      Current: f.current,
      Airflow: f.airflow,
      Pressure: f.pressure,
      Speed: f.speed,
      Noise: f.noise,
      'Mass (kg)': f.mass,
      'IP Class': f.ipClass,
      'ErP Level': f.erpLevel,
      Direction: f.direction,
      Bearings: f.bearings,
      Material: f.material,
      'Blade Count': f.bladeCount,
      Capacitor: f.capacitor,
    }))

    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fan-catalog-' + new Date().toISOString().slice(0, 10) + '.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleExport}>
      <Download className="mr-1 h-4 w-4" />
      {t('table.export')}
    </Button>
  )
}