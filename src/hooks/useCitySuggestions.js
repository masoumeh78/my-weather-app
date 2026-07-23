import { useEffect, useRef, useState } from 'react'
import { fetchCitySuggestions } from '../services/weatherApi.js'

export function useCitySuggestions(query, { minLength = 2, debounceMs = 300 } = {}) {
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const abortRef = useRef(null)

  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < minLength) {
      setSuggestions([])
      setLoadingSuggestions(false)
      return
    }

    setLoadingSuggestions(true)

    const timeoutId = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const results = await fetchCitySuggestions(trimmed, {
          signal: controller.signal,
        })

        if (!controller.signal.aborted) {
          setSuggestions(results)
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !controller.signal.aborted) {
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSuggestions(false)
        }
      }
    }, debounceMs)

    return () => {
      clearTimeout(timeoutId)
      abortRef.current?.abort()
    }
  }, [query, minLength, debounceMs])

  return { suggestions, loadingSuggestions }
}
