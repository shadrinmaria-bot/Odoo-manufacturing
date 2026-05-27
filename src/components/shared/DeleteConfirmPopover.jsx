import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import './DeleteConfirmPopover.css'

export default function DeleteConfirmPopover({ isOpen, anchorRect, onClose, onConfirm }) {
  const popoverRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    function handleMouseDown(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen, onClose])

  if (!isOpen || !anchorRect) return null

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      className="dcp-panel"
      style={{
        '--popover-top':   `${anchorRect.bottom + 6}px`,
        '--popover-right': `${window.innerWidth - anchorRect.right}px`,
      }}
    >
      <button className="dcp-close-btn" onClick={onClose} aria-label="Close">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <p className="dcp-message">Are you sure you want to delete?</p>
      <button className="dcp-confirm-btn" onClick={onConfirm}>DELETE</button>
    </div>,
    document.body
  )
}
