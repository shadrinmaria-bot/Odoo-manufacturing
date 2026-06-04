import React, { useState, useEffect, useRef } from 'react'
import './ToastNotification.css'

export default function ToastNotification({ severity, onClose }) {
  const [dismissing, setDismissing] = useState(false)
  const dismissedRef = useRef(false)

  function dismiss() {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setDismissing(true)
    setTimeout(onClose, 280)
  }

  useEffect(() => {
    const t = setTimeout(dismiss, 4000)
    return () => clearTimeout(t)
  }, [])

  const color = severity === 'critical' ? 'var(--color-danger)' : 'var(--color-info)'

  return (
    <div className={`toast${dismissing ? ' toast--dismissing' : ''}`}>
      <div className="toast__row">
        <div className="toast__bar" style={{ background: color }} />
        <div className="toast__content">
          <span className="toast__text">Overview has been updated</span>
          <button className="toast__close" onClick={dismiss} aria-label="Dismiss">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="toast__progress" style={{ background: color }} />
    </div>
  )
}
