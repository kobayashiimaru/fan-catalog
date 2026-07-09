import Dexie, { type EntityTable } from 'dexie'
import type { Fan } from '@/types/fan'

export const db = new Dexie('FanCatalogDB') as Dexie & {
  fans: EntityTable<Fan, 'id'>
}

db.version(1).stores({
  fans: '++id, model, motorType, fanType, size, supply, poles, voltage, frequency, power, current, airflow, pressure, speed, noise, ambTempPerm, mass, insulation, ipClass, erpLevel, bepEfficiency, bepAirflow, bepPressure, direction',
})

export async function getFansCount(): Promise<number> {
  return db.fans.count()
}

export async function getFilteredFans(filters: {
  poles?: number[]
  supplies?: string[]
  voltages?: number[]
  frequencies?: number[]
  tags?: string[]
  search?: string
}): Promise<Fan[]> {
  let collection = db.fans.toCollection()

  if (filters.poles && filters.poles.length > 0) {
    collection = collection.filter(f => filters.poles!.includes(f.poles)) as typeof collection
  }
  if (filters.supplies && filters.supplies.length > 0) {
    collection = collection.filter(f => filters.supplies!.includes(f.supply)) as typeof collection
  }
  if (filters.voltages && filters.voltages.length > 0) {
    collection = collection.filter(f => filters.voltages!.includes(f.voltage)) as typeof collection
  }
  if (filters.frequencies && filters.frequencies.length > 0) {
    collection = collection.filter(f => filters.frequencies!.includes(f.frequency)) as typeof collection
  }
  if (filters.tags && filters.tags.length > 0) {
    collection = collection.filter(f => filters.tags!.some(t => f.industryRecommendations.includes(t))) as typeof collection
  }
  if (filters.search && filters.search.trim()) {
    const s = filters.search.toLowerCase()
    collection = collection.filter(f => f.model.toLowerCase().includes(s) || f.fanType.toLowerCase().includes(s)) as typeof collection
  }

  return collection.toArray()
}
