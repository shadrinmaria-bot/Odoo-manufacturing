import React from 'react'
import './IncidentStatusBar.css'

const STAGES = [
  { key: 'open',         label: 'Incident open' },
  { key: 'shared',       label: 'Shared'        },
  { key: 'investigated', label: 'Investigated'  },
  { key: 'resolved',     label: 'Resolved'      },
]

const STAGE_ORDER = Object.fromEntries(STAGES.map((s, i) => [s.key, i]))

export default function IncidentStatusBar({ status = 'open', onStageClick }) {
  const currentIdx = STAGE_ORDER[status] ?? 0

  return (
    <div className="isb" role="progressbar" aria-label="Incident status">
      {STAGES.map((stage, idx) => {
        const isActive    = idx === currentIdx
        const isFuture    = idx > currentIdx
        const isClickable = isFuture && !!onStageClick

        return (
          <button
            key={stage.key}
            type="button"
            className={[
              'isb__seg',
              isActive    ? 'isb__seg--active'    : 'isb__seg--inactive',
              isClickable ? 'isb__seg--clickable' : '',
            ].join(' ').trim()}
            disabled={!isClickable}
            onClick={isClickable ? () => onStageClick(stage.key) : undefined}
            aria-current={isActive ? 'step' : undefined}
          >
            {stage.label}
          </button>
        )
      })}
    </div>
  )
}
