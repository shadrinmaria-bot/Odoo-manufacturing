import React, { useState, useEffect, useRef } from 'react'

// ── Injury type definitions ────────────────────────────────────────────────────

const INJURY_TYPES = [
  {
    id: 'overexertion',
    label: 'Overexertion involving outside sources',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" /><path d="M12 7v5l3 3" /><path d="M9 12l-3 2" /><path d="M12 12l3 2" /><path d="M9 17l-1 3" /><path d="M15 17l1 3" />
      </svg>
    ),
  },
  {
    id: 'other-exertions',
    label: 'Other exertions or bodily reactions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" /><path d="M12 7v6" /><path d="M9 10l3 2 3-2" /><path d="M10 20l2-7 2 7" />
      </svg>
    ),
  },
  {
    id: 'repetitive',
    label: 'Repetitive motions involving microtasks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
      </svg>
    ),
  },
  {
    id: 'fall-same',
    label: 'Falls on the same level',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" /><path d="M8 9l4 3-4 4" /><path d="M3 20h18" /><path d="M16 14l-4-2" />
      </svg>
    ),
  },
  {
    id: 'roadway',
    label: 'Roadway incidents involving motorized vehicles',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="10" width="22" height="8" rx="2" /><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    id: 'struck-against',
    label: 'Struck against object or equipment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5" r="2" /><path d="M8 7v5l5 3" /><rect x="15" y="12" width="7" height="7" rx="1" /><path d="M6 17l2 3" />
      </svg>
    ),
  },
  {
    id: 'struck-by',
    label: 'Struck by object or equipment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="5" r="2" /><path d="M16 7v5l-5 3" /><path d="M2 12l5 2" /><path d="M2 12l2-2m-2 2l2 2" /><path d="M18 17l-2 3" />
      </svg>
    ),
  },
  {
    id: 'slip',
    label: 'Slip or trip without fall',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" /><path d="M10 8l-3 5 4 1" /><path d="M11 14l1 4 3-1" /><path d="M4 21c2-2 6-3 10-1" />
      </svg>
    ),
  },
  {
    id: 'fall-lower',
    label: 'Falls to lower level',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" /><path d="M12 6v4" /><path d="M9 10l3 2 3-2" /><path d="M12 12v3l-3 2" /><path d="M12 15l3 2" /><path d="M3 22h18" /><path d="M12 17l1 3" />
      </svg>
    ),
  },
  {
    id: 'caught',
    label: 'Caught in equipment or objects',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    id: 'other',
    label: 'Other...',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
]

const WORK_CENTERS = [
  { id: 'carpentry', label: 'Carpentry Workshop' },
  { id: 'paint', label: 'Paint' },
  { id: 'assembly', label: 'Assembly' },
]

const ACTIONS_OPTIONS = [
  'First Aid Administered',
  'Area Secured',
  'Worker Sent Home',
  'Emergency Services Called',
  'Equipment Shut Down',
  'Supervisor Notified',
]

// ── Form field helpers ────────────────────────────────────────────────────────

function FormLabel({ children }) {
  return (
    <span style={{
      fontFamily: "'Segoe UI', sans-serif",
      fontSize: 12,
      fontWeight: 600,
      color: '#A0A4AF',
      display: 'block',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  )
}

const inputStyle = {
  width: '100%',
  background: '#1B1D26',
  border: '1px solid #3C3E4A',
  borderRadius: 4,
  padding: '7px 10px',
  color: '#F5F5F6',
  fontFamily: "'Segoe UI', sans-serif",
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23626363' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: 28,
}

// ── InjuryCard ─────────────────────────────────────────────────────────────────

function InjuryCard({ type, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => onSelect(type.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 8px',
        background: selected ? 'rgba(184,50,50,0.12)' : hovered ? 'rgba(255,255,255,0.04)' : '#1B1D26',
        border: selected ? '1.5px solid #B83232' : '1.5px solid #3C3E4A',
        borderRadius: 6,
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
        minHeight: 90,
      }}
    >
      <div style={{
        width: 40, height: 40,
        borderRadius: '50%',
        border: `2px solid ${selected ? '#E8A100' : '#C89000'}`,
        background: selected ? 'rgba(232,161,0,0.15)' : 'rgba(200,144,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'border-color 0.15s, background 0.15s',
      }}>
        {type.icon}
      </div>
      <span style={{
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: 10.5,
        fontWeight: 500,
        color: selected ? '#F5F5F6' : '#A0A4AF',
        textAlign: 'center',
        lineHeight: 1.35,
      }}>
        {type.label}
      </span>
    </button>
  )
}

// ── SafetyIncidentModal ───────────────────────────────────────────────────────

export default function SafetyIncidentModal({ isOpen, onClose, onSubmit }) {
  const modalRef = useRef(null)

  const now = new Date()
  const incidentDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const [form, setForm] = useState({
    injuredWorker: '',
    jobTitle: '',
    workerId: '',
    incidentLocation: '',
    workCenterLocation: '',
    selectedInjuryType: '',
    otherInjuryText: '',
    actionsTaken: '',
    incidentDetails: '',
  })

  function resetForm() {
    setForm({
      injuredWorker: '', jobTitle: '', workerId: '',
      incidentLocation: '', workCenterLocation: '',
      selectedInjuryType: '', otherInjuryText: '',
      actionsTaken: '', incidentDetails: '',
    })
  }

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
      // Basic focus trap: keep Tab inside modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus modal on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector('button, input, select, textarea')
      if (firstFocusable) firstFocusable.focus()
    }
  }, [isOpen])

  function handleSubmit() {
    onSubmit(form.incidentLocation || null)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.18s ease',
      }}
    >
      {/* Modal box */}
      <div
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        style={{
          width: '95vw', maxWidth: 1215,
          maxHeight: '92vh',
          background: '#1E2132',
          border: '1px solid #3C3E4A',
          borderRadius: 6,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.18s ease',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #3C3E4A',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 4, background: 'rgba(184,50,50,0.2)',
              border: '1px solid rgba(184,50,50,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B83232" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span id="modal-title" style={{
              fontFamily: "'Segoe UI', sans-serif", fontWeight: 700,
              fontSize: 17, color: '#F5F5F6',
            }}>
              Safety Incident Report
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#A0A4AF', padding: 4, borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 20px 0' }}>

          {/* ── Reporter info row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Reported By */}
            <div>
              <FormLabel>Reported By</FormLabel>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#1B1D26', border: '1px solid #3C3E4A',
                borderRadius: 4, padding: '7px 10px',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: '#875A7B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Segoe UI', sans-serif", fontWeight: 700,
                  fontSize: 11, color: '#F5F5F6', flexShrink: 0,
                }}>
                  E
                </div>
                <span style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: 13, color: '#A0A4AF' }}>
                  Emma Granger
                </span>
              </div>
            </div>

            {/* Incident Date */}
            <div>
              <FormLabel>Incident Date</FormLabel>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#1B1D26', border: '1px solid #3C3E4A',
                borderRadius: 4, padding: '7px 10px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#626363" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: 13, color: '#A0A4AF' }}>
                  {incidentDate}
                </span>
              </div>
            </div>
          </div>

          {/* ── Injured worker row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <FormLabel>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B83232" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="7" r="4" /><path d="M20 21a8 8 0 10-16 0" />
                  </svg>
                  Injured Worker
                </span>
              </FormLabel>
              <select
                style={selectStyle}
                value={form.injuredWorker}
                onChange={e => setForm(f => ({ ...f, injuredWorker: e.target.value }))}
              >
                <option value="">Select Worker</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
                <option value="mike-johnson">Mike Johnson</option>
                <option value="sara-lee">Sara Lee</option>
              </select>
            </div>
            <div>
              <FormLabel>Job Title</FormLabel>
              <input
                type="text"
                placeholder="Title"
                style={inputStyle}
                value={form.jobTitle}
                onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
              />
            </div>
            <div>
              <FormLabel>Worker ID</FormLabel>
              <input
                type="text"
                placeholder="2012380163"
                style={inputStyle}
                value={form.workerId}
                onChange={e => setForm(f => ({ ...f, workerId: e.target.value }))}
              />
            </div>
          </div>

          {/* ── Location row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <FormLabel>Incident Location</FormLabel>
              <select
                style={selectStyle}
                value={form.incidentLocation}
                onChange={e => setForm(f => ({ ...f, incidentLocation: e.target.value }))}
              >
                <option value="">Select Work Center</option>
                {WORK_CENTERS.map(wc => (
                  <option key={wc.id} value={wc.id}>{wc.label}</option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel>Work Center Location</FormLabel>
              <input
                type="text"
                placeholder="Warehouse 2"
                style={inputStyle}
                value={form.workCenterLocation}
                onChange={e => setForm(f => ({ ...f, workCenterLocation: e.target.value }))}
              />
            </div>
          </div>

          {/* ── Type of Injury ── */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              fontFamily: "'Segoe UI', sans-serif", fontWeight: 700,
              fontSize: 14, color: '#F5F5F6', display: 'block', marginBottom: 12,
            }}>
              Type Of Injury
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
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
              <div style={{ marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="Please describe the injury type..."
                  style={inputStyle}
                  value={form.otherInjuryText}
                  onChange={e => setForm(f => ({ ...f, otherInjuryText: e.target.value }))}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* ── Actions Taken ── */}
          <div style={{ marginBottom: 16 }}>
            <FormLabel>Actions Taken</FormLabel>
            <select
              style={selectStyle}
              value={form.actionsTaken}
              onChange={e => setForm(f => ({ ...f, actionsTaken: e.target.value }))}
            >
              <option value="">Choose...</option>
              {ACTIONS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* ── Incident Details ── */}
          <div style={{ marginBottom: 20 }}>
            <FormLabel>Incident Details</FormLabel>
            <textarea
              placeholder="Describe what happened, conditions at the time, and any other relevant details..."
              style={{
                ...inputStyle,
                height: 120,
                resize: 'vertical',
                minHeight: 80,
              }}
              value={form.incidentDetails}
              onChange={e => setForm(f => ({ ...f, incidentDetails: e.target.value }))}
            />
          </div>
        </div>

        {/* ── Footer with submit ── */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          padding: '14px 20px',
          borderTop: '1px solid #3C3E4A',
          flexShrink: 0,
          gap: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid #3C3E4A', borderRadius: 4,
              padding: '8px 18px', cursor: 'pointer',
              fontFamily: "'Segoe UI', sans-serif", fontWeight: 600,
              fontSize: 13, color: '#A0A4AF',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: '#B83232', border: 'none', borderRadius: 4,
              padding: '8px 20px', cursor: 'pointer',
              fontFamily: "'Segoe UI', sans-serif", fontWeight: 700,
              fontSize: 13, color: '#F5F5F6',
              letterSpacing: '0.04em',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            SUBMIT REPORT
          </button>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}
