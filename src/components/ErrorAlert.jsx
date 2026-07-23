import { memo } from 'react'

function ErrorAlert({ error, onDismiss }) {
  if (!error) return null

  const message = typeof error === 'string' ? error : error.message

  return (
    <div className="error-alert" role="alert">
      <div className="error-alert__content">
        <span className="error-alert__icon" aria-hidden="true">
          ⚠
        </span>
        <p>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="error-alert__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default memo(ErrorAlert)
