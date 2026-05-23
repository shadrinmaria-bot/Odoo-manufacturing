import React, { useState } from 'react'
import Icon from './Icon'

// ── Design tokens ──────────────────────────────────────────────────────────────

const ARROW_W   = 19.33
const BADGE_H   = 22
const FONT      = "'Segoe UI', sans-serif"
const FONT_SIZE = 11.87
const FONT_W    = 600

const VARIANTS = {
  // Critical — solid red fill with black text. The arrow lightens to
  // #FF6267 when hovered or while the dropdown is open.
  red: {
    labelBg:       '#F9464C',
    labelText:     '#000000',
    stroke:        '#F9464C',
    arrowBg:       '#F9464C',
    arrowHoverBg:  '#FF6267',
    arrowOpenBg:   '#FF6267',
    arrowText:     '#000000',
  },
  // Warning — outlined-only by default (transparent label + yellow border
  // + yellow text). The arrow fills with 30% opacity yellow on hover/open.
  orange: {
    labelBg:       'transparent',
    labelText:     '#FBB945',
    stroke:        '#FBB945',
    arrowBg:       'transparent',
    arrowHoverBg:  'rgba(251,185,69,0.30)',
    arrowOpenBg:   'rgba(251,185,69,0.30)',
    arrowText:     '#FBB945',
  },
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

  // Grey zero-state: static pill, no arrow, no divider, full 4px radius
  if (variant === 'grey') {
    return (
      <div
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          justifyContent: 'center',
          height:         BADGE_H,
          padding:        '5px 10px',
          background:     '#3A3F4B',
          borderRadius:   4,
          fontFamily:     FONT,
          fontWeight:     FONT_W,
          fontSize:       FONT_SIZE,
          color:          '#ffffff',
          whiteSpace:     'nowrap',
          lineHeight:     1,
          boxSizing:      'border-box',
          userSelect:     'none',
          flexShrink:     0,
        }}
      >
        {label}
      </div>
    )
  }

  const v = VARIANTS[variant] ?? VARIANTS.red

  // Arrow gets the darker "open" shade when the dropdown is open or while
  // the user is mid-click. Closed + idle keeps the same fill as the label so
  // the badge reads as one continuous shape.
  const arrowBg = (isOpen || arrowPressed)
    ? v.arrowOpenBg
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
        gap:        2,
      }}
    >
      {/* ── Label part — left corners rounded only ── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '5px 10px',
          background:     v.labelBg,
          border:         v.stroke ? `1px solid ${v.stroke}` : 'none',
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

      {/* ── Arrow button ── */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setArrowHovered(true)}
        onMouseLeave={() => { setArrowHovered(false); setArrowPressed(false) }}
        onMouseDown={(e) => { e.stopPropagation(); setArrowPressed(true) }}
        onMouseUp={() => setArrowPressed(false)}
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          ARROW_W,
          height:         BADGE_H,
          background:     arrowBg,
          border:         v.stroke ? `1px solid ${v.stroke}` : 'none',
          borderRadius:   '0 4px 4px 0',
          padding:        0,
          cursor:         'pointer',
          flexShrink:     0,
          transition:     'background 0.12s',
          boxSizing:      'border-box',
        }}
        aria-label={isOpen ? 'Collapse' : 'Expand'}
      >
        <Icon char={isOpen ? '' : ''} size={10} color={v.arrowText} />
      </button>
    </div>
  )
}
