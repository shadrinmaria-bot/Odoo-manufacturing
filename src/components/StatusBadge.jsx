import React, { useState } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────────

const BADGE_H      = 22
const ARROW_W      = 19.33
const FONT         = "'Segoe UI', sans-serif"
const FONT_SIZE    = 11.87
const FONT_WEIGHT  = 600

// Variant token map
const VARIANTS = {
  red: {
    labelBg:       '#F9464C',
    labelBgActive: '#FF6267',
    labelText:     '#ffffff',
    stroke:        'none',
    divider:       'rgba(255,255,255,0.35)',
    arrowBg:       '#F9464C',
    arrowHoverBg:  '#FB8F92',   // #F9464C lightened ~20%
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
    arrowHoverBg:  '#FCD47A',   // #FBB945 lightened ~20%
    arrowActiveBg: 'rgba(251,185,69,0.30)',
    arrowText:     '#FBB945',
  },
  grey: {
    labelBg:       'rgba(255,255,255,0.08)',
    labelBgActive: 'rgba(255,255,255,0.12)',
    labelText:     '#71717A',
    stroke:        'rgba(255,255,255,0.12)',
    divider:       'rgba(255,255,255,0.15)',
    arrowBg:       'rgba(255,255,255,0.06)',
    arrowHoverBg:  'rgba(255,255,255,0.14)',
    arrowActiveBg: 'rgba(255,255,255,0.18)',
    arrowText:     '#71717A',
  },
}

// ── Chevron SVG ───────────────────────────────────────────────────────────────

function Chevron({ up, color }) {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
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
  disabled = false,
}) {
  const [arrowHovered, setArrowHovered] = useState(false)
  const [arrowPressed, setArrowPressed]  = useState(false)

  const v = VARIANTS[disabled ? 'grey' : variant] ?? VARIANTS.red

  // Label section width = total - arrow width
  const labelW = 123 - ARROW_W

  // Arrow bg resolves: pressed → active, hovered → hover, else default
  const arrowBg = arrowPressed
    ? v.arrowActiveBg
    : arrowHovered
      ? v.arrowHoverBg
      : v.arrowBg

  const containerStyle = {
    display:      'inline-flex',
    alignItems:   'stretch',
    height:       BADGE_H,
    width:        123,
    borderRadius: 21,
    overflow:     'hidden',
    border:       v.stroke !== 'none' ? `1px solid ${v.stroke}` : 'none',
    flexShrink:   0,
    cursor:       disabled ? 'not-allowed' : 'default',
    userSelect:   'none',
  }

  const labelStyle = {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    width:          labelW,
    padding:        `5px 10.5px`,
    background:     v.labelBg,
    fontFamily:     FONT,
    fontWeight:     FONT_WEIGHT,
    fontSize:       FONT_SIZE,
    color:          v.labelText,
    whiteSpace:     'nowrap',
    lineHeight:     1,
    gap:            5,
  }

  const dividerStyle = {
    width:      1,
    background: v.divider,
    flexShrink: 0,
    alignSelf:  'stretch',
  }

  const arrowStyle = {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    width:          ARROW_W,
    height:         BADGE_H,
    background:     arrowBg,
    border:         'none',
    padding:        0,
    cursor:         disabled ? 'not-allowed' : 'pointer',
    flexShrink:     0,
    transition:     'background 0.12s',
  }

  return (
    <div style={containerStyle}>
      {/* Label section */}
      <div style={labelStyle}>
        {label}
      </div>

      {/* Divider */}
      <div style={dividerStyle} />

      {/* Arrow button */}
      <button
        style={arrowStyle}
        onClick={disabled ? undefined : onToggle}
        onMouseEnter={() => !disabled && setArrowHovered(true)}
        onMouseLeave={() => { setArrowHovered(false); setArrowPressed(false) }}
        onMouseDown={() => !disabled && setArrowPressed(true)}
        onMouseUp={() => setArrowPressed(false)}
        aria-label={isOpen ? 'Collapse' : 'Expand'}
        disabled={disabled}
      >
        <Chevron up={isOpen} color={v.arrowText} />
      </button>
    </div>
  )
}
