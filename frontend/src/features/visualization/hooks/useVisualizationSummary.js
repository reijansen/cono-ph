import { useCallback, useEffect, useState } from 'react'

import { fetchDashboardSummary } from '@/services/catalogService'

export function useVisualizationSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchDashboardSummary()
      setSummary(data)
    } catch (loadError) {
      setSummary(null)
      setError(loadError instanceof Error ? loadError : new Error('Unable to load visualization data'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    reload().catch(() => {
      if (!active) return
    })

    return () => {
      active = false
    }
  }, [reload])

  return { summary, loading, error, reload }
}
