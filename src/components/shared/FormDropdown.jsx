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
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = value ? options.find(o => o.value === value) : null

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
        type="button"
        className={`fdp-trigger${open ? ' fdp-trigger--open' : ''}${error ? ' fdp-trigger--error' : ''}`}
        onClick={() => setOpen(o => !o)}
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
        <div className="fdp-panel" role="listbox">
          {options.map(opt => (
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
          {showSearchMore && (
            <div className="fdp-item fdp-item--search-more" aria-hidden="true">
              Search more…
            </div>
          )}
        </div>
      )}
    </div>
  )
}
