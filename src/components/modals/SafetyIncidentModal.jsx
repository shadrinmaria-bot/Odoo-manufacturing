import React, { useState, useEffect, useRef } from 'react'
import Icon from '../shared/Icon'
import { Button } from '../shared/Button'
import './SafetyIncidentModal.css'

const WORKERS = [
  { value: 'john-doe',     label: 'John Doe',     title: 'Machine Operator',      workerId: '2012380163' },
  { value: 'jane-smith',   label: 'Jane Smith',   title: 'Quality Inspector',     workerId: '2012380164' },
  { value: 'mike-johnson', label: 'Mike Johnson', title: 'Forklift Operator',     workerId: '2012380165' },
  { value: 'sara-lee',     label: 'Sara Lee',     title: 'Assembly Technician',   workerId: '2012380166' },
]

const SEVERITY_OPTIONS = [
  { value: 'critical',  label: 'Critical',       color: '#B83232' },
  { value: 'attention', label: 'Needs Attention', color: '#008FE3' },
]

const INJURY_TYPES = [
  {
    id: 'overexertion', label: 'Overexertion involving outside sources',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2" /><path d="M12 7v5l3 3" /><path d="M9 12l-3 2" /><path d="M12 12l3 2" /><path d="M9 17l-1 3" /><path d="M15 17l1 3" /></svg>,
  },
  {
    id: 'other-exertions', label: 'Other exertions or bodily reactions',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2" /><path d="M12 7v6" /><path d="M9 10l3 2 3-2" /><path d="M10 20l2-7 2 7" /></svg>,
  },
  {
    id: 'repetitive', label: 'Repetitive motions involving microtasks',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>,
  },
  {
    id: 'fall-same', label: 'Falls on the same level',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2" /><path d="M8 9l4 3-4 4" /><path d="M3 20h18" /><path d="M16 14l-4-2" /></svg>,
  },
  {
    id: 'roadway', label: 'Roadway incidents by motorized vehicles',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="10" width="22" height="8" rx="2" /><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
  },
  {
    id: 'struck-against', label: 'Struck against object or equipment',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="5" r="2" /><path d="M8 7v5l5 3" /><rect x="15" y="12" width="7" height="7" rx="1" /><path d="M6 17l2 3" /></svg>,
  },
  {
    id: 'struck-by', label: 'Struck by object or equipment',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="5" r="2" /><path d="M16 7v5l-5 3" /><path d="M2 12l5 2" /><path d="M2 12l2-2m-2 2l2 2" /><path d="M18 17l-2 3" /></svg>,
  },
  {
    id: 'slip', label: 'Slip or trip without fall',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2" /><path d="M10 8l-3 5 4 1" /><path d="M11 14l1 4 3-1" /><path d="M4 21c2-2 6-3 10-1" /></svg>,
  },
  {
    id: 'fall-lower', label: 'Falls to lower level',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2" /><path d="M12 6v4" /><path d="M9 10l3 2 3-2" /><path d="M12 12v3l-3 2" /><path d="M12 15l3 2" /><path d="M3 22h18" /><path d="M12 17l1 3" /></svg>,
  },
  {
    id: 'caught', label: 'Caught in equipment or objects',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
  },
  {
    id: 'other', label: 'Other...',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  },
]

const WORK_CENTERS = [
  { id: 'carpentry', label: 'Carpentry Workshop' },
  { id: 'paint',     label: 'Paint' },
  { id: 'assembly',  label: 'Assembly' },
  { id: 'other',     label: 'Other' },
]

const ACTIONS_OPTIONS = [
  'First Aid Administered', 'Area Secured', 'Worker Sent Home',
  'Emergency Services Called', 'Equipment Shut Down', 'Supervisor Notified',
]

const REQUIRED_FIELDS = ['injuredWorker', 'jobTitle', 'workerId', 'incidentLocation', 'actionsTaken', 'severity']

function SelectWithCaret({ cls, children, ...rest }) {
  return (
    <div className="sim-select-wrap">
      <select {...rest} className={cls}>{children}</select>
      <span className="sim-select-caret">
        <Icon char="" size={10} color="#626363" />
      </span>
    </div>
  )
}

function FieldLabel({ children, error }) {
  return (
    <span className={`sim-field-label${error ? ' sim-field-label--error' : ''}`}>
      {children}
    </span>
  )
}

function InjuryCard({ type, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(type.id)}
      className={`sim-injury-card${selected ? ' sim-injury-card--selected' : ''}`}
    >
      <div className="sim-injury-card__icon">{type.icon}</div>
      <span className="sim-injury-card__label">{type.label}</span>
    </button>
  )
}

function SuccessPopup({ onClose }) {
  return (
    <div className="sim-success-overlay">
      <div className="sim-success-panel">
        <div className="sim-success-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1AD3BB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="sim-success-text">Report was sent successfully!</p>
        <Button variant="purple" onClick={onClose} className="btn-modal-close">CLOSE</Button>
      </div>
    </div>
  )
}

export default function SafetyIncidentModal({ isOpen, onClose, onSubmit }) {
  const modalRef = useRef(null)

  const now = new Date()
  const incidentDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const emptyForm = {
    injuredWorker: '', jobTitle: '', workerId: '',
    incidentLocation: '', otherLocation: '', workCenterLocation: '',
    selectedInjuryType: '', otherInjuryText: '',
    actionsTaken: '', incidentDetails: '', severity: '',
    timeOfIncident: '',
  }

  const [form, setForm] = useState(emptyForm)
  const [showErrors, setShowErrors] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [touched, setTouched] = useState({})

  function touch(key) { setTouched(t => ({ ...t, [key]: true })) }

  function resetForm() {
    setForm(emptyForm)
    setShowErrors(false)
    setShowSuccess(false)
    setTouched({})
  }

  function isFormValid() {
    const otherTextOk     = form.selectedInjuryType !== 'other' || !!form.otherInjuryText
    const otherLocationOk = form.incidentLocation !== 'other'   || !!form.otherLocation
    return REQUIRED_FIELDS.every(k => form[k]) && form.selectedInjuryType && otherTextOk && otherLocationOk
  }

  function handleSubmit() {
    if (!isFormValid()) { setShowErrors(true); return }
    setShowSuccess(true)
  }

  function handleCloseSuccess() {
    onSubmit(form.incidentLocation || null, form.severity, form)
    resetForm()
  }

  function handleClose() { resetForm(); onClose() }

  function err(key) { return (showErrors || touched[key]) && !form[key] }

  function handleWorkerChange(value) {
    const w = WORKERS.find(x => x.value === value)
    setForm(f => ({
      ...f,
      injuredWorker: value,
      jobTitle:  w ? w.title    : f.jobTitle,
      workerId:  w ? w.workerId : f.workerId,
    }))
  }

  function handleWorkerIdChange(value) {
    const w = WORKERS.find(x => x.workerId === value)
    setForm(f => ({
      ...f,
      workerId:      value,
      injuredWorker: w ? w.value : f.injuredWorker,
      jobTitle:      w ? w.title : f.jobTitle,
    }))
  }

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
    <div className="sim-overlay" onClick={handleClose}>
      <div
        ref={modalRef}
        className="sim-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sim-modal-title"
      >
        {showSuccess && <SuccessPopup onClose={handleCloseSuccess} />}

        {/* Header */}
        <div className="sim-header">
          <div className="sim-header__left">
            <div className="sim-header__icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B83232" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span id="sim-modal-title" className="sim-header__title">Safety Incident Report</span>
          </div>
          <button className="sim-close-btn" onClick={handleClose} aria-label="Close">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="sim-body">
          {/* Reporter info */}
          <div className="sim-reporter-bar">
            <div className="sim-reporter-bar__group">
              <span className="sim-meta-label">Reported By</span>
              <div className="sim-reporter-user">
                <div className="sim-reporter-avatar">E</div>
                <span className="sim-reporter-name">Emma Granger</span>
              </div>
            </div>
            <div className="sim-divider-v" />
            <div className="sim-reporter-bar__group">
              <span className="sim-meta-label">Report Date</span>
              <div className="sim-date-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A8D9A" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span className="sim-date-text">{incidentDate}</span>
              </div>
            </div>
          </div>

          {/* Injured worker row */}
          <div className="sim-grid-3">
            <div>
              <FieldLabel error={err('injuredWorker')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="7" r="4" /><path d="M20 21a8 8 0 10-16 0" />
                  </svg>
                  Injured Worker
                </span>
              </FieldLabel>
              <SelectWithCaret
                cls={`sim-select${err('injuredWorker') ? ' sim-select--error' : ''}`}
                value={form.injuredWorker}
                onChange={e => handleWorkerChange(e.target.value)}
                onBlur={() => touch('injuredWorker')}
              >
                <option value="">Select Worker</option>
                {WORKERS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
              </SelectWithCaret>
            </div>
            <div>
              <FieldLabel error={err('jobTitle')}>Job Title</FieldLabel>
              <input
                type="text"
                placeholder="Title"
                className={`sim-input${err('jobTitle') ? ' sim-input--error' : ''}`}
                value={form.jobTitle}
                onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                onBlur={() => touch('jobTitle')}
              />
            </div>
            <div>
              <FieldLabel error={err('workerId')}>Worker ID</FieldLabel>
              <input
                type="text"
                placeholder="2012380163"
                className={`sim-input${err('workerId') ? ' sim-input--error' : ''}`}
                value={form.workerId}
                onChange={e => handleWorkerIdChange(e.target.value)}
                onBlur={() => touch('workerId')}
              />
            </div>
          </div>

          {/* Location row */}
          <div className="sim-grid-2">
            <div>
              <FieldLabel error={err('incidentLocation')}>Incident Location</FieldLabel>
              <SelectWithCaret
                cls={`sim-select${err('incidentLocation') ? ' sim-select--error' : ''}`}
                value={form.incidentLocation}
                onChange={e => setForm(f => ({ ...f, incidentLocation: e.target.value }))}
                onBlur={() => touch('incidentLocation')}
              >
                <option value="">Select Work Center</option>
                {WORK_CENTERS.map(wc => <option key={wc.id} value={wc.id}>{wc.label}</option>)}
              </SelectWithCaret>
              {form.incidentLocation === 'other' && (
                <div style={{ marginTop: 8 }}>
                  <FieldLabel error={(showErrors || touched.otherLocation) && !form.otherLocation}>Specify location</FieldLabel>
                  <input
                    type="text"
                    placeholder="Please specify the location..."
                    className={`sim-input${(showErrors || touched.otherLocation) && !form.otherLocation ? ' sim-input--error' : ''}`}
                    value={form.otherLocation}
                    onChange={e => setForm(f => ({ ...f, otherLocation: e.target.value }))}
                    onBlur={() => touch('otherLocation')}
                    autoFocus
                  />
                </div>
              )}
            </div>
            <div>
              <FieldLabel>Work Center Location</FieldLabel>
              <input
                type="text"
                placeholder="Warehouse 2"
                className="sim-input"
                value={form.workCenterLocation}
                onChange={e => setForm(f => ({ ...f, workCenterLocation: e.target.value }))}
              />
            </div>
          </div>

          {/* Type of Injury */}
          <div className="sim-section">
            <span className={`sim-section-title${injuryGridError ? ' sim-section-title--error' : ''}`}>
              Type Of Injury
              {injuryGridError && <span className="sim-section-subtitle">— please select one</span>}
            </span>
            <div className={`sim-injury-grid${injuryGridError ? ' sim-injury-grid--error' : ''}`}>
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
                <FieldLabel error={(showErrors || touched.otherInjuryText) && !form.otherInjuryText}>
                  Describe the injury type
                </FieldLabel>
                <input
                  type="text"
                  placeholder="Please describe the injury type..."
                  className={`sim-input${(showErrors || touched.otherInjuryText) && !form.otherInjuryText ? ' sim-input--error' : ''}`}
                  value={form.otherInjuryText}
                  onChange={e => setForm(f => ({ ...f, otherInjuryText: e.target.value }))}
                  onBlur={() => touch('otherInjuryText')}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Bottom grid: Incident Details + Actions Taken */}
          <div className="sim-grid-bottom">
            <div>
              <FieldLabel>Incident Details</FieldLabel>
              <textarea
                placeholder="Describe what happened, conditions at the time, and any other relevant details..."
                className="sim-textarea"
                value={form.incidentDetails}
                onChange={e => setForm(f => ({ ...f, incidentDetails: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel error={err('actionsTaken')}>Actions Taken</FieldLabel>
              <SelectWithCaret
                cls={`sim-select${err('actionsTaken') ? ' sim-select--error' : ''}`}
                value={form.actionsTaken}
                onChange={e => setForm(f => ({ ...f, actionsTaken: e.target.value }))}
                onBlur={() => touch('actionsTaken')}
              >
                <option value="">Choose...</option>
                {ACTIONS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </SelectWithCaret>
            </div>
          </div>

          {/* Time of Incident */}
          <div className="sim-section">
            <FieldLabel>Time of Incident</FieldLabel>
            <input
              type="time"
              className="sim-time-input"
              value={form.timeOfIncident}
              onChange={e => setForm(f => ({ ...f, timeOfIncident: e.target.value }))}
            />
          </div>

          {/* Incident Severity */}
          <div className="sim-section">
            <FieldLabel error={err('severity')}>Incident Severity</FieldLabel>
            <div className="sim-severity-options">
              {SEVERITY_OPTIONS.map(opt => {
                const active = form.severity === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setForm(f => ({ ...f, severity: opt.value }))}
                    className={[
                      'sim-severity-btn',
                      active ? 'sim-severity-btn--selected' : '',
                      !active && err('severity') ? 'sim-severity-btn--error' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <span className="sim-severity-dot" style={{ background: opt.color }} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {err('severity') && (
              <p className="sim-severity-error">Please select incident severity.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sim-footer">
          <Button variant="purple" onClick={handleSubmit} className="btn-modal-submit">SUBMIT REPORT</Button>
          <Button onClick={handleClose} className="btn-modal-discard">Discard</Button>
        </div>
      </div>
    </div>
  )
}
