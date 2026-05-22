import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

export default function DeleteConfirmPopover({ isOpen, anchorRect, onClose, onConfirm }) {
  const popoverRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    function handleMouseDown(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen, onClose])

  if (!isOpen || !anchorRect) return null

  const style = {
    position: 'fixed',
    top: anchorRect.bottom + 6,
    right: window.innerWidth - anchorRect.right,
    background: '#2A2E3A',
    border: '1px solid #5A5E6B',
    borderRadius: 6,
    minWidth: 220,
    boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
    zIndex: 2000,
    padding: '14px 14px 12px',
    animation: 'deletePopoverFadeIn 0.13s ease',
  }

  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes deletePopoverFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div ref={popoverRef} style={style}>
        {/* Close button top-right */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#8A8D9A', padding: 2, borderRadius: 3,
            display: 'flex', alignItems: 'center',
          }}
          aria-label="Close"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Message */}
        <p style={{
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: 13,
          color: '#F5F5F6',
          margin: '0 0 12px',
          paddingRight: 18,
          lineHeight: 1.4,
        }}>
          Are you sure you want to delete?
        </p>

        {/* DELETE button */}
        <button
          onClick={onConfirm}
          style={{
            background: '#6B3E66',
            border: 'none',
            borderRadius: 4,
            padding: '8px 20px',
            cursor: 'pointer',
            fontFamily: "'Segoe UI', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: '#F5F5F6',
            letterSpacing: '0.06em',
            transition: 'filter 0.13s',
            display: 'inline-flex', alignItems: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
          DELETE
        </button>
      </div>
    </>,
    document.body
  )
}
