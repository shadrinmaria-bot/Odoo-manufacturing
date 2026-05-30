import React, { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import './FormDropdown.css'

function Caret({ open }) {
  return (
    <span className="form-dd__caret">
      <Icon char={open ? '' : ''} size={11} color="#F5F5F6" />
    </span>
  )
}

function InitialsCircle({ text }) {
  return <span className="form-dd__avatar form-dd__avatar--fallback">{text || '?'}</span>
}

function WorkerAvatar({ src, initial }) {
  const [errored, setErrored] = useState(false)
  useEffect(() => { setErrored(false) }, [src])
  if (!src || errored) return <InitialsCircle text={initial} />
  return (
    <img
      src={src}
      alt=""
      className="form-dd__avatar form-dd__avatar--img"
      onError={() => setErrored(true)}
    />
  )
}

export default function FormDropdown({
  value,
  options,
  onChange,
  placeholder = 'Select…',
  error = false,
  onBlur,
  withAvatars = false,
  footerLabel,
  panelMinWidth,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)

  const current = options.find(o => o.value === value) || null
  const displayLabel = current ? current.label : placeholder

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        if (onBlur) onBlur()
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        if (onBlur) onBlur()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onBlur])

  function selectOption(val) {
    onChange(val)
    setOpen(false)
    if (onBlur) onBlur()
    triggerRef.current?.focus()
  }

  const triggerClass = [
    'form-dd__trigger',
    open       ? 'form-dd__trigger--open'  : '',
    error      ? 'form-dd__trigger--error' : '',
    !current   ? 'form-dd__trigger--empty' : '',
  ].filter(Boolean).join(' ')

  return (
    <div ref={ref} className="form-dd">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className="form-dd__value">{displayLabel}</span>
        <Caret open={open} />
      </button>

      {open && (
        <div
          className="form-dd__panel"
          style={panelMinWidth ? { minWidth: panelMinWidth } : undefined}
          role="listbox"
        >
          {options.map(opt => {
            const selected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectOption(opt.value)}
                className={`form-dd__item${selected ? ' form-dd__item--selected' : ''}`}
              >
                {withAvatars && (
                  <WorkerAvatar src={opt.avatar} initial={opt.initial} />
                )}
                <span className="form-dd__item-label">{opt.label}</span>
              </button>
            )
          })}
          {footerLabel && (
            <div className="form-dd__footer" aria-hidden="true">
              {footerLabel}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
