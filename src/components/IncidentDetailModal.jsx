import React, { useEffect, useRef } from 'react'

const FONT = "'Segoe UI', sans-serif"

// ── Injury icon SVGs (22x22, stroke="white") ──────────────────────────────────

const INJURY_ICONS = {
  overexertion: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" /><path d="M12 7v5l3 3" /><path d="M9 12l-3 2" /><path d="M12 12l3 2" /><path d="M9 17l-1 3" /><path d="M15 17l1 3" />
    </svg>
  ),
  'other-exertions': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" /><path d="M12 7v6" /><path d="M9 10l3 2 3-2" /><path d="M10 20l2-7 2 7" />
    </svg>
  ),
  repetitive: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
    </svg>
  ),
  'fall-same': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" /><path d="M8 9l4 3-4 4" /><path d="M3 20h18" /><path d="M16 14l-4-2" />
    </svg>
  ),
  roadway: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="10" width="22" height="8" rx="2" /><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
    </svg>
  ),
  'struck-against': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5" r="2" /><path d="M8 7v5l5 3" /><rect x="15" y="12" width="7" height="7" rx="1" /><path d="M6 17l2 3" />
    </svg>
  ),
  'struck-by': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="5" r="2" /><path d="M16 7v5l-5 3" /><path d="M2 12l5 2" /><path d="M2 12l2-2m-2 2l2 2" /><path d="M18 17l-2 3" />
    </svg>
  ),
  slip: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" /><path d="M10 8l-3 5 4 1" /><path d="M11 14l1 4 3-1" /><path d="M4 21c2-2 6-3 10-1" />
    </svg>
  ),
  'fall-lower': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" /><path d="M12 6v4" /><path d="M9 10l3 2 3-2" /><path d="M12 12v3l-3 2" /><path d="M12 15l3 2" /><path d="M3 22h18" /><path d="M12 17l1 3" />
    </svg>
  ),
  caught: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  ),
  other: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
}

const INJURY_TYPE_LABELS = {
  overexertion:      'Overexertion involving outside sources',
  'other-exertions': 'Other exertions or bodily reactions',
  repetitive:        'Repetitive motions involving microtasks',
  'fall-same':       'Falls on the same level',
  roadway:           'Roadway incidents by motorized vehicles',
  'struck-against':  'Struck against object or equipment',
  'struck-by':       'Struck by object or equipment',
  slip:              'Slip or trip without fall',
  'fall-lower':      'Falls to lower level',
  caught:            'Caught in equipment or objects',
  other:             'Other',
}

function MetaLabel({ children }) {
  return (
    <span style={{
      fontFamily: FONT, fontSize: 11, fontWeight: 600,
      color: '#8A8D9A', textTransform: 'uppercase', letterSpacing: '0.05em',
      display: 'block', marginBottom: 4,
    }}>
      {children}
    </span>
  )
}

function MetaValue({ children }) {
  return (
    <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: '#F5F5F6' }}>
      {children}
    </span>
  )
}

// ── IncidentDetailModal ───────────────────────────────────────────────────────

export default function IncidentDetailModal({ incident, isOpen, onClose }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen || !incident) return null

  const injuryId    = incident.injuryType?.id    || 'other'
  const injuryLabel = incident.injuryType?.label || INJURY_TYPE_LABELS[injuryId] || 'Other'
  const injuryIcon  = INJURY_ICONS[injuryId]     || INJURY_ICONS.other

  const isCritical   = incident.severity === 'critical'
  const accentColor  = isCritical ? '#B83232' : '#008FE3'
  const iconBg       = isCritical ? 'rgba(184,50,50,0.2)' : 'rgba(0,143,227,0.15)'
  const iconBorder   = isCritical ? '#B83232' : '#008FE3'
  const severityLabel = isCritical ? 'Critical' : 'Needs Attention'
  const severityBadgeBg = isCritical ? '#F9464C' : '#008FE3'

  const reporterName    = incident.reportedBy || 'Emma Granger'
  const reporterInitial = reporterName.charAt(0).toUpperCase()
  const workerInitial   = (incident.injuredWorker || 'W').charAt(0).toUpperCase()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1200,
        animation: 'idmFadeIn 0.18s ease',
      }}
    >
      <div
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        style={{
          width: '95vw', maxWidth: 1064, maxHeight: '92vh',
          background: '#2A2E3A',
          border: '1px solid #5A5E6B',
          borderRadius: 6,
          boxShadow: '0 24px 64px rgba(0,0,0,0.65)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'idmScaleIn 0.18s ease',
          fontFamily: FONT,
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#F5F5F6' }}>
              Safety Incident Report
            </span>
            {/* Severity badge — matches StatusBadge dimensions and fill exactly, display-only */}
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              height: 22, padding: '5px 10.5px',
              background: severityBadgeBg,
              borderRadius: 4,
              fontFamily: FONT, fontWeight: 600, fontSize: 11.87,
              color: '#000000',
              whiteSpace: 'nowrap', lineHeight: 1, boxSizing: 'border-box',
            }}>
              {severityLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8A8D9A', padding: 4, borderRadius: 4,
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Close"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Single unified inner content block ── */}
          <div style={{ padding: '0 0 4px' }}>
            {/* Icon + injury type name — border-bottom acts as row divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 14, marginBottom: 16, borderBottom: '1px solid #3C3E4A' }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                background: iconBg, border: `1px solid ${iconBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {injuryIcon}
              </div>
              <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#F5F5F6', lineHeight: 1.35 }}>
                {injuryLabel}
              </span>
            </div>

            {/* Row 1 — 50/50: [Injured Worker + Incident Location] | [Incident Date + Worker ID] — border-bottom acts as row divider */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px', paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #3C3E4A' }}>
              {/* Left column: Injured Worker (top) + Incident Location (bottom) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <MetaLabel>Injured Worker</MetaLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', background: '#5A7BA0', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: FONT, fontWeight: 700, fontSize: 9, color: '#F5F5F6',
                    }}>
                      {workerInitial}
                    </div>
                    <MetaValue>{incident.injuredWorker || '—'}</MetaValue>
                  </div>
                </div>
                <div>
                  <MetaLabel>Incident Location</MetaLabel>
                  <MetaValue>{incident.incidentLocation || '—'}</MetaValue>
                </div>
              </div>

              {/* Right column: Incident Date (top) + Worker ID (bottom) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <MetaLabel>Incident Date</MetaLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8A8D9A" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <MetaValue>{incident.incidentDate || '—'}</MetaValue>
                  </div>
                </div>
                <div>
                  <MetaLabel>Worker ID</MetaLabel>
                  <MetaValue>{incident.workerId || '—'}</MetaValue>
                </div>
              </div>
            </div>

            {/* Row 2 — 50/50: Actions Taken | Incident Details (no bottom border — last row) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
              {/* Left: Actions Taken */}
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13.5, color: '#F5F5F6', marginBottom: 10 }}>
                  Actions Taken
                </div>
                <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: '#A0A4AF', lineHeight: 1.6, margin: 0 }}>
                  {incident.actionsTaken || '—'}
                </p>
              </div>

              {/* Right: Incident Details */}
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13.5, color: '#F5F5F6', marginBottom: 10 }}>
                  Incident Details
                </div>
                <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: '#A0A4AF', lineHeight: 1.6, margin: 0 }}>
                  {incident.incidentDetails || 'No details provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px',
          flexShrink: 0, gap: 16,
        }}>
          {/* Left: Share + Print */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                background: '#654064', borderRadius: 4, border: 'none',
                padding: '7px 18px', cursor: 'pointer',
                fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#F5F5F6',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >
              Share
            </button>
            <button
              style={{
                background: '#3C3E4B', borderRadius: 4, border: 'none',
                padding: '7px 18px', cursor: 'pointer',
                fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#F5F5F6',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >
              Print
            </button>
          </div>

          {/* Right: Reporter info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 600,
              color: '#8A8D9A', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Reported By
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: '#875A7B', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT, fontWeight: 700, fontSize: 10, color: '#F5F5F6',
              }}>
                {reporterInitial}
              </div>
              <span style={{ fontFamily: FONT, fontSize: 13, color: '#F5F5F6' }}>
                {reporterName}
                {incident.jobTitle && (
                  <span style={{ color: '#8A8D9A' }}>, {incident.jobTitle}</span>
                )}
              </span>
            </div>
            {incident.incidentDate && (
              <span style={{ fontFamily: FONT, fontSize: 12, color: '#6A6D7A' }}>
                {incident.incidentDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes idmFadeIn  { from { opacity: 0; }                         to { opacity: 1; } }
        @keyframes idmScaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}
