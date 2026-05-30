import React, { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../shared/Icon'
import './ShareIncidentPopup.css'

const RECIPIENTS = [
  { id: 'maria',     type: 'person', name: 'Maria Shadrin',  role: 'Plant Director',     initial: 'M' },
  { id: 'emma',      type: 'person', name: 'Emma Granger',   role: 'Shift Supervisor',   initial: 'E' },
  { id: 'daniel',    type: 'person', name: 'Daniel M.',      role: 'Operations Manager', initial: 'D' },
  { id: 'safety',    type: 'group',  name: 'Safety Committee',  role: 'Group', initial: 'S' },
  { id: 'shift-sup', type: 'group',  name: 'Shift Supervisors', role: 'Group', initial: 'S' },
]

export default function ShareIncidentPopup({ isOpen, onClose, onConfirm }) {
  const [query, setQuery]                 = useState('')
  const [selectedIds, setSelectedIds]     = useState([])
  const [emailAlso, setEmailAlso]         = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelectedIds([])
      setEmailAlso(false)
      return
    }
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => {
      document.removeEventListener('keydown', handleKey)
      clearTimeout(t)
    }
  }, [isOpen, onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return RECIPIENTS
    return RECIPIENTS.filter(r =>
      r.name.toLowerCase().includes(q) || r.role.toLowerCase().includes(q)
    )
  }, [query])

  if (!isOpen) return null

  function toggleRecipient(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleShare() {
    if (selectedIds.length === 0) return
    const selected = selectedIds
      .map(id => RECIPIENTS.find(r => r.id === id))
      .filter(Boolean)
    onConfirm({ recipients: selected, emailAlso })
  }

  const canShare = selectedIds.length > 0

  return (
    <div className="sip-overlay" onClick={onClose}>
      <div
        className="sip-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Share Incident Report"
      >
        {/* Header */}
        <div className="sip-header">
          <span className="sip-header__title">Share Incident Report</span>
          <button className="sip-close-btn" onClick={onClose} aria-label="Close">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="sip-body">
          <div className="sip-section">
            <label className="sip-label" htmlFor="sip-search">Share with</label>
            <div className="sip-search-wrap">
              <svg className="sip-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                id="sip-search"
                ref={inputRef}
                type="text"
                className="sip-search-input"
                placeholder="Search people or groups…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <ul className="sip-recipient-list" role="listbox" aria-multiselectable="true">
              {filtered.length === 0 ? (
                <li className="sip-empty">No matches</li>
              ) : filtered.map(r => {
                const checked = selectedIds.includes(r.id)
                return (
                  <li
                    key={r.id}
                    className={`sip-recipient ${checked ? 'sip-recipient--checked' : ''}`}
                    onClick={() => toggleRecipient(r.id)}
                    role="option"
                    aria-selected={checked}
                  >
                    <span className="sip-check" aria-hidden="true">
                      {checked && <Icon char={"\uF00C"} size={12} color="#03F9E3" />}
                    </span>
                    <span className={`sip-avatar sip-avatar--${r.type}`}>
                      {r.type === 'group' ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      ) : (
                        r.initial
                      )}
                    </span>
                    <span className="sip-recipient__text">
                      <span className="sip-recipient__name">{r.name}</span>
                      <span className="sip-recipient__role">{r.role}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="sip-section sip-section--options">
            <label className="sip-option-row">
              <span
                className={`sip-checkbox ${emailAlso ? 'sip-checkbox--checked' : ''}`}
                aria-hidden="true"
              >
                {emailAlso && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                className="sip-option-native"
                checked={emailAlso}
                onChange={e => setEmailAlso(e.target.checked)}
              />
              <span className="sip-option-label">Also send via email</span>
            </label>
            {emailAlso && (
              <div className="sip-option-note">
                Recipients will receive a copy of this report by email
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sip-footer">
          <button
            className="sip-btn sip-btn--share"
            onClick={handleShare}
            disabled={!canShare}
          >Share</button>
          <button className="sip-btn sip-btn--cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
