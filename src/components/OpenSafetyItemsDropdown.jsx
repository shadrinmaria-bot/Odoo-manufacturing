import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

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
      <circle cx="8" cy="8" r="6.5" stroke="#008FE3" strokeWidth="1.4" />
      <line x1="8" y1="5" x2="8" y2="9" stroke="#008FE3" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.7" fill="#008FE3" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IncidentRow({ incident, onView }) {
  const [hovered, setHovered] = useState(false)

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

      {/* Arrow — opens incident detail */}
      <button
        onClick={(e) => { e.stopPropagation(); onView(incident) }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: hovered ? '#8A8D9A' : 'transparent',
          padding: 4, borderRadius: 3,
          display: 'flex', alignItems: 'center',
          transition: 'color 0.12s',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#F5F5F6'}
        onMouseLeave={e => e.currentTarget.style.color = hovered ? '#8A8D9A' : 'transparent'}
        aria-label="View incident"
      >
        <ChevronRightIcon />
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
  onReportIncident,
}) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    function handleMouseDown(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen, onClose])

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
              />
            </div>
          ))
        )}

        {/* Divider before footer */}
        <div style={{ height: 1, background: '#5A5E6B' }} />

        {/* Report Incident button */}
        <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => { onClose(); onReportIncident?.() }}
            className="hover:brightness-110 transition-all"
            style={{
              background: '#B83232', borderRadius: 4,
              fontFamily: "'Segoe UI', sans-serif", fontWeight: 600,
              fontSize: 13, color: '#F5F5F6', border: 'none', cursor: 'pointer',
              height: 33, whiteSpace: 'nowrap', minWidth: 158,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Report Incident
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
