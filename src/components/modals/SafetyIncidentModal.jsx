import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../shared/Button'
import FormDropdown from '../shared/FormDropdown'
import './SafetyIncidentModal.css'

const WORKERS = [
  { value: 'john-doe',        label: 'John Doe',        title: 'Machine Operator',      workerId: '2012380163' },
  { value: 'jane-smith',      label: 'Jane Smith',      title: 'Quality Inspector',     workerId: '2012380164' },
  { value: 'mike-johnson',    label: 'Mike Johnson',    title: 'Forklift Operator',     workerId: '2012380165' },
  { value: 'sara-lee',        label: 'Sara Lee',        title: 'Assembly Technician',   workerId: '2012380166' },
  { value: 'maria-lan',       label: 'Maria Lan',       title: 'Production Operator',   workerId: '2012380167' },
  { value: 'valeria-kulishov',label: 'Valeria Kulishov',title: 'Chief Executive Officer',workerId: '2014321860' },
  { value: 'amit-tzadik',     label: 'Amit Tzadik',     title: 'Safety Officer',        workerId: '2012380168' },
  { value: 'oran-shuster',    label: 'Oran Shuster',    title: 'Maintenance Technician',workerId: '2012380169' },
]

const SEVERITY_OPTIONS = [
  { value: 'critical',  label: 'Critical',        color: '#B83232' },
  { value: 'attention', label: 'Needs Attention', color: '#008FE3' },
]

const INJURY_TYPES = [
  // Row 1
  {
    id: 'overexertion', label: 'Overexertion involving outside sources',
    iconSrc: '/icons/injuries/overexertion.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2" /><path d="M12 7v5l3 3" /><path d="M9 12l-3 2" /><path d="M12 12l3 2" /><path d="M9 17l-1 3" /><path d="M15 17l1 3" /></svg>,
  },
  {
    id: 'other-exertions', label: 'Other exertions or bodily reactions',
    iconSrc: '/icons/injuries/other-exertions.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2" /><path d="M12 7v6" /><path d="M9 10l3 2 3-2" /><path d="M10 20l2-7 2 7" /></svg>,
  },
  {
    id: 'repetitive', label: 'Repetitive motions involving microtasks',
    iconSrc: '/icons/injuries/repetitive.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>,
  },
  // Row 2
  {
    id: 'fall-same', label: 'Falls on the same level',
    iconSrc: '/icons/injuries/fall-same.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2" /><path d="M8 9l4 3-4 4" /><path d="M3 20h18" /><path d="M16 14l-4-2" /></svg>,
  },
  {
    id: 'roadway', label: 'Roadway incidents by motorized vehicles',
    iconSrc: '/icons/injuries/roadway.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="10" width="22" height="8" rx="2" /><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
  },
  {
    id: 'struck-against', label: 'Struck against object or equipment',
    iconSrc: '/icons/injuries/struck-against.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="5" r="2" /><path d="M8 7v5l5 3" /><rect x="15" y="12" width="7" height="7" rx="1" /><path d="M6 17l2 3" /></svg>,
  },
  // Row 3
  {
    id: 'struck-by', label: 'Struck by object or equipment',
    iconSrc: '/icons/injuries/struck-by.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="5" r="2" /><path d="M16 7v5l-5 3" /><path d="M2 12l5 2" /><path d="M2 12l2-2m-2 2l2 2" /><path d="M18 17l-2 3" /></svg>,
  },
  {
    id: 'slip', label: 'Slip or trip without fall',
    iconSrc: '/icons/injuries/slip.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2" /><path d="M10 8l-3 5 4 1" /><path d="M11 14l1 4 3-1" /><path d="M4 21c2-2 6-3 10-1" /></svg>,
  },
  {
    id: 'other', label: 'Other...',
    iconSrc: '/icons/injuries/other.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  },
  // Row 4
  {
    id: 'fall-lower', label: 'Falls to lower level',
    iconSrc: '/icons/injuries/fall-lower.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2" /><path d="M12 6v4" /><path d="M9 10l3 2 3-2" /><path d="M12 12v3l-3 2" /><path d="M12 15l3 2" /><path d="M3 22h18" /><path d="M12 17l1 3" /></svg>,
  },
  {
    id: 'caught', label: 'Caught in equipment or objects',
    iconSrc: '/icons/injuries/caught.svg',
    fallbackIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
  },
]

const WORK_CENTERS = [
  { id: 'carpentry', label: 'Carpentry Workshop', warehouseLocation: 'Warehouse 2' },
  { id: 'paint',     label: 'Paint',              warehouseLocation: 'Warehouse 1' },
  { id: 'assembly',  label: 'Assembly',            warehouseLocation: 'Warehouse 3' },
  { id: 'other',     label: 'Other',               warehouseLocation: '' },
]

const CURRENT_USER = 'Emma Granger'

const REQUIRED_FIELDS = ['injuredWorker', 'jobTitle', 'workerId', 'incidentLocation', 'actionsTaken', 'severity']

const ACTIONS_SUGGESTIONS = [
  'First Aid Provided',
  'Supervisor Notified',
  'Worker Removed from Duty',
  'Ambulance Called',
  'Area Secured',
  'Equipment Shut Down',
  'Incident Photographed',
  'Safety Officer Alerted',
  'Medical Examination Scheduled',
  'Corrective Action Initiated',
  'Witness Statements Collected',
  'Management Informed',
]

const OTHER_SUGGESTIONS = [
  'Chemical exposure',
  'Electrical shock',
  'Burn injury',
  'Eye injury',
  'Hearing damage',
  'Crush injury',
  'Laceration',
  'Allergic reaction',
  'Heat exhaustion',
  'Toxic inhalation',
  'Hypothermia',
  'Insect or animal bite',
]

const INJURY_STOP_WORDS = new Set([
  'the','a','an','or','and','of','in','by','on','at','to','for',
  'is','are','was','with','without','from','into','involving','same','bodily','injury'
])

function sigWords(str) {
  return str.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
    .filter(w => w.length >= 4 && !INJURY_STOP_WORDS.has(w))
}

const MAIN_INJURY_TYPES   = INJURY_TYPES.filter(t => t.id !== 'other')
const OTHER_INJURY_TYPE   = INJURY_TYPES.find(t => t.id === 'other')

function findSimilarTile(text) {
  const input = sigWords(text)
  if (!input.length) return null
  for (const t of MAIN_INJURY_TYPES) {
    const tile = sigWords(t.label)
    if (input.some(w => tile.some(tw => tw.startsWith(w) || w.startsWith(tw)))) return t
  }
  return null
}

// ── Field building blocks ────────────────────────────────────────────────────

function initialsOf(label) {
  const parts = label.split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
}

const WORKER_OPTIONS = WORKERS.map(w => ({
  value:   w.value,
  label:   w.label,
  avatar:  `/avatars/${w.value}.png`,
  initial: initialsOf(w.label),
}))

const LOCATION_OPTIONS = WORK_CENTERS.map(wc => ({ value: wc.id, label: wc.label }))

function InlineRow({ label, error, htmlFor, children, wide }) {
  return (
    <div className={`sim-inline-row${wide ? ' sim-inline-row--wide' : ''}`}>
      <label htmlFor={htmlFor} className={`sim-inline-label${error ? ' sim-inline-label--error' : ''}`}>
        {label}
      </label>
      <div className="sim-inline-field">{children}</div>
    </div>
  )
}

function InjuryIcon({ type }) {
  const [errored, setErrored] = useState(false)
  if (errored) return type.fallbackIcon
  return (
    <img
      src={type.iconSrc}
      alt=""
      width="24"
      height="24"
      onError={() => setErrored(true)}
    />
  )
}

function InjuryCard({ type, selected, onSelect, conflict }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(type.id)}
      className={`sim-injury-card${selected ? ' sim-injury-card--selected' : ''}${conflict ? ' sim-injury-card--conflict' : ''}`}
    >
      <div className="sim-injury-card__tile">
        <InjuryIcon type={type} />
      </div>
      <span className="sim-injury-card__label">{type.label}</span>
    </button>
  )
}

function OtherInjuryField({ selected, value, onChange, onFocus, onBlur, showError, conflictType }) {
  const [acOpen, setAcOpen] = useState(false)
  const ref      = useRef(null)
  const inputRef = useRef(null)
  const suggestions = value.trim()
    ? OTHER_SUGGESTIONS.filter(s => s.toLowerCase().includes(value.toLowerCase()))
    : []

  useEffect(() => {
    if (!acOpen) return
    function handleMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setAcOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [acOpen])

  const hasBlankError    = showError && !value.trim()
  const hasConflict      = showError && !!conflictType && !!value.trim()
  const inputHasError    = hasBlankError || hasConflict

  return (
    <div className="sim-other-wrap">
      <div className={`sim-injury-card${selected ? ' sim-injury-card--selected' : ''}`}>
        <div
          className="sim-injury-card__tile"
          onClick={() => inputRef.current?.focus()}
          style={{ cursor: 'pointer' }}
        >
          <InjuryIcon type={OTHER_INJURY_TYPE} />
        </div>
        <div ref={ref} className="sim-other-input-wrap">
          <input
            ref={inputRef}
            type="text"
            className={`sim-uline sim-injury-card__other-input${inputHasError ? ' sim-uline--error' : ''}`}
            placeholder="Other…"
            value={value}
            onChange={e => { onChange(e); setAcOpen(true) }}
            onFocus={() => { onFocus(); if (value.trim()) setAcOpen(true) }}
            onKeyDown={e => e.key === 'Escape' && setAcOpen(false)}
            onBlur={onBlur}
          />
          {acOpen && suggestions.length > 0 && (
            <div className="sim-other-ac">
              {suggestions.map(s => (
                <button
                  key={s}
                  type="button"
                  className="sim-ac__item"
                  onMouseDown={e => { e.preventDefault(); onChange({ target: { value: s } }); setAcOpen(false) }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {hasBlankError && (
        <p className="sim-other-msg sim-other-msg--error">
          Please describe the injury type or select an existing option
        </p>
      )}
      {hasConflict && (
        <p className="sim-other-msg sim-other-msg--warn">
          This matches an existing option — please select <em>'{conflictType.label}'</em> instead
        </p>
      )}
    </div>
  )
}

function ActionsAutocomplete({ value, onValueChange, onBlur, error }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const suggestions = value.trim()
    ? ACTIONS_SUGGESTIONS.filter(s => s.toLowerCase().includes(value.toLowerCase()))
    : []

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  return (
    <div ref={ref} className="sim-ac">
      <input
        type="text"
        placeholder="Example: First Aid Provided…"
        className={`sim-uline${error ? ' sim-uline--error' : ''}`}
        value={value}
        onChange={e => { onValueChange(e.target.value); setOpen(true) }}
        onFocus={() => { if (value.trim()) setOpen(true) }}
        onKeyDown={e => { if (e.key === 'Escape') setOpen(false) }}
        onBlur={onBlur}
      />
      {open && suggestions.length > 0 && (
        <div className="sim-ac__panel">
          {suggestions.map(s => (
            <button
              type="button"
              key={s}
              className="sim-ac__item"
              onMouseDown={e => { e.preventDefault(); onValueChange(s); setOpen(false) }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
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

// ── Modal ───────────────────────────────────────────────────────────────────

export default function SafetyIncidentModal({ isOpen, onClose, onSubmit }) {
  const modalRef = useRef(null)

  const now = new Date()
  const incidentDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const emptyForm = {
    reportedBy: CURRENT_USER,
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
    const otherTextOk     = form.selectedInjuryType !== 'other'
      || (!!form.otherInjuryText.trim() && !findSimilarTile(form.otherInjuryText))
    const otherLocationOk = form.incidentLocation !== 'other' || !!form.otherLocation
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

  function handleLocationChange(value) {
    const wc = WORK_CENTERS.find(x => x.id === value)
    setForm(f => ({
      ...f,
      incidentLocation:   value,
      workCenterLocation: wc ? wc.warehouseLocation : '',
    }))
  }

  function handleMainTileSelect(id) {
    setForm(f => ({
      ...f,
      selectedInjuryType: f.selectedInjuryType === id ? '' : id,
      otherInjuryText:    '',
    }))
    setTouched(t => { const n = { ...t }; delete n.otherInjuryText; return n })
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

  const injuryGridError  = showErrors && !form.selectedInjuryType
  const otherConflict    = form.selectedInjuryType === 'other' && form.otherInjuryText.trim()
    ? findSimilarTile(form.otherInjuryText)
    : null
  const showOtherErrors  = showErrors || !!touched.otherInjuryText

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
          <span id="sim-modal-title" className="sim-header__title">Safety Incident Report</span>
          <button className="sim-close-btn" onClick={handleClose} aria-label="Close">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="sim-body">
          {/* Reporter row */}
          <div className="sim-reporter-row">
            <div className="sim-inline-row sim-inline-row--wide">
              <label className="sim-inline-label">Reported By</label>
              <div className="sim-inline-field">
                <span className="sim-date-text">{form.reportedBy}</span>
              </div>
            </div>
            <div className="sim-reporter-row__group">
              <span className="sim-inline-label">Incident Date</span>
              <span className="sim-date-text">{incidentDate}</span>
            </div>
          </div>

          {/* Row 1: Injured Worker | Worker ID | Job Title */}
          <div className="sim-grid-3">
            <InlineRow label="Injured Worker" error={err('injuredWorker')} wide>
              <FormDropdown
                value={form.injuredWorker}
                options={WORKER_OPTIONS}
                onChange={handleWorkerChange}
                onBlur={() => touch('injuredWorker')}
                placeholder="Select Worker"
                error={err('injuredWorker')}
                withAvatars
                footerLabel="Search more…"
                ariaLabel="Injured Worker"
              />
            </InlineRow>

            <InlineRow label="Worker ID" error={err('workerId')} wide>
              <span className={`sim-static-value${!form.workerId ? ' sim-static-value--empty' : ''}`}>
                {form.workerId || 'Select ID'}
              </span>
            </InlineRow>

            <InlineRow label="Job Title" error={err('jobTitle')}>
              <span className={`sim-static-value${!form.jobTitle ? ' sim-static-value--empty' : ''}`}>
                {form.jobTitle || 'Title'}
              </span>
            </InlineRow>
          </div>

          {/* Row 2: Incident Location | Work Center Location */}
          <div className="sim-grid-2-aligned">
            <InlineRow label="Incident Location" error={err('incidentLocation')} wide>
              <FormDropdown
                value={form.incidentLocation}
                options={LOCATION_OPTIONS}
                onChange={handleLocationChange}
                onBlur={() => touch('incidentLocation')}
                placeholder="Select Work Center"
                error={err('incidentLocation')}
                ariaLabel="Incident Location"
              />
              {form.incidentLocation === 'other' && (
                <input
                  type="text"
                  placeholder="Please specify the location..."
                  className={`sim-uline sim-uline--secondary${(showErrors || touched.otherLocation) && !form.otherLocation ? ' sim-uline--error' : ''}`}
                  value={form.otherLocation}
                  onChange={e => setForm(f => ({
                    ...f,
                    otherLocation:      e.target.value,
                    workCenterLocation: e.target.value,
                  }))}
                  onBlur={() => touch('otherLocation')}
                  autoFocus
                />
              )}
            </InlineRow>

            <InlineRow label="Work Center Location" wide>
              <span className={`sim-static-value${!form.workCenterLocation ? ' sim-static-value--empty' : ''}`}>
                {form.workCenterLocation || 'Warehouse 2'}
              </span>
            </InlineRow>
          </div>

          {/* Type of Injury */}
          <div className="sim-section">
            <span className={`sim-section-title${injuryGridError ? ' sim-section-title--error' : ''}`}>
              Type Of Injury
              {injuryGridError && <span className="sim-section-subtitle">— please select one</span>}
            </span>
            <div className="sim-injury-grid">
              {MAIN_INJURY_TYPES.slice(0, 8).map(type => (
                <InjuryCard
                  key={type.id}
                  type={type}
                  selected={form.selectedInjuryType === type.id}
                  conflict={otherConflict?.id === type.id}
                  onSelect={handleMainTileSelect}
                />
              ))}

              {/* "Other..." card with autocomplete + validation */}
              <OtherInjuryField
                selected={form.selectedInjuryType === 'other'}
                value={form.otherInjuryText}
                onChange={e => setForm(f => ({
                  ...f,
                  selectedInjuryType: 'other',
                  otherInjuryText: e.target.value,
                }))}
                onFocus={() => setForm(f => ({ ...f, selectedInjuryType: 'other' }))}
                onBlur={() => touch('otherInjuryText')}
                showError={showOtherErrors}
                conflictType={otherConflict}
              />

              {/* Row 4 */}
              {MAIN_INJURY_TYPES.slice(8).map(type => (
                <InjuryCard
                  key={type.id}
                  type={type}
                  selected={form.selectedInjuryType === type.id}
                  conflict={otherConflict?.id === type.id}
                  onSelect={handleMainTileSelect}
                />
              ))}
              <div className="sim-injury-card sim-injury-card--empty" aria-hidden="true" />
            </div>
          </div>

          {/* Bottom: Incident Details | Actions/Time/Severity */}
          <div className="sim-bottom-divider" />
          <div className="sim-grid-bottom">
            {/* Left: Incident Details (label above, filled textarea) */}
            <div>
              <span className="sim-section-title">Incident Details</span>
              <textarea
                placeholder="Describe what happened, conditions at the time, and any other relevant details..."
                className="sim-textarea"
                value={form.incidentDetails}
                onChange={e => setForm(f => ({ ...f, incidentDetails: e.target.value }))}
              />
            </div>

            {/* Right: Actions Taken / Time / Severity */}
            <div className="sim-bottom-right">
              <InlineRow label="Actions Taken" error={err('actionsTaken')} wide>
                <ActionsAutocomplete
                  value={form.actionsTaken}
                  onValueChange={v => setForm(f => ({ ...f, actionsTaken: v }))}
                  onBlur={() => touch('actionsTaken')}
                  error={err('actionsTaken')}
                />
              </InlineRow>

              <InlineRow label="Time of Incident" wide>
                <input
                  type="time"
                  className="sim-uline sim-uline--time"
                  value={form.timeOfIncident}
                  onChange={e => setForm(f => ({ ...f, timeOfIncident: e.target.value }))}
                />
              </InlineRow>

              <InlineRow label="Incident Severity" error={err('severity')} wide>
                <div className="sim-severity-options">
                  {SEVERITY_OPTIONS.map(opt => {
                    const active = form.severity === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
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
              </InlineRow>
            </div>
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
