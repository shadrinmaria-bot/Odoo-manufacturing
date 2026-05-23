import React, { useState } from 'react'
import Icon from './Icon'

// ── Design tokens ──────────────────────────────────────────────────────────────

const ARROW_W   = 19.33
const BADGE_H   = 22
const FONT      = "'Segoe UI', sans-serif"
const FONT_SIZE = 11.87
const FONT_W    = 600

const VARIANTS = {
  red: {
    labelBg:       'transparent',
    labelBgActive: 'rgba(249,70,76,0.20)',
    labelText:     '#F9464C',
    stroke:        '#F9464C',
    divider:       '#F9464C',
    arrowBg:       'rgba(249,70,76,0.15)',
    arrowHoverBg:  'rgba(249,70,76,0.30)',
    arrowActiveBg: 'rgba(249,70,76,0.35)',
    arrowText:     '#F9464C',
  },
  orange: {
    labelBg:       'transparent',
    labelBgActive: 'rgba(251,185,69,0.30)',
    labelText:     '#FBB945',
    stroke:        '#FBB945',
    divider:       '#FBB945',
    arrowBg:       'rgba(251,185,69,0.15)',
    arrowHoverBg:  'rgba(251,185,69,0.32)',
    arrowActiveBg: 'rgba(251,185,69,0.42)',
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
