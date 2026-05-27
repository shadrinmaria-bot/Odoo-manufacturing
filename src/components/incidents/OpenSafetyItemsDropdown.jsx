import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Icon from '../shared/Icon'
import './OpenSafetyItemsDropdown.css'

function CriticalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#F9464C" xmlns="http://www.w3.org/2000/svg" className="osd-row__icon">
      <path d="M7.131 2.5a1 1 0 0 1 1.738 0l5.642 9.75A1 1 0 0 1 13.642 14H2.358a1 1 0 0 1-.869-1.5L7.131 2.5z" />
      <line x1="8" y1="6" x2="8" y2="9.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.7" fill="white" />
    </svg>
  )
}

function AttentionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="osd-row__icon">
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
  return (
    <div className="osd-row" onClick={() => onView(incident)}>
      <div className="osd-row__icon">
        {incident.severity === 'critical' ? <CriticalIcon /> : <AttentionIcon />}
      </div>
      <div className="osd-row__text">
        <span className="osd-row__title">{incident.title}</span>
        <span className="osd-row__subtitle">{incident.subtitle}</span>
      </div>
      <button
        className="osd-row__arrow"
        onClick={(e) => { e.stopPropagation(); onView(incident) }}
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

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className="osd-panel"
      style={{
        '--dropdown-top':   `${anchorRect.bottom + 6}px`,
        '--dropdown-right': `${window.innerWidth - anchorRect.right}px`,
      }}
    >
      <div className="osd-header">
        <div className="osd-header__title">Open Safety Items — {workCenterName}</div>
        <div className="osd-header__count">
          {incidents.length} record{incidents.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="osd-divider" />

      {incidents.length === 0 ? (
        <div className="osd-empty">No open safety items.</div>
      ) : (
        incidents.map((incident) => (
          <div key={incident.id} className="osd-item">
            <IncidentRow
              incident={incident}
              onView={(inc) => { onViewIncident(inc); onClose() }}
            />
          </div>
        ))
      )}

      <div className="osd-divider" />

      <div className="osd-footer">
        <button
          className="osd-report-btn"
          onClick={() => { onClose(); onReportIncident?.() }}
        >
          <Icon char="" size={12} />
          REPORT INCIDENT
        </button>
      </div>
    </div>,
    document.body
  )
}
