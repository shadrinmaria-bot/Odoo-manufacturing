import React, { useEffect, useRef, useState } from 'react'
import './IncidentDetailModal.css'
import ShareIncidentPopup from './ShareIncidentPopup'

const slugify = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, '-')

const FALLBACK_INJURY_ICONS = {
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

function InjuryImg({ injuryId }) {
  const [errored, setErrored] = useState(false)
  if (errored) return FALLBACK_INJURY_ICONS[injuryId] || FALLBACK_INJURY_ICONS.other
  return (
    <img
      src={`/icons/injuries/${injuryId}.svg`}
      alt=""
      className="idm-injury-img"
      width="28"
      height="28"
      onError={() => setErrored(true)}
    />
  )
}

function AvatarImg({ name, fallback, baseClass }) {
  const [errored, setErrored] = useState(false)
  if (!name || errored) {
    return <div className={baseClass}>{fallback}</div>
  }
  return (
    <img
      src={`/avatars/${slugify(name)}.png`}
      alt=""
      className={`${baseClass} ${baseClass}--img`}
      onError={() => setErrored(true)}
    />
  )
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

export default function IncidentDetailModal({ incident, isOpen, onClose, onShare }) {
  const modalRef = useRef(null)
  const [isShareOpen, setIsShareOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape' && !isShareOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, isShareOpen, onClose])

  useEffect(() => {
    if (!isOpen) setIsShareOpen(false)
  }, [isOpen])

  function handleShareConfirm({ recipients, emailAlso }) {
    setIsShareOpen(false)
    if (onShare) onShare(incident, { recipients, emailAlso })
  }

  if (!isOpen || !incident) return null

  const injuryId    = incident.injuryType?.id    || 'other'
  const injuryLabel = incident.injuryType?.label || INJURY_TYPE_LABELS[injuryId] || 'Other'

  const isCritical      = incident.severity === 'critical'
  const severityKey     = isCritical ? 'critical' : 'attention'
  const severityLabel   = isCritical ? 'Critical' : 'Needs Attention'
  const reporterName    = incident.reportedBy || 'Emma Granger'
  const reporterInitial = reporterName.charAt(0).toUpperCase()
  const workerInitial   = (incident.injuredWorker || 'W').charAt(0).toUpperCase()

  return (
    <div className="idm-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="idm-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="idm-header">
          <div className="idm-header__left">
            <span className="idm-header__title">Safety Incident Report</span>
            <span className={`idm-severity-text idm-severity-text--${severityKey}`}>
              {severityLabel}
            </span>
          </div>
          <button className="idm-close-btn" onClick={onClose} aria-label="Close">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="idm-body">
          {/* Top card: injury icon + meta grid */}
          <div className="idm-card">
            <div className="idm-icon-row">
              <div className={`idm-injury-icon idm-injury-icon--${severityKey}`}>
                <InjuryImg injuryId={injuryId} />
              </div>
              <span className="idm-injury-label">{injuryLabel}</span>
            </div>

            <div className="idm-grid-row">
              <div className="idm-grid-col">
                <div>
                  <span className="idm-meta-label">Injured Worker</span>
                  <div className="idm-worker-row">
                    <AvatarImg
                      name={incident.injuredWorker}
                      fallback={workerInitial}
                      baseClass="idm-worker-avatar"
                    />
                    <span className="idm-meta-value">{incident.injuredWorker || '—'}</span>
                  </div>
                </div>
                <div>
                  <span className="idm-meta-label">Incident Location</span>
                  <span className="idm-meta-value">{incident.incidentLocation || '—'}</span>
                </div>
              </div>
              <div className="idm-grid-col">
                <div>
                  <span className="idm-meta-label">Incident Date</span>
                  <div className="idm-date-row">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8A8D9A" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <span className="idm-meta-value">{incident.incidentDate || '—'}</span>
                  </div>
                </div>
                <div>
                  <span className="idm-meta-label">Worker ID</span>
                  <span className="idm-meta-value">{incident.workerId || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom card: Actions Taken | Incident Details */}
          <div className="idm-card">
            <div className="idm-grid-row">
              <div>
                <div className="idm-section-title">Actions Taken</div>
                <p className="idm-section-text">{incident.actionsTaken || '—'}</p>
              </div>
              <div>
                <div className="idm-section-title">Incident Details</div>
                <p className="idm-section-text">{incident.incidentDetails || 'No details provided.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="idm-footer">
          <div className="idm-footer__actions">
            <button
              className="idm-btn idm-btn--share"
              onClick={() => setIsShareOpen(true)}
            >Share</button>
            <button className="idm-btn idm-btn--print" onClick={() => window.print()}>Print</button>
          </div>
          <div className="idm-footer__reporter">
            <span className="idm-reporter-label">Reported By</span>
            <div className="idm-reporter-info">
              <AvatarImg
                name={reporterName}
                fallback={reporterInitial}
                baseClass="idm-reporter-avatar"
              />
              <span className="idm-reporter-name">
                {reporterName}
                {incident.jobTitle && (
                  <span className="idm-reporter-jobtitle">, {incident.jobTitle}</span>
                )}
              </span>
            </div>
            {incident.incidentDate && (
              <span className="idm-reporter-date">{incident.incidentDate}</span>
            )}
          </div>
        </div>
      </div>

      <ShareIncidentPopup
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onConfirm={handleShareConfirm}
      />
    </div>
  )
}
