import React, { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../shared/Icon'
import './InsertSpreadsheetModal.css'

const SECTION_OPTIONS = [
  { value: 'Safety',        label: 'Safety' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Operations',    label: 'Operations' },
  { value: 'Quality',       label: 'Quality' },
  { value: 'Management',    label: 'Management' },
]

const PAGE_SIZE = 3

function BlankDashboardIcon() {
  return (
    <svg width="46" height="46" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#1DC959" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="#1B1D26" strokeWidth="1.2" />
    </svg>
  )
}

function DashboardCard({ dashboard, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(dashboard.id)}
      className={`ism-card${selected ? ' ism-card--selected' : ''}`}
    >
      <div className="ism-card__preview">
        {dashboard.blank
          ? <BlankDashboardIcon />
          : <span className="ism-card__no-preview">No preview</span>}
      </div>
      <span className="ism-card__name">{dashboard.name}</span>
    </button>
  )
}

export default function InsertSpreadsheetModal({
  isOpen,
  defaultGraphName = '',
  dashboards,
  onCreateDashboard,
  onClose,
  onInsert,
}) {
  const [graphName,  setGraphName]  = useState(defaultGraphName)
  const [selectedId, setSelectedId] = useState(dashboards[0]?.id || null)
  const [query,      setQuery]      = useState('')
  const [page,       setPage]       = useState(0)
  const closeRef = useRef(null)

  useEffect(() => { if (isOpen) setGraphName(defaultGraphName) }, [isOpen, defaultGraphName])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setPage(0)
      return
    }
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    const t = setTimeout(() => closeRef.current?.focus(), 60)
    return () => {
      document.removeEventListener('keydown', handleKey)
      clearTimeout(t)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!dashboards.find(d => d.id === selectedId)) {
      setSelectedId(dashboards[0]?.id || null)
    }
  }, [dashboards, selectedId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return dashboards
    return dashboards.filter(d => d.name.toLowerCase().includes(q))
  }, [dashboards, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages - 1)
  const pageStart  = safePage * PAGE_SIZE
  const pageEnd    = Math.min(pageStart + PAGE_SIZE, filtered.length)
  const pageItems  = filtered.slice(pageStart, pageEnd)
  const rangeLabel = filtered.length === 0
    ? '0-0 / 0'
    : `${pageStart + 1}-${pageEnd} / ${filtered.length}`

  if (!isOpen) return null

  function handleInsert() {
    const dashboard = dashboards.find(d => d.id === selectedId)
    if (!dashboard) return
    onInsert({ dashboard, graphName: graphName.trim() || defaultGraphName })
  }

  return (
    <div className="ism-overlay" onClick={onClose}>
      <div
        className="ism-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ism-title"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ism-header">
          <span id="ism-title" className="ism-header__title">Insert in Spreadsheet</span>
          <button
            ref={closeRef}
            className="ism-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="ism-body">
          {/* Graph name */}
          <div className="ism-graph-name-row">
            <label htmlFor="ism-graph-name" className="ism-graph-name-label">Graph name</label>
            <div className="ism-graph-name-divider" aria-hidden="true" />
            <input
              id="ism-graph-name"
              type="text"
              className="ism-graph-name-input"
              value={graphName}
              onChange={e => setGraphName(e.target.value)}
              placeholder="Untitled graph"
            />
          </div>

          {/* Tabs */}
          <div className="ism-tabs-row">
            <button type="button" className="ism-tab ism-tab--active">Dashboards</button>
          </div>

          {/* Search (underline) + pagination */}
          <div className="ism-search-row">
            <div className="ism-search">
              <input
                type="text"
                className="ism-search-input"
                placeholder="Search..."
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(0) }}
              />
              <Icon char={"\uF002"} size={12} color="#8A8D9A" />
            </div>
            <div className="ism-pager">
              <span className="ism-pager__range">{rangeLabel}</span>
              <button
                type="button"
                className="ism-pager__btn"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={safePage === 0}
                aria-label="Previous page"
              >
                <Icon char={"\uF053"} size={11} color="#F5F5F6" />
              </button>
              <button
                type="button"
                className="ism-pager__btn"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                aria-label="Next page"
              >
                <Icon char={"\uF054"} size={11} color="#F5F5F6" />
              </button>
            </div>
          </div>

          {/* Cards grid */}
          <div className="ism-cards">
            {pageItems.length === 0 ? (
              <div className="ism-empty">No dashboards match "{query}"</div>
            ) : pageItems.map(d => (
              <DashboardCard
                key={d.id}
                dashboard={d}
                selected={selectedId === d.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="ism-footer">
          <button
            type="button"
            className="ism-btn ism-btn--insert"
            onClick={handleInsert}
            disabled={!selectedId}
          >Insert</button>
          <button
            type="button"
            className="ism-btn ism-btn--discard"
            onClick={onClose}
          >Discard</button>
        </div>
      </div>
    </div>
  )
}
