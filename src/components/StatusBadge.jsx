import React, { useState } from 'react'
import Icon from './Icon'

// ── Design tokens ──────────────────────────────────────────────────────────────

const BADGE_H   = 22
const FONT      = "'Segoe UI', sans-serif"
const FONT_SIZE = 11.87
const FONT_W    = 600

const VARIANTS = {
  red: {
    bg:       '#F9464C',
    activeBg: '#FF6267',
    text:     '#000000',
  },
  blue: {
    bg:       '#008FE3',
    activeBg: 'rgba(0,143,227,0.7)',
    text:     '#000000',
  },
}

// Shared sizing applied identically to all three variants
const SHARED = {
  display:      'inline-flex',
  alignItems:   'center',
  gap:          3,
  height:       BADGE_H,
  padding:      '5px',
  borderRadius: 4,
  fontFamily:   FONT,
  fontWeight:   FONT_W,
  fontSize:     FONT_SIZE,
  whiteSpace:   'nowrap',
  lineHeight:   1,
  boxSizing:    'border-box',
  userSelect:   'none',
  flexShrink:   0,
  border:       'none',
  cursor:       'pointer',
}

// Arrow: matches the search bar dropdown caret exactly — FontAwesome fa-caret-down/up, size 11
function Caret({ isOpen, color, style }) {
  return (
    <Icon
      char={isOpen ? '' : ''}
      size={11}
      color={color}
      style={{ flexShrink: 0, ...style }}
    />
  )
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

  if (variant === 'grey') {
    return (
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ ...SHARED, background: '#3A3F4B', color: '#ffffff' }}
        aria-label={isOpen ? 'Collapse' : 'Expand'}
      >
        {label}
        <Caret isOpen={isOpen} color="#ffffff" style={{ opacity: hovered ? 1 : 0.5, transition: 'opacity 0.12s' }} />
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
        ...SHARED,
        background: pressed ? v.activeBg : v.bg,
        color:      v.text,
        filter:     hovered && !pressed ? 'brightness(1.2)' : 'none',
        transition: 'filter 0.12s, background 0.12s',
      }}
      aria-label={isOpen ? 'Collapse' : 'Expand'}
    >
      {label}
      <Caret isOpen={isOpen} color={v.text} />
    </button>
  )
}
