import React, { useState } from 'react'

// ── Design tokens ──────────────────────────────────────────────────────────────

const TOTAL_W   = 123
const ARROW_W   = 19.33
const DIVIDER_W = 1
const LABEL_W   = TOTAL_W - ARROW_W - DIVIDER_W   // ≈ 102.67
const BADGE_H   = 22
const FONT      = "'Segoe UI', sans-serif"
const FONT_SIZE = 11.87
const FONT_W    = 600

const VARIANTS = {
  red: {
    labelBg:       '#F9464C',
    labelBgActive: '#FF6267',
    labelText:     '#ffffff',
    stroke:        null,
    divider:       '#C93438',          // slightly darker red
    arrowBg:       '#F9464C',
    arrowHoverBg:  '#FB8F92',          // +20% lightness
    arrowActiveBg: '#FF6267',
    arrowText:     '#ffffff',
  },
  orange: {
    labelBg:       'transparent',
    labelBgActive: 'rgba(251,185,69,0.30)',
    labelText:     '#FBB945',
    stroke:        '#FBB945',
    divider:       '#FBB945',
    arrowBg:       'rgba(251,185,69,0.15)',
    arrowHoverBg:  '#FCD47A',          // +20% lightness
    arrowActiveBg: 'rgba(251,185,69,0.30)',
    arrowText:     '#FBB945',
  },
  green: {
    labelBg:       'transparent',
    labelBgActive: 'rgba(60,201,98,0.30)',
    labelText:     '#3CC962',
    stroke:        '#3CC962',
    divider:       '#3CC962',
    arrowBg:       'rgba(60,201,98,0.15)',
    arrowHoverBg:  '#78D990',          // +20% lightness
    arrowActiveBg: 'rgba(60,201,98,0.30)',
    arrowText:     '#3CC962',
  },
}

// ── Chevron ───────────────────────────────────────────────────────────────────

function Chevron({ up, color }) {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      {up
        ? <path d="M1 4.5L4 1.5L7 4.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M1 1L4 4L7 1"        stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  )
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

export default function StatusBadge({
  label    = '0 Open incidents',
  variant  = 'red',
  isOpen   = false,
  onToggle = () => {},
}) {
  const [arrowHovered, setArrowHovered] = useState(false)
  const [arrowPressed, setArrowPressed]  = useState(false)

  const v = VARIANTS[variant] ?? VARIANTS.red

  const arrowBg = arrowPressed
    ? v.arrowActiveBg
    : arrowHovered
      ? v.arrowHoverBg
      : v.arrowBg

  return (
    <div
      style={{
        display:    'inline-flex',
        alignItems: 'stretch',
        height:     BADGE_H,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* ── Label part — left corners rounded only ── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          LABEL_W,
          padding:        '5px 10.5px',
          background:     v.labelBg,
          border:         v.stroke ? `1px solid ${v.stroke}` : 'none',
          borderRight:    'none',
          borderRadius:   '4px 0 0 4px',
          fontFamily:     FONT,
          fontWeight:     FONT_W,
          fontSize:       FONT_SIZE,
          color:          v.labelText,
          whiteSpace:     'nowrap',
          lineHeight:     1,
          boxSizing:      'border-box',
        }}
      >
        {label}
      </div>

      {/* ── 1px divider ── */}
      <div
        style={{
          width:      DIVIDER_W,
          background: v.divider,
          flexShrink: 0,
          // If orange/green has a stroke border, the divider replaces the shared edge
        }}
      />

      {/* ── Arrow button — right corners rounded only ── */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setArrowHovered(true)}
        onMouseLeave={() => { setArrowHovered(false); setArrowPressed(false) }}
        onMouseDown={() => setArrowPressed(true)}
        onMouseUp={() => setArrowPressed(false)}
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          ARROW_W,
          height:         BADGE_H,
          background:     arrowBg,
          border:         v.stroke ? `1px solid ${v.stroke}` : 'none',
          borderLeft:     'none',
          borderRadius:   '0 4px 4px 0',
          padding:        0,
          cursor:         'pointer',
          flexShrink:     0,
          transition:     'background 0.12s',
          boxSizing:      'border-box',
        }}
        aria-label={isOpen ? 'Collapse' : 'Expand'}
      >
        <Chevron up={isOpen} color={v.arrowText} />
      </button>
    </div>
  )
}
