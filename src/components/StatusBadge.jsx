import React, { useState } from 'react'

// ── Design tokens ──────────────────────────────────────────────────────────────

const BADGE_H   = 22
const FONT      = "'Segoe UI', sans-serif"
const FONT_SIZE = 11.87
const FONT_W    = 600

const VARIANTS = {
  red: {
    bg:       '#F9464C',
    activeBg: '#FF6267',
    text:     '#ffffff',
  },
  blue: {
    bg:       '#008FE3',
    activeBg: 'rgba(0,143,227,0.7)',
    text:     '#000000',
  },
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

export default function StatusBadge({
  label    = '0 Open incidents',
  variant  = 'red',
  isOpen   = false,
  onToggle = () => {},
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  // Grey state: button with chevron — no background hover, only chevron opacity changes
  if (variant === 'grey') {
    return (
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            6,
          height:         BADGE_H,
          padding:        '5px 10.5px',
          background:     '#3A3F4B',
          border:         'none',
          borderRadius:   4,
          fontFamily:     FONT,
          fontWeight:     FONT_W,
          fontSize:       FONT_SIZE,
          color:          '#ffffff',
          whiteSpace:     'nowrap',
          lineHeight:     1,
          cursor:         'pointer',
          boxSizing:      'border-box',
          userSelect:     'none',
          flexShrink:     0,
        }}
        aria-label={isOpen ? 'Collapse' : 'Expand'}
      >
        {label}
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ flexShrink: 0, opacity: hovered ? 1 : 0.5, transition: 'opacity 0.12s' }}>
          {isOpen
            ? <path d="M1 4.5L4 1.5L7 4.5" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M1 1L4 4L7 1" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
      </button>
    )
  }

  const v = VARIANTS[variant] ?? VARIANTS.red

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            6,
        height:         BADGE_H,
        padding:        '5px 10.5px',
        minWidth:       123,
        background:     pressed ? v.activeBg : v.bg,
        border:         'none',
        borderRadius:   4,
        fontFamily:     FONT,
        fontWeight:     FONT_W,
        fontSize:       FONT_SIZE,
        color:          v.text,
        whiteSpace:     'nowrap',
        lineHeight:     1,
        cursor:         'pointer',
        userSelect:     'none',
        flexShrink:     0,
        boxSizing:      'border-box',
        filter:         hovered && !pressed ? 'brightness(1.2)' : 'none',
        transition:     'filter 0.12s, background 0.12s',
      }}
      aria-label={isOpen ? 'Collapse' : 'Expand'}
    >
      {label}
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ flexShrink: 0 }}>
        {isOpen
          ? <path d="M1 4.5L4 1.5L7 4.5" stroke={v.text} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M1 1L4 4L7 1" stroke={v.text} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </button>
  )
}
