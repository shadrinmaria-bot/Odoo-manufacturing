import React, { useState, useEffect, useRef } from 'react'

// ── Workers lookup (for auto-fill) ────────────────────────────────────────────

const WORKERS = [
  { value: 'john-doe',     label: 'John Doe',     title: 'Machine Operator',      workerId: '2012380163' },
  { value: 'jane-smith',   label: 'Jane Smith',   title: 'Quality Inspector',     workerId: '2012380164' },
  { value: 'mike-johnson', label: 'Mike Johnson', title: 'Forklift Operator',     workerId: '2012380165' },
  { value: 'sara-lee',     label: 'Sara Lee',     title: 'Assembly Technician',   workerId: '2012380166' },
]

// ── Severity options ──────────────────────────────────────────────────────────

const SEVERITY_OPTIONS = [
  { value: 'critical',   label: 'Critical',        color: '#B83232', bg: 'rgba(184,50,50,0.12)'  },
  { value: 'attention',  label: 'Needs Attention',  color: '#E8A100', bg: 'rgba(232,161,0,0.10)'  },
  { value: 'none',       label: 'Not Serious',      color: '#626363', bg: 'rgba(98,99,99,0.10)'   },
]

// ── Injury type definitions (icons use currentColor) ──────────────────────────

const INJURY_TYPES = [
  {
    id: 'overexertion',
    label: 'Overexertion involving outside sources',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" /><path d="M12 7v5l3 3" /><path d="M9 12l-3 2" /><path d="M12 12l3 2" /><path d="M9 17l-1 3" /><path d="M15 17l1 3" />
      </svg>
    ),
  },
  {
    id: 'other-exertions',
    label: 'Other exertions or bodily reactions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" /><path d="M12 7v6" /><path d="M9 10l3 2 3-2" /><path d="M10 20l2-7 2 7" />
      </svg>
    ),
  },
  {
    id: 'repetitive',
    label: 'Repetitive motions involving microtasks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
      </svg>
    ),
  },
  {
    id: 'fall-same',
    label: 'Falls on the same level',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" /><path d="M8 9l4 3-4 4" /><path d="M3 20h18" /><path d="M16 14l-4-2" />
      </svg>
    ),
  },
  {
    id: 'roadway',
    label: 'Roadway incidents by motorized vehicles',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="10" width="22" height="8" rx="2" /><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    id: 'struck-against',
    label: 'Struck against object or equipment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5" r="2" /><path d="M8 7v5l5 3" /><rect x="15" y="12" width="7" height="7" rx="1" /><path d="M6 17l2 3" />
      </svg>
    ),
  },
  {
    id: 'struck-by',
    label: 'Struck by object or equipment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="5" r="2" /><path d="M16 7v5l-5 3" /><path d="M2 12l5 2" /><path d="M2 12l2-2m-2 2l2 2" /><path d="M18 17l-2 3" />
      </svg>
    ),
  },
  {
    id: 'slip',
    label: 'Slip or trip without fall',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" /><path d="M10 8l-3 5 4 1" /><path d="M11 14l1 4 3-1" /><path d="M4 21c2-2 6-3 10-1" />
      </svg>
    ),
  },
  {
    id: 'fall-lower',
    label: 'Falls to lower level',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" /><path d="M12 6v4" /><path d="M9 10l3 2 3-2" /><path d="M12 12v3l-3 2" /><path d="M12 15l3 2" /><path d="M3 22h18" /><path d="M12 17l1 3" />
      </svg>
    ),
  },
  {
    id: 'caught',
    label: 'Caught in equipment or objects',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    id: 'other',
    label: 'Other...',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
]

const WORK_CENTERS = [
  { id: 'carpentry', label: 'Carpentry Workshop' },
  { id: 'paint',     label: 'Paint' },
  { id: 'assembly',  label: 'Assembly' },
  { id: 'other',     label: 'Other' },
]

const ACTIONS_OPTIONS = [
  'First Aid Administered',
  'Area Secured',
  'Worker Sent Home',
  'Emergency Services Called',
  'Equipment Shut Down',
  'Supervisor Notified',
]

const REQUIRED_FIELDS = ['injuredWorker', 'jobTitle', 'workerId', 'incidentLocation', 'actionsTaken', 'severity']

const FONT = "'Segoe UI', sans-serif"

// ── Shared styles ─────────────────────────────────────────────────────────────

function makeInputStyle(hasError) {
  return {
    width: '100%',
    background: '#1B1D26',
    border: `1px solid ${hasError ? '#B83232' : '#5A5E6B'}`,
    borderRadius: 4,
    padding: '7px 10px',
    color: '#F5F5F6',
    fontFamily: FONT,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }
}

function makeSelectStyle(hasError) {
  return {
    ...makeInputStyle(hasError),
    appearance: 'none',
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23626363' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: 28,
  }
}

function FieldLabel({ children, error }) {
  return (
    <span style={{
      fontFamily: FONT,
      fontSize: 11.5,
      fontWeight: 600,
      color: error ? '#B83232' : '#8A8D9A',
      display: 'block',
      marginBottom: 5,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {children}
    </span>
  )
}

// ── InjuryCard ────────────────────────────────────────────────────────────────

function InjuryCard({ type, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => onSelect(type.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: '10px 12px',
        background: selected ? 'rgba(26,211,187,0.07)' : hovered ? 'rgba(255,255,255,0.03)' : '#1B1D26',
        border: `1px solid ${selected ? '#1AD3BB' : '#3C3E4A'}`,
        borderRadius: 4,
        cursor: 'pointer',
        transition: 'background 0.14s, border-color 0.14s',
        textAlign: 'left', width: '100%',
      }}
    >
      <div style={{
        width: 34, height: 34,
        border: `1.5px solid ${selected ? '#1AD3BB' : '#5A5E6B'}`,
        background: selected ? 'rgba(26,211,187,0.12)' : 'rgba(255,255,255,0.04)',
        borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        color: selected ? '#1AD3BB' : '#8A8D9A',
        transition: 'border-color 0.14s, background 0.14s, color 0.14s',
      }}>
        {type.icon}
      </div>
      <span style={{
        fontFamily: FONT, fontSize: 11, fontWeight: 500,
        color: selected ? '#1AD3BB' : '#8A8D9A',
        lineHeight: 1.4, transition: 'color 0.14s',
      }}>
        {type.label}
      </span>
    </button>
  )
}

// ── Success popup ─────────────────────────────────────────────────────────────

function SuccessPopup({ onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, borderRadius: 6,
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{
        background: '#2A2E3A', border: '1px solid #5A5E6B',
        borderRadius: 6, padding: '32px 40px', textAlign: 'center', minWidth: 320,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        animation: 'scaleIn 0.15s ease',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(26,211,187,0.12)', border: '2px solid #1AD3BB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1AD3BB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, color: '#F5F5F6', margin: '0 0 20px' }}>
          Report was sent successfully!
        </p>
        <button
          onClick={onClose}
          style={{
            background: '#6B3E66', border: 'none', borderRadius: 4,
            padding: '9px 28px', cursor: 'pointer',
            fontFamily: FONT, fontWeight: 700, fontSize: 13,
            color: '#F5F5F6', letterSpacing: '0.06em',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.14)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
          CLOSE
        </button>
      </div>
    </div>
  )
}

// ── SafetyIncidentModal ───────────────────────────────────────────────────────

export default function SafetyIncidentModal({ isOpen, onClose, onSubmit }) {
  const modalRef = useRef(null)

  const now = new Date()
  const incidentDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const emptyForm = {
    injuredWorker: '', jobTitle: '', workerId: '',
    incidentLocation: '', workCenterLocation: '',
    selectedInjuryType: '', otherInjuryText: '',
    actionsTaken: '', incidentDetails: '', severity: '',
  }

  const [form, setForm] = useState(emptyForm)
  const [showErrors, setShowErrors] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  function resetForm() {
    setForm(emptyForm)
    setShowErrors(false)
    setShowSuccess(false)
  }

  function isFormValid() {
    return REQUIRED_FIELDS.every(k => form[k]) && form.selectedInjuryType
  }

  function handleSubmit() {
    if (!isFormValid()) { setShowErrors(true); return }
    setShowSuccess(true)
  }

  function handleCloseSuccess() {
    onSubmit(form.incidentLocation || null, form.severity)
    resetForm()
  }

  function handleClose() { resetForm(); onClose() }

  function err(key) { return showErrors && !form[key] }

  // Worker auto-fill: name → id+title
  function handleWorkerChange(value) {
    const w = WORKERS.find(x => x.value === value)
    setForm(f => ({
      ...f,
      injuredWorker: value,
      jobTitle:  w ? w.title    : f.jobTitle,
      workerId:  w ? w.workerId : f.workerId,
    }))
  }

  // Worker auto-fill: id → name+title
  function handleWorkerIdChange(value) {
    const w = WORKERS.find(x => x.workerId === value)
    setForm(f => ({
      ...f,
      workerId:      value,
      injuredWorker: w ? w.value : f.injuredWorker,
      jobTitle:      w ? w.title : f.jobTitle,
    }))
  }

  // Escape + focus trap
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !showSuccess) handleClose()
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button:not([disabled]), input, select, textarea')
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus() } }
        else            { if (document.activeElement === last)  { e.preventDefault(); first.focus() } }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showSuccess])

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const first = modalRef.current.querySelector('button, input, select, textarea')
      if (first) first.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const injuryGridError = showErrors && !form.selectedInjuryType

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.18s ease',
      }}
    >
      <div
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '95vw', maxWidth: 1064,
          height: 'min(869px, 94vh)',
          background: '#2A2E3A',
          border: '1px solid #5A5E6B',
          borderRadius: 6,
          boxShadow: '0 24px 64px rgba(0,0,0,0.65)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.18s ease',
          fontFamily: FONT,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {showSuccess && <SuccessPopup onClose={handleCloseSuccess} />}

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
            <span id="modal-title" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#F5F5F6' }}>
              Safety Incident Report
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A8D9A', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' }}
            aria-label="Close"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '18px 20px 0' }}>

          {/* Reporter info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 36,
            marginBottom: 18, padding: '10px 14px',
            background: '#1B1D26', border: '1px solid #5A5E6B', borderRadius: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 600, color: '#8A8D9A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Reported By
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#875A7B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT, fontWeight: 700, fontSize: 10, color: '#F5F5F6', flexShrink: 0,
                }}>E</div>
                <span style={{ fontFamily: FONT, fontSize: 13, color: '#F5F5F6' }}>Emma Granger</span>
              </div>
            </div>
            <div style={{ width: 1, height: 16, background: '#5A5E6B' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 600, color: '#8A8D9A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Incident Date
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A8D9A" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span style={{ fontFamily: FONT, fontSize: 13, color: '#F5F5F6' }}>{incidentDate}</span>
              </div>
            </div>
          </div>

          {/* Injured worker row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <FieldLabel error={err('injuredWorker')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="7" r="4" /><path d="M20 21a8 8 0 10-16 0" />
                  </svg>
                  Injured Worker
                </span>
              </FieldLabel>
              <select
                style={makeSelectStyle(err('injuredWorker'))}
                value={form.injuredWorker}
                onChange={e => handleWorkerChange(e.target.value)}
              >
                <option value="">Select Worker</option>
                {WORKERS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel error={err('jobTitle')}>Job Title</FieldLabel>
              <input
                type="text"
                placeholder="Title"
                style={makeInputStyle(err('jobTitle'))}
                value={form.jobTitle}
                onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel error={err('workerId')}>Worker ID</FieldLabel>
              <input
                type="text"
                placeholder="2012380163"
                style={makeInputStyle(err('workerId'))}
                value={form.workerId}
                onChange={e => handleWorkerIdChange(e.target.value)}
              />
            </div>
          </div>

          {/* Location row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div>
              <FieldLabel error={err('incidentLocation')}>Incident Location</FieldLabel>
              <select
                style={makeSelectStyle(err('incidentLocation'))}
                value={form.incidentLocation}
                onChange={e => setForm(f => ({ ...f, incidentLocation: e.target.value }))}
              >
                <option value="">Select Work Center</option>
                {WORK_CENTERS.map(wc => <option key={wc.id} value={wc.id}>{wc.label}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Work Center Location</FieldLabel>
              <input
                type="text"
                placeholder="Warehouse 2"
                style={makeInputStyle(false)}
                value={form.workCenterLocation}
                onChange={e => setForm(f => ({ ...f, workCenterLocation: e.target.value }))}
              />
            </div>
          </div>

          {/* Type of Injury */}
          <div style={{ marginBottom: 18 }}>
            <span style={{
              fontFamily: FONT, fontWeight: 700, fontSize: 13.5,
              color: injuryGridError ? '#B83232' : '#F5F5F6',
              display: 'block', marginBottom: 10,
            }}>
              Type Of Injury
              {injuryGridError && <span style={{ fontWeight: 400, fontSize: 11.5, marginLeft: 8 }}>— please select one</span>}
            </span>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
              padding: injuryGridError ? 6 : 0,
              border: injuryGridError ? '1px solid #B83232' : '1px solid transparent',
              borderRadius: 5,
            }}>
              {INJURY_TYPES.map(type => (
                <InjuryCard
                  key={type.id}
                  type={type}
                  selected={form.selectedInjuryType === type.id}
                  onSelect={id => setForm(f => ({
                    ...f,
                    selectedInjuryType: f.selectedInjuryType === id ? '' : id,
                    otherInjuryText: id !== 'other' ? '' : f.otherInjuryText,
                  }))}
                />
              ))}
            </div>
            {form.selectedInjuryType === 'other' && (
              <div style={{ marginTop: 8 }}>
                <input
                  type="text"
                  placeholder="Please describe the injury type..."
                  style={makeInputStyle(false)}
                  value={form.otherInjuryText}
                  onChange={e => setForm(f => ({ ...f, otherInjuryText: e.target.value }))}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Bottom grid: Incident Details + Actions Taken */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <FieldLabel>Incident Details</FieldLabel>
              <textarea
                placeholder="Describe what happened, conditions at the time, and any other relevant details..."
                style={{ ...makeInputStyle(false), height: 100, resize: 'vertical', minHeight: 70, lineHeight: 1.5 }}
                value={form.incidentDetails}
                onChange={e => setForm(f => ({ ...f, incidentDetails: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel error={err('actionsTaken')}>Actions Taken</FieldLabel>
              <select
                style={makeSelectStyle(err('actionsTaken'))}
                value={form.actionsTaken}
                onChange={e => setForm(f => ({ ...f, actionsTaken: e.target.value }))}
              >
                <option value="">Choose...</option>
                {ACTIONS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Incident Severity */}
          <div style={{ marginBottom: 18 }}>
            <FieldLabel error={err('severity')}>Incident Severity</FieldLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              {SEVERITY_OPTIONS.map(opt => {
                const active = form.severity === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setForm(f => ({ ...f, severity: opt.value }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 18px',
                      border: `1px solid ${active ? '#1AD3BB' : err('severity') ? '#B83232' : '#3C3E4A'}`,
                      background: active ? 'rgba(26,211,187,0.07)' : '#1B1D26',
                      borderRadius: 4, cursor: 'pointer',
                      fontFamily: FONT, fontSize: 13, fontWeight: 600,
                      color: active ? '#1AD3BB' : '#8A8D9A',
                      transition: 'all 0.14s',
                    }}
                  >
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: opt.color, flexShrink: 0 }} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {err('severity') && (
              <p style={{ marginTop: 6, fontFamily: FONT, fontSize: 11.5, color: '#B83232' }}>
                Please select incident severity.
              </p>
            )}
          </div>
        </div>

        {/* ── Footer — buttons left-aligned ── */}
        <div style={{
          display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
          padding: '12px 20px',
          borderTop: '1px solid #5A5E6B',
          flexShrink: 0, gap: 10, background: '#2A2E3A',
        }}>
          <button
            onClick={handleSubmit}
            style={{
              background: '#6B3E66', border: 'none', borderRadius: 4,
              padding: '8px 22px', cursor: 'pointer',
              fontFamily: FONT, fontWeight: 700, fontSize: 13,
              color: '#F5F5F6', letterSpacing: '0.04em',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            SUBMIT REPORT
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: '1px solid #5A5E6B', borderRadius: 4,
              padding: '8px 20px', cursor: 'pointer',
              fontFamily: FONT, fontWeight: 600, fontSize: 13, color: '#8A8D9A',
            }}
          >
            Discard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; }                        to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        select option { background: #2A2E3A; color: #F5F5F6; }
      `}</style>
    </div>
  )
}
