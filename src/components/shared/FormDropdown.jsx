import React, { useState, useEffect, useRef } from 'react'
import './FormDropdown.css'

function WorkerAvatar({ value, label }) {
  const [errored, setErrored] = useState(false)
  const initials = label.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (errored) {
    return <div className="fdp-worker-avatar fdp-worker-avatar--initials">{initials}</div>
  }
  return (
    <img
      className="fdp-worker-avatar"
      src={`/avatars/${value}.png`}
      alt={label}
      onError={() => setErrored(true)}
    />
  )
}

export default function FormDropdown({
  value,
  placeholder,
  options,
  onChange,
  onBlur,
  error,
  showWorkerPhotos = false,
  showSearchMore = false,
  maxVisible,
}) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const current = value ? options.find(o => o.value === value) : null
  // When a cap is set, only the first N options are listed (the rest live
  // behind "Show more…", which expands the list in place). The trigger still
  // shows the selected label even if it falls outside the visible slice.
  const capped = maxVisible && !expanded
  const visibleOptions = capped ? options.slice(0, maxVisible) : options
  const hasMore = maxVisible && options.length > maxVisible && !expanded

  // Open upward when the field is near the bottom of its scroll container and
  // there's more room above than below (keeps the panel from being clipped).
  function decideDirection() {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const PANEL_MAX = 264
    const below = window.innerHeight - r.bottom
    setDropUp(below < PANEL_MAX && r.top > below)
  }

  function toggleOpen() {
    setOpen(o => {
      const next = !o
      if (next) { decideDirection(); setExpanded(false) }
      return next
    })
  }

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        if (onBlur) onBlur()
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        if (onBlur) onBlur()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onBlur])

  return (
    <div ref={ref} className="fdp-wrap">
      <button
        ref={triggerRef}
        type="button"
        className={`fdp-trigger${open ? ' fdp-trigger--open' : ''}${error ? ' fdp-trigger--error' : ''}`}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`fdp-trigger__value${!current ? ' fdp-trigger__value--placeholder' : ''}`}>
          {current ? current.label : (placeholder || 'Select…')}
        </span>
        <svg
          className={`fdp-caret${open ? ' fdp-caret--open' : ''}`}
          width="10" height="10" viewBox="0 0 24 24"
          fill="none" stroke="#03F9E3" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className={`fdp-panel${dropUp ? ' fdp-panel--up' : ''}`} role="listbox">
          {visibleOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className={`fdp-item${opt.value === value ? ' fdp-item--selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false) }}
            >
              {showWorkerPhotos && <WorkerAvatar value={opt.value} label={opt.label} />}
              {opt.label}
            </button>
          ))}
          {showSearchMore && hasMore && (
            <button
              type="button"
              className="fdp-item fdp-item--search-more"
              onClick={() => setExpanded(true)}
            >
              Show more…
            </button>
          )}
        </div>
      )}
    </div>
  )
}
