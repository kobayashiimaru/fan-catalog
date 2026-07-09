import { useState, useEffect } from 'react'
import type { Fan } from '@/types/fan'
import { db, getFilteredFans } from '@/db/db'
import { generateSeedData } from '@/db/seed'
import { useFilterStore } from '@/store/filterStore'

export function useFanData() {
  const [fans, setFans] = useState<Fan[]>([])
  const [loading, setLoading] = useState(true)
  const [seeded, setSeeded] = useState(false)

  const { poles, supplies, voltages, frequencies, tags, search } = useFilterStore()

  useEffect(() => {
    async function init() {
      const count = await db.fans.count()
      if (count === 0) {
        const data = generateSeedData()
        await db.fans.bulkAdd(data)
      }
      setSeeded(true)
    }
    void init()
  }, [])

  useEffect(() => {
    if (!seeded) return
    setLoading(true)
    const timer = setTimeout(async () => {
      const result = await getFilteredFans({ poles, supplies, voltages, frequencies, tags, search })
      setFans(result)
      setLoading(false)
    }, 150)
    return () => clearTimeout(timer)
  }, [seeded, poles, supplies, voltages, frequencies, tags, search])

  return { fans, loading }
}
