import type { Fan } from '@/types/fan'

const models = [
  'YWF(K)2E-250', 'YWF(K)2E-300', 'YWF(K)2E-350', 'YWF(K)2E-400',
  'YWF(K)2E-450', 'YWF(K)2E-500', 'YWF(K)2E-560', 'YWF(K)2E-630',
  'YWF(K)2E-710', 'YWF(K)2E-800', 'YWF(K)4E-250', 'YWF(K)4E-300',
  'YWF(K)4E-350', 'YWF(K)4E-400', 'YWF(K)4E-450', 'YWF(K)4E-500',
  'YWF(K)4E-560', 'YWF(K)4E-630', 'YWF(K)4E-710', 'YWF(K)4E-800',
  'KTRY-25-4', 'KTRY-30-4', 'KTRY-35-4', 'KTRY-40-4',
  'KTRY-45-4', 'KTRY-50-4', 'KTRY-55-4', 'KTRY-60-4',
  'YWF-2E-250', 'YWF-2E-300', 'YWF-2E-350', 'YWF-2E-400',
  'CA-250-A', 'CA-315-A', 'CA-400-A', 'CA-500-A',
  'RA-250-H', 'RA-315-H', 'RA-400-H', 'RA-500-H',
]

const motorTypes = ['EC', 'AC'] as const
const fanTypes = ['Axial', 'Centrifugal', 'Roof'] as const
const supplies = ['1~230V', '3~400V', '3~230V', '3~690V'] as const
const directions = ['CW', 'CCW', 'Reversible'] as const
const insulationClasses = ['F', 'H', 'B'] as const
const ipClasses = ['IP44', 'IP54', 'IP55', 'IP65'] as const
const erpLevels = ['2015', '2018', '2020', '2022'] as const
const bearings = ['Ball bearing', 'Roller bearing', 'Sleeve bearing'] as const
const materials = ['Aluminum', 'Steel', 'Stainless Steel', 'Plastic composite'] as const
const capacitors = ['4 uF', '6 uF', '8 uF', '10 uF', '12 uF', 'None'] as const
const tags = [
  'Ventilation', 'Industrial Cooling', 'Air Conditioning', 'Heat Exchange',
  'Agriculture', 'Transportation', 'Clean Room', 'Data Center',
  'Marine', 'Mining', 'Tunnel', 'Commercial Kitchen',
]

function rand(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, arr.length))
}

function generateFan(id: number): Fan {
  const model = models[id % models.length]
  const motorType = pick(motorTypes)
  const fanType = pick(fanTypes)
  const supply = pick(supplies)
  const poles = pick([2, 4, 6] as const)
  const frequency = pick([50, 60] as const)
  const voltage = supply.includes('690') ? 690 : supply.includes('400') ? 400 : 230
  const size = parseInt(model.match(/(\d+)/)?.[0] ?? '300', 10)
  const powerBase = size / 500
  const power = Math.round((powerBase * (1 + Math.random() * 1.5)) * 100) / 100
  const current = Math.round((power * 1000 / (voltage * 1.732 * 0.85)) * 100) / 100
  const airflow = Math.round(size * (50 + Math.random() * 80))
  const pressure = Math.round(size * (0.5 + Math.random() * 1.2))
  const speed = poles === 2 ? rand(2500, 3000) : poles === 4 ? rand(1300, 1700) : rand(800, 1000)
  const noise = Math.round(45 + size / 30 + Math.random() * 10)
  const mass = Math.round(size * 0.02 + Math.random() * 5)

  const bepEfficiency = Math.round((55 + Math.random() * 30) * 10) / 10
  const bepAirflow = Math.round(airflow * (0.5 + Math.random() * 0.2))
  const bepPressure = Math.round(pressure * (0.5 + Math.random() * 0.2))

  return {
    id,
    model,
    motorType,
    fanType,
    size,
    supply,
    poles,
    voltage,
    frequency,
    power,
    current: Math.round(current * 100) / 100,
    airflow,
    pressure,
    speed: Math.round(speed),
    noise,
    ambTempPerm: '-20..+' + (40 + Math.round(Math.random() * 20)),
    mass,
    insulation: pick(insulationClasses),
    ipClass: pick(ipClasses),
    erpLevel: pick(erpLevels),
    bepEfficiency,
    bepAirflow,
    bepPressure,
    nErp2015Req: Math.round(bepEfficiency * (0.85 + Math.random() * 0.1) * 10) / 10,
    nErp2026Req: Math.round(bepEfficiency * (0.9 + Math.random() * 0.08) * 10) / 10,
    direction: pick(directions),
    imageUrl: '',
    bearings: pick(bearings),
    material: pick(materials),
    bladeCount: Math.round(4 + Math.random() * 7),
    capacitor: pick(capacitors),
    industryRecommendations: pickN(tags, 1 + Math.floor(Math.random() * 3)),
  }
}

export function generateSeedData(): Fan[] {
  const fans: Fan[] = []
  for (let i = 0; i < 40; i++) {
    fans.push(generateFan(i + 1))
  }
  return fans
}