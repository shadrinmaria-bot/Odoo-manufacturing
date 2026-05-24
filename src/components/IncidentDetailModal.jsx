import React, { useEffect, useRef } from 'react'
import { Button } from './Button'

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

// ── Helper: field label ───────────────────────────────────────────────────────

function DetailLabel({ children }) {
  return (
    <span style={{
      fontFamily: FONT, fontSize: 11.5, fontWeight: 600,
      color: '#8A8D9A', textTransform: 'uppercase', letterSpacing: '0.05em',
      display: 'block', marginBottom: 4,
    }}>
      {children}
    </span>
  )
}

function DetailValue({ children }) {
  return (
    <span style={{
      fontFamily: FONT, fontSize: 13, fontWeight: 400, color: '#F5F5F6',
    }}>
      {children}
    </span>
  )
}

// ── IncidentDetailModal ───────────────────────────────────────────────────────

export default function IncidentDetailModal({ incident, isOpen, onClose, onMarkAsDone }) {
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

  const injuryId = incident.injuryType?.id || 'other'
  const injuryLabel = incident.injuryType?.label || INJURY_TYPE_LABELS[injuryId] || 'Other'
  const injuryIcon = INJURY_ICONS[injuryId] || INJURY_ICONS.other

  const isCritical = incident.severity === 'critical'
  const injuryBoxBg = isCritical ? 'rgba(184,50,50,0.2)' : 'rgba(232,161,0,0.15)'
  const injuryBoxBorder = isCritical ? '#B83232' : '#E8A100'

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
          width: '95vw', maxWidth: 1064,
          height: 'auto',
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
          borderBottom: '1px solid #5A5E6B',
          flexShrink: 0, background: '#2A2E3A',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 4,
              background: 'rgba(184,50,50,0.18)', border: '1px solid rgba(184,50,50,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B83232" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#F5F5F6' }}>
              Safety Incident Report
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

        {/* ── Reporter row ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          padding: '10px 14px',
          background: '#1B1D26', border: '1px solid #5A5E6B',
          margin: '16px 20px 0',
          borderRadius: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: FONT, fontSize: 11.5, fontWeight: 600,
              color: '#8A8D9A', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Reported By
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: '#875A7B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT, fontWeight: 700, fontSize: 10, color: '#F5F5F6', flexShrink: 0,
              }}>E</div>
              <span style={{ fontFamily: FONT, fontSize: 13, color: '#F5F5F6' }}>
                {incident.reportedBy || 'Emma Granger'}
              </span>
            </div>
          </div>
          <div style={{ width: 1, height: 16, background: '#5A5E6B', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: FONT, fontSize: 11.5, fontWeight: 600,
              color: '#8A8D9A', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Incident Date
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A8D9A" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span style={{ fontFamily: FONT, fontSize: 13, color: '#F5F5F6' }}>
                {incident.incidentDate || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Worker / Location section ── */}
        <div style={{
          padding: '16px 20px',
          background: '#1B1D26', border: '1px solid #5A5E6B',
          margin: '12px 20px 16px',
          borderRadius: 4,
        }}>
          {/* Row 1: 3 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 14 }}>
            <div>
              <DetailLabel>Injured Worker</DetailLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A8D9A" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="7" r="4" /><path d="M20 21a8 8 0 10-16 0" />
                </svg>
                <DetailValue>{incident.injuredWorker || '—'}</DetailValue>
              </div>
            </div>
            <div>
              <DetailLabel>Worker ID</DetailLabel>
              <DetailValue>{incident.workerId || '—'}</DetailValue>
            </div>
            <div>
              <DetailLabel>Job Title</DetailLabel>
              <DetailValue>{incident.jobTitle || '—'}</DetailValue>
            </div>
          </div>
          {/* Row 2: 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <DetailLabel>Incident Location</DetailLabel>
              <DetailValue>{incident.incidentLocation || '—'}</DetailValue>
            </div>
            <div>
              <DetailLabel>Work Center Location</DetailLabel>
              <DetailValue>{incident.workCenterLocation || '—'}</DetailValue>
            </div>
          </div>
        </div>

        {/* ── Horizontal divider ── */}
        <div style={{ height: 1, background: '#5A5E6B', margin: '0 20px' }} />

        {/* ── Two-column section ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: 24,
          padding: '16px 20px',
        }}>
          {/* Left: Incident Details */}
          <div>
            <div style={{
              fontFamily: FONT, fontWeight: 700, fontSize: 13.5,
              color: '#F5F5F6', marginBottom: 10,
            }}>
              Incident Details
            </div>
            <p style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 400,
              color: '#A0A4AF', lineHeight: 1.6, margin: 0,
            }}>
              {incident.incidentDetails || 'No details provided.'}
            </p>
          </div>

          {/* Right: Type of Injury + Actions Taken */}
          <div>
            <div style={{
              fontFamily: FONT, fontWeight: 700, fontSize: 13.5,
              color: '#F5F5F6', marginBottom: 10,
            }}>
              Type Of Injury
            </div>
            {/* Injury card */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 4, flexShrink: 0,
                background: injuryBoxBg,
                border: `1px solid ${injuryBoxBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {injuryIcon}
              </div>
              <span style={{
                fontFamily: FONT, fontSize: 13, color: '#F5F5F6', lineHeight: 1.4,
              }}>
                {injuryLabel}
              </span>
            </div>

            <div style={{
              fontFamily: FONT, fontWeight: 700, fontSize: 13.5,
              color: '#F5F5F6', marginBottom: 8, marginTop: 14,
            }}>
              Actions Taken
            </div>
            <p style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 400,
              color: '#A0A4AF', lineHeight: 1.6, margin: 0,
            }}>
              {incident.actionsTaken || '—'}
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
          padding: '12px 20px',
          borderTop: '1px solid #5A5E6B',
          flexShrink: 0, gap: 10, background: '#2A2E3A',
        }}>
          <Button
            variant="purple"
            onClick={() => {
              if (incident && onMarkAsDone) onMarkAsDone(incident.id)
              onClose()
            }}
            style={{
              padding: '8px 22px',
              fontFamily: FONT, fontWeight: 600, fontSize: 13,
              letterSpacing: '0.04em',
            }}
          >
            MARK AS DONE
          </Button>
          <Button
            style={{
              padding: '8px 20px',
              fontFamily: FONT, fontWeight: 600, fontSize: 13,
            }}
          >
            Share
          </Button>
          <Button
            style={{
              padding: '8px 20px',
              fontFamily: FONT, fontWeight: 600, fontSize: 13,
            }}
          >
            Print
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes idmFadeIn  { from { opacity: 0; }                        to { opacity: 1; } }
        @keyframes idmScaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}
