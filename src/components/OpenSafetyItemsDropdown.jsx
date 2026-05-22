import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import DeleteConfirmPopover from './DeleteConfirmPopover'

function CriticalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#B83232" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M7.131 2.5a1 1 0 0 1 1.738 0l5.642 9.75A1 1 0 0 1 13.642 14H2.358a1 1 0 0 1-.869-1.5L7.131 2.5z" />
      <line x1="8" y1="6" x2="8" y2="9.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.7" fill="white" />
    </svg>
  )
}

function AttentionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.5" stroke="#E8A100" strokeWidth="1.4" />
      <line x1="8" y1="5" x2="8" y2="9" stroke="#E8A100" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.7" fill="#E8A100" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

function IncidentRow({ incident, onView, onRequestDelete }) {
  const [hovered, setHovered] = useState(false)
  const trashRef = useRef(null)

  function handleTrashClick(e) {
    e.stopPropagation()
    const rect = trashRef.current.getBoundingClientRect()
    onRequestDelete(incident.id, rect)
  }

  return (
    <div
      onClick={() => onView(incident)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 14px',
        cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      {/* Severity icon */}
      <div style={{ flexShrink: 0 }}>
        {incident.severity === 'critical' ? <CriticalIcon /> : <AttentionIcon />}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: 600, fontSize: 13, color: '#F5F5F6',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {incident.title}
        </span>
        <span style={{
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: 11, color: '#8A8D9A',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {incident.subtitle}
        </span>
      </div>

      {/* Trash button */}
      <button
        ref={trashRef}
        onClick={handleTrashClick}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: hovered ? '#8A8D9A' : 'transparent',
          padding: 4, borderRadius: 3,
          display: 'flex', alignItems: 'center',
          transition: 'color 0.12s',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#B83232'}
        onMouseLeave={e => e.currentTarget.style.color = hovered ? '#8A8D9A' : 'transparent'}
        aria-label="Delete incident"
      >
        <TrashIcon />
      </button>
    </div>
  )
}

export default function OpenSafetyItemsDropdown({
  isOpen,
  anchorRect,
  workCenterName,
  incidents,
  onClose,
  onViewIncident,
  onDeleteIncident,
}) {
  const dropdownRef = useRef(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    function handleMouseDown(e) {
      if (deleteTarget) return
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen, onClose, deleteTarget])

  // Reset deleteTarget when dropdown closes
  useEffect(() => {
    if (!isOpen) setDeleteTarget(null)
  }, [isOpen])

  if (!isOpen || !anchorRect) return null

  const dropdownStyle = {
    position: 'fixed',
    top: anchorRect.bottom + 6,
    right: window.innerWidth - anchorRect.right,
    width: 'min(360px, 90vw)',
    background: '#2A2E3A',
    border: '1px solid #5A5E6B',
    borderRadius: 6,
    boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
    zIndex: 1500,
    animation: 'dropdownFadeIn 0.13s ease',
    overflow: 'hidden',
  }

  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Dropdown panel */}
      <div ref={dropdownRef} style={dropdownStyle}>
        {/* Header */}
        <div style={{ padding: '12px 14px 8px' }}>
          <div style={{
            fontFamily: "'Segoe UI', sans-serif",
            fontWeight: 700, fontSize: 13, color: '#F5F5F6',
            marginBottom: 2,
          }}>
            Open Safety Items — {workCenterName}
          </div>
          <div style={{
            fontFamily: "'Segoe UI', sans-serif",
            fontSize: 12, color: '#8A8D9A',
          }}>
            {incidents.length} record{incidents.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#5A5E6B' }} />

        {/* List */}
        {incidents.length === 0 ? (
          <div style={{
            padding: '14px',
            fontFamily: "'Segoe UI', sans-serif",
            fontSize: 13, color: '#8A8D9A',
            textAlign: 'center',
          }}>
            No open safety items.
          </div>
        ) : (
          incidents.map((incident, idx) => (
            <div
              key={incident.id}
              style={{
                borderBottom: idx < incidents.length - 1 ? '1px solid rgba(90,94,107,0.4)' : 'none',
              }}
            >
              <IncidentRow
                incident={incident}
                onView={(inc) => { onViewIncident(inc); onClose() }}
                onRequestDelete={(incidentId, rect) => setDeleteTarget({ incidentId, anchorRect: rect })}
              />
            </div>
          ))
        )}
      </div>

      {/* Delete confirm popover — rendered in same portal fragment */}
      <DeleteConfirmPopover
        isOpen={!!deleteTarget}
        anchorRect={deleteTarget?.anchorRect}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          onDeleteIncident(deleteTarget.incidentId)
          setDeleteTarget(null)
        }}
      />
    </>,
    document.body
  )
}
