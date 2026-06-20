import React from 'react'
import './IncidentStatusBar.css'

const H  = 24    // chevron height px
const D  = 8     // arrow / notch depth px
const S  = 0.5   // inset from SVG edge so full stroke is visible inside viewBox

const STAGES = [
  { key: 'open',         label: 'Incident Open', w: 110 },
  { key: 'shared',       label: 'Shared',        w: 68  },
  { key: 'investigated', label: 'Investigated',  w: 96  },
  { key: 'resolved',     label: 'Resolved',      w: 78  },
]

const STAGE_ORDER = Object.fromEntries(STAGES.map((s, i) => [s.key, i]))

function chevronPts(w, pos) {
  const r = w - S, b = H - S, m = H / 2
  const pairs =
    pos === 'first'
      ? [[S,S], [r-D,S], [r,m], [r-D,b], [S,b]]
      : pos === 'last'
      ? [[S,S], [r,S], [r,b], [S,b], [D+S,m]]
      : [[S,S], [r-D,S], [r,m], [r-D,b], [S,b], [D+S,m]]
  return pairs.map(([x, y]) => `${x},${y}`).join(' ')
}

export default function IncidentStatusBar({ status = 'open' }) {
  const currentIdx = STAGE_ORDER[status] ?? 0

  return (
    <div className="isb" role="progressbar" aria-label="Incident status">
      {STAGES.map(({ key, label, w }, idx) => {
        const isActive = idx === currentIdx
        const pos    = idx === 0 ? 'first' : idx === STAGES.length - 1 ? 'last' : 'middle'
        const fill   = isActive ? '#17373B' : '#3C3E4B'
        const stroke = isActive ? '#03F9E3' : '#5A5E6B'
        const color  = isActive ? '#03F9E3' : '#8A8D9A'
        const textX  = pos === 'first' ? (w - D) / 2 : pos === 'last' ? (w + D) / 2 : w / 2

        return (
          <svg
            key={key}
            className="isb__seg"
            width={w}
            height={H}
            viewBox={`0 0 ${w} ${H}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <polygon
              points={chevronPts(w, pos)}
              fill={fill}
              stroke={stroke}
              strokeWidth="1"
              strokeLinejoin="miter"
            />
            <text
              x={textX}
              y={H / 2}
              dominantBaseline="middle"
              textAnchor="middle"
              fill={color}
              fontSize="11"
              fontWeight="600"
              fontFamily="'Segoe UI', sans-serif"
            >
              {label}
            </text>
          </svg>
        )
      })}
    </div>
  )
}
