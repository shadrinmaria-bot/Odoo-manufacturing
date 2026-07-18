import React from 'react'
import './IncidentStatusBar.css'

const H = 33    // chevron height px
const D = 11    // arrow / notch depth px
const S = 0.5   // polygon inset so stroke stays within viewBox

// Sharing an incident moves it straight to "Investigated" — there is no
// separate Shared stage, so the bar shows the three real stages only.
const STAGES = [
  { key: 'open',         label: 'Incident Open', w: 118 },
  { key: 'investigated', label: 'Investigated',  w: 104 },
  { key: 'resolved',     label: 'Resolved',      w: 86  },
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
  // An incident that was shared but not yet given a later stage still reads as
  // "investigated", since sharing is what advances it.
  const key = status === 'shared' ? 'investigated' : status
  const currentIdx = STAGE_ORDER[key] ?? 0

  return (
    <div className="isb" role="progressbar" aria-label="Incident status">
      {STAGES.map(({ key: stageKey, label, w }, idx) => {
        const isActive = idx === currentIdx
        const pos    = idx === 0 ? 'first' : idx === STAGES.length - 1 ? 'last' : 'middle'
        const fill   = isActive ? '#17373B' : '#3C3E4B'
        const stroke = isActive ? '#03F9E3' : 'none'
        const color  = isActive ? '#FFFFFF' : '#6B6E7C'
        const textX  = pos === 'first' ? (w - D) / 2 : pos === 'last' ? (w + D) / 2 : w / 2

        return (
          <svg
            key={stageKey}
            className="isb__seg"
            width={w}
            height={H}
            viewBox={`0 0 ${w} ${H}`}
            // Each segment slides left by the notch depth so its notch sits over
            // the previous segment's point — without this the tapers leave
            // bowtie-shaped gaps between the chevrons.
            style={idx > 0 ? { marginLeft: -D } : undefined}
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
              style={{ fill: color }}
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
