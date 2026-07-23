import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import { useWeather } from '../context/WeatherContext.jsx'
import { useCitySuggestions } from '../hooks/useCitySuggestions.js'

function SearchBar({ autoFocus = false }) {
  const { searchCity, loading, preferences, lastSearchedCity } = useWeather()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listboxId = useId()
  const { suggestions, loadingSuggestions } = useCitySuggestions(query)

  const showSuggestions =
    isOpen && query.trim().length >= 2 && (suggestions.length > 0 || loadingSuggestions)

  const closeSuggestions = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(-1)
  }, [])

  const selectCity = useCallback(
    async (cityQuery) => {
      closeSuggestions()
      setQuery('')

      try {
        await searchCity(cityQuery)
      } catch {
        // Error is handled in context
      }
    },
    [searchCity, closeSuggestions],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      await selectCity(suggestions[activeIndex].query)
      return
    }

    const city = query.trim() || preferences.defaultCity
    if (!city) return

    closeSuggestions()
    setQuery('')

    try {
      await searchCity(city)
    } catch {
      // Error is handled in context
    }
  }

  const handleInputChange = (event) => {
    setQuery(event.target.value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event) => {
    if (!showSuggestions) {
      if (event.key === 'ArrowDown' && query.trim().length >= 2) {
        setIsOpen(true)
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) =>
          index < suggestions.length - 1 ? index + 1 : 0,
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) =>
          index > 0 ? index - 1 : suggestions.length - 1,
        )
        break
      case 'Enter':
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          event.preventDefault()
          selectCity(suggestions[activeIndex].query)
        }
        break
      case 'Escape':
        closeSuggestions()
        break
      default:
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeSuggestions()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeSuggestions])

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__field" ref={containerRef}>
        <label htmlFor="city-search" className="visually-hidden">
          Search for a city
        </label>
        <input
          ref={inputRef}
          id="city-search"
          type="search"
          role="combobox"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            lastSearchedCity
              ? `Search another city (last: ${lastSearchedCity})`
              : `Search city (default: ${preferences.defaultCity})`
          }
          autoFocus={autoFocus}
          disabled={loading}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={showSuggestions ? listboxId : undefined}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
        />

        {showSuggestions && (
          <ul
            id={listboxId}
            className="search-suggestions"
            role="listbox"
            aria-label="City suggestions"
          >
            {loadingSuggestions && suggestions.length === 0 ? (
              <li className="search-suggestions__status" role="status">
                Searching cities…
              </li>
            ) : (
              suggestions.map((city, index) => (
                <li
                  key={city.id}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={
                    index === activeIndex
                      ? 'search-suggestions__item search-suggestions__item--active'
                      : 'search-suggestions__item'
                  }
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCity(city.query)}
                >
                  <span className="search-suggestions__name">{city.name}</span>
                  <span className="search-suggestions__meta">
                    {[city.state, city.country].filter(Boolean).join(', ')}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  )
}

export default memo(SearchBar)
