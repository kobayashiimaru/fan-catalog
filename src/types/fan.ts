export interface Fan {
  id: number
  model: string
  motorType: string
  fanType: string
  size: number
  supply: string
  poles: number
  voltage: number
  frequency: number
  power: number
  current: number
  airflow: number
  pressure: number
  speed: number
  noise: number
  ambTempPerm: string
  mass: number
  insulation: string
  ipClass: string
  erpLevel: string
  bepEfficiency: number
  bepAirflow: number
  bepPressure: number
  nErp2015Req: number
  nErp2026Req: number
  direction: string
  imageUrl: string
  bearings: string
  material: string
  bladeCount: number
  capacitor: string
  industryRecommendations: string[]
}

export interface FilterValues {
  poles: number[]
  supplies: string[]
  voltages: number[]
  frequencies: number[]
  airflowMin: number | null
  airflowMax: number | null
  pressureMin: number | null
  pressureMax: number | null
  protectionClasses: string[]
  insulationClasses: string[]
  erpLevels: string[]
  ambTempMin: number | null
  ambTempMax: number | null
  massMin: number | null
  massMax: number | null
  tags: string[]
}

export type ViewSection = 'home' | 'catalog'

export interface ChartDataPoint {
  airflow: number
  pressure?: number
  efficiency?: number
  power?: number
  [key: string]: number | undefined
}

export interface FanCurveData {
  fan: Fan
  color: string
  powerCurve: ChartDataPoint[]
  efficiencyCurve: ChartDataPoint[]
  airflowCurve: ChartDataPoint[]
}

export type LegendPosition = 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'disable'
export type FileFormat = 'png' | 'emf'