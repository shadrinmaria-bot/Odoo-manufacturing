import React from 'react'
import Icon from '../shared/Icon'
import './StatusBadge.css'

export default function StatusBadge({
  label    = '0 Open incidents',
  variant  = 'red',
  isOpen   = false,
  onToggle = () => {},
}) {
  return (
    <button
      onClick={onToggle}
      className={`status-badge status-badge--${variant}`}
      aria-label={isOpen ? 'Collapse' : 'Expand'}
    >
      {label}
      <span className="status-badge__caret">
        <Icon char={isOpen ? '' : ''} size={11} />
      </span>
    </button>
  )
}
