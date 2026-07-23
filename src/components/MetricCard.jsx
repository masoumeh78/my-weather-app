import { memo } from 'react'

function MetricCard({ label, value, icon }) {
  return (
    <article className="metric-card">
      <span className="metric-card__icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="metric-card__label">{label}</p>
        <p className="metric-card__value">{value}</p>
      </div>
    </article>
  )
}

export default memo(MetricCard)
