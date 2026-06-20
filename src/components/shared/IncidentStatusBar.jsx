import React from 'react'
import './IncidentStatusBar.css'

const STAGES = [
  { key: 'open',         label: 'Incident Open' },
  { key: 'shared',       label: 'Shared'        },
  { key: 'investigated', label: 'Investigated'  },
  { key: 'resolved',     label: 'Resolved'      },
]

const STAGE_ORDER = Object.fromEntries(STAGES.map((s, i) => [s.key, i]))

export default function IncidentStatusBar({ status = 'open' }) {
  const currentIdx = STAGE_ORDER[status] ?? 0

  return (
    <div className="isb" role="progressbar" aria-label="Incident status">
      {STAGES.map((stage, idx) => {
        const isActive = idx === currentIdx

        return (
          <div
            key={stage.key}
            className={['isb__seg', isActive ? 'isb__seg--active' : 'isb__seg--inactive'].join(' ')}
            aria-current={isActive ? 'step' : undefined}
          >
            {stage.label}
          </div>
        )
      })}
    </div>
  )
}
