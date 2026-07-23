import { memo } from 'react'

function LoadingSpinner({ label = 'Loading weather data…' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export default memo(LoadingSpinner)
