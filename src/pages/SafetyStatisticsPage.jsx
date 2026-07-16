import React, { useState, useEffect, useRef } from 'react'
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts'
import Icon from '../components/shared/Icon'
import { Button, ButtonGroup } from '../components/shared/Button'
import InsertSpreadsheetModal from '../components/modals/InsertSpreadsheetModal'
import '../components/modals/InsertSpreadsheetModal.css'
import {
  INCIDENTS, DIMENSIONS, DATE_FILTERS,
  findDimension, findDateFilter,
  aggregate, colorFor,
  PALETTE,
} from '../data/incidents'
import './SafetyStatisticsPage.css'

const FONT = "'Segoe UI', sans-serif"

// ── Tooltip style objects (passed to Recharts library API, not HTML inline styles) ──

const tooltipContentStyle = {
  background: '#262A36', border: '1px solid #3C3E4A', borderRadius: 4,
  padding: '8px 12px', fontFamily: FONT, fontSize: 12.5,
  color: '#F5F5F6', boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
}
const tooltipLabelStyle = {
  color: '#F5F5F6', fontFamily: FONT, fontWeight: 700, fontSize: 12.5, marginBottom: 4,
}
const tooltipItemStyle = {
  color: '#F5F5F6', fontFamily: FONT, fontSize: 12.5, padding: 0,
}
const tooltipFixedPosition = { y: 0 }

// ── ConfigDropdown ─────────────────────────────────────────────────────────────

function DropdownItem({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`config-dropdown-item${selected ? ' config-dropdown-item--selected' : ''}`}
    >
      {label}
    </button>
  )
}

function ConfigDropdown({ prefix, value, options, onChange, includeNone = false, variant = 'purple', minWidth = 200 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = value ? options.find(o => o.id === value) : null
  const labelText = current ? current.label : 'None'

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  return (
    <div ref={ref} className="config-dropdown">
      <Button
        variant={variant}
        active={open}
        onClick={() => setOpen(o => !o)}
        className="btn-config-dropdown"
      >
        <span className="config-prefix">{prefix}:</span>
        <span>{labelText}</span>
        <Icon char={open ? '' : ''} size={11} />
      </Button>
      {open && (
        <div className="config-dropdown__panel" style={{ minWidth }}>
          {includeNone && (
            <DropdownItem label="None" selected={!value} onClick={() => { onChange(null); setOpen(false) }} />
          )}
          {options.map(opt => (
            <DropdownItem
              key={opt.id}
              label={opt.label}
              selected={opt.id === value}
              onClick={() => { onChange(opt.id); setOpen(false) }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── StatsToolbar ───────────────────────────────────────────────────────────────

const GROUP_BY_DIMS = DIMENSIONS.filter(d => d.id !== 'month' && d.id !== 'dayOfWeek')
const COMPARE_BY_IDS = new Set(['workCenter', 'injuryType'])
const DATE_FILTER_IDS = new Set(['last7', 'thisMonth', 'thisQuarter', 'thisYear', 'all'])
const STATS_DATE_FILTERS = DATE_FILTERS.filter(d => DATE_FILTER_IDS.has(d.id))

function StatsToolbar({
  groupById, onGroupByChange,
  compareById, onCompareByChange,
  dateFilterId, onDateChange,
  graphType, onGraphTypeChange,
  stacked, onStackedToggle,
  sortOrder, onSortChange,
  onInsertSpreadsheet,
}) {
  const isLast7ByDay      = dateFilterId === 'last7ByDay'
  const compareByOptions  = DIMENSIONS.filter(d => COMPARE_BY_IDS.has(d.id) && d.id !== groupById)
  const showCompareBy     = graphType !== 'pie'
  const showStackedToggle = graphType === 'bar' && !!compareById
  const showSort          = graphType !== 'pie'

  return (
    <div className="stats-toolbar">
      {isLast7ByDay ? (
        <Button variant="purple" className="btn-config-dropdown" style={{ opacity: 0.65, cursor: 'default' }}>
          <span className="config-prefix">Group by:</span>
          <span>Day of Week</span>
        </Button>
      ) : (
        <ConfigDropdown prefix="Group by" value={groupById} options={GROUP_BY_DIMS} onChange={onGroupByChange} />
      )}
      {showCompareBy && (
        <ConfigDropdown prefix="Compare by" value={compareById} options={compareByOptions} onChange={onCompareByChange} includeNone />
      )}
      <ConfigDropdown prefix="Date" value={dateFilterId} options={STATS_DATE_FILTERS} onChange={onDateChange} minWidth={210} />

      <Button
        onClick={onInsertSpreadsheet}
        title="Insert in Spreadsheet"
        className="btn-insert-spreadsheet"
      >
        <span>Insert in Spreadsheet</span>
      </Button>

      <ButtonGroup gap={1} style={{ marginLeft: 4 }}>
        <Button active={graphType === 'bar'}  onClick={() => onGraphTypeChange('bar')}  title="Bar chart"  className="btn-stats-icon"><Icon char=""  size={14} /></Button>
        <Button active={graphType === 'line'} onClick={() => onGraphTypeChange('line')} title="Line chart" className="btn-stats-icon"><Icon char="" size={14} /></Button>
        <Button active={graphType === 'pie'}  onClick={() => onGraphTypeChange('pie')}  title="Pie chart"  className="btn-stats-icon"><Icon char=""  size={14} /></Button>
      </ButtonGroup>

      {showStackedToggle && (
        <Button active={stacked} onClick={onStackedToggle} title="Stack series" className="btn-stats-stacked">
          <Icon char="" size={13} />
          <span>Stacked</span>
        </Button>
      )}

      {showSort && (
        <ButtonGroup gap={1}>
          <Button active={sortOrder === 'desc'} onClick={() => onSortChange(sortOrder === 'desc' ? null : 'desc')} title="Sort descending" className="btn-stats-icon"><Icon char={"\uF161"} size={14} /></Button>
          <Button active={sortOrder === 'asc'}  onClick={() => onSortChange(sortOrder === 'asc'  ? null : 'asc')}  title="Sort ascending"  className="btn-stats-icon"><Icon char={"\uF160"}  size={14} /></Button>
        </ButtonGroup>
      )}
    </div>
  )
}

// ── Chart render helpers ───────────────────────────────────────────────────────

function renderBars(rows, seriesKeys, stacked, compareDim) {
  if (!seriesKeys.length) {
    return (
      <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
        {rows.map((r, i) => <Cell key={r.key} fill={PALETTE[i % PALETTE.length]} />)}
      </Bar>
    )
  }
  return seriesKeys.map((s, i) => (
    <Bar key={s} dataKey={s} stackId={stacked ? 'stack' : undefined}
      fill={colorFor(compareDim, s, i)} radius={stacked ? 0 : [2, 2, 0, 0]} isAnimationActive={false} />
  ))
}

function renderLines(rows, seriesKeys, compareDim) {
  if (!seriesKeys.length) {
    const stroke = PALETTE[0]
    return (
      <Line type="linear" dataKey="value" stroke={stroke} strokeWidth={2.4}
        dot={{ r: 4, fill: stroke, strokeWidth: 0 }}
        activeDot={{ r: 5, fill: stroke, strokeWidth: 0 }}
        isAnimationActive={false} />
    )
  }
  return seriesKeys.map((s, i) => {
    const stroke = colorFor(compareDim, s, i)
    return (
      <Line key={s} type="linear" dataKey={s} stroke={stroke} strokeWidth={2.2}
        dot={{ r: 4, fill: stroke, strokeWidth: 0 }}
        activeDot={{ r: 5, fill: stroke, strokeWidth: 0 }}
        isAnimationActive={false} />
    )
  })
}

function pieRows(rows, seriesKeys) {
  if (!seriesKeys.length) return rows
  return rows.map(r => ({
    key: r.key,
    value: seriesKeys.reduce((sum, s) => sum + (r[s] || 0), 0),
  }))
}

// ── StatsSubHeader ─────────────────────────────────────────────────────────────

function StatsSubHeader({ filteredCenter, onClearFilter, onOpenModal }) {
  return (
    <div className="stats-sub-header">
      <div className="stats-sub-header__title-area">
        <span className="stats-sub-header__title">Safety Statistics</span>
      </div>

      <div className="stats-sub-header__search">
        <div className="stats-sub-header__search-field">
          <span className="stats-sub-header__search-icon">
            <Icon char={"\uF002"} size={14} color="#e4e4e4" />
          </span>
          {filteredCenter && (
            <span className="filter-chip">
              <Icon char={"\uF0B0"} size={11} color="#D7B3D3" />
              <span>{filteredCenter}</span>
              <button className="filter-chip__clear" onClick={onClearFilter} title="Clear filter" aria-label="Clear filter">×</button>
            </span>
          )}
          <span className="stats-sub-header__search-placeholder">Search...</span>
        </div>
        <button className="stats-sub-header__search-expand" aria-label="Expand search">
          <Icon char={"\uF0D7"} size={11} color="#e4e4e4" />
        </button>
      </div>

      <div className="stats-sub-header__actions">
        {/* Graph is the only view built, so it stays the active one. */}
        <ButtonGroup gap={1}>
          <Button title="Graph view" active className="btn-stats-view">
            <Icon char={"\uF1FE"} size={14} />
          </Button>
          <Button title="Pivot view" className="btn-stats-view">
            <Icon char={"\uE800"} font="odoo" size={14} />
          </Button>
          <Button title="List view" className="btn-stats-view">
            <Icon char={"\uF039"} size={14} />
          </Button>
        </ButtonGroup>
        <button className="stats-sub-header__danger-btn" onClick={onOpenModal} title="Report Incident">
          <Icon char="" size={13} />
        </button>
      </div>
    </div>
  )
}

// ── SafetyStatisticsPage ───────────────────────────────────────────────────────

export default function SafetyStatisticsPage({ initialParams = null, incidents = INCIDENTS, onOpenModal }) {
  const [groupById,     setGroupById]     = useState(initialParams?.initialGroupBy   ?? 'workCenter')
  const [compareById,   setCompareById]   = useState(initialParams?.initialCompareBy ?? null)
  const [dateFilterId,  setDateFilterId]  = useState(
    DATE_FILTER_IDS.has(initialParams?.initialDate) ? initialParams.initialDate : 'last7'
  )
  const [graphType,     setGraphType]     = useState(initialParams?.initialGraphType  ?? 'bar')
  const [stacked,       setStacked]       = useState(false)
  const [sortOrder,     setSortOrder]     = useState(null)
  const [filteredCenter, setFilteredCenter] = useState(initialParams?.initialFilter ?? null)

  const [isInsertOpen, setIsInsertOpen] = useState(false)
  const [toast,        setToast]        = useState(null)
  const [dashboards,   setDashboards]   = useState([
    { id: 'blank',           name: 'Blank dashboard', blank: true },
    { id: 'safety-overview', name: 'Safety Overview' },
    { id: 'monthly-report',  name: 'Monthly Report' },
  ])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  function handleCreateDashboard({ name, section, group }) {
    const id = `dash-${Date.now()}`
    setDashboards(prev => [...prev, { id, name, section, group }])
    return id
  }

  function handleInsert({ dashboard, graphName }) {
    setIsInsertOpen(false)
    setToast({ dashboardName: dashboard.name, graphName })
  }

  useEffect(() => {
    if (compareById && compareById === groupById) setCompareById(null)
  }, [groupById, compareById])

  useEffect(() => {
    if (dateFilterId === 'last7ByDay') setGroupById('dayOfWeek')
  }, [dateFilterId])

  const groupBy    = findDimension(groupById)
  const compareBy  = compareById ? findDimension(compareById) : null
  const dateFilter = findDateFilter(dateFilterId) ?? STATS_DATE_FILTERS[0]

  const filteredIncidents = incidents.filter(i => {
    if (!dateFilter.predicate(i)) return false
    if (filteredCenter && i.workCenter !== filteredCenter) return false
    return true
  })

  let { rows, seriesKeys } = aggregate(filteredIncidents, groupBy, compareBy)

  if (sortOrder) {
    const total = r => (seriesKeys.length ? seriesKeys.reduce((s, k) => s + (r[k] || 0), 0) : r.value)
    rows = [...rows].sort((a, b) => sortOrder === 'desc' ? total(b) - total(a) : total(a) - total(b))
  }

  const pieDisplayRows = pieRows(rows, seriesKeys)

  return (
    <>
      <StatsSubHeader filteredCenter={filteredCenter} onClearFilter={() => setFilteredCenter(null)} onOpenModal={onOpenModal} />
      <main className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
        <StatsToolbar
          groupById={groupById}       onGroupByChange={setGroupById}
          compareById={compareById}   onCompareByChange={setCompareById}
          dateFilterId={dateFilterId} onDateChange={setDateFilterId}
          graphType={graphType}       onGraphTypeChange={setGraphType}
          stacked={stacked}           onStackedToggle={() => setStacked(s => !s)}
          sortOrder={sortOrder}       onSortChange={setSortOrder}
          onInsertSpreadsheet={() => setIsInsertOpen(true)}
        />
        <div className="stats-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            {graphType === 'bar' ? (
              <BarChart data={rows} margin={{ top: 20, right: 24, left: 8, bottom: 40 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="key" interval={0} tick={{ fill: '#A0A4AF', fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} position={tooltipFixedPosition} />
                {seriesKeys.length > 0 && <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: '#F5F5F6' }} iconType="rect" />}
                {renderBars(rows, seriesKeys, stacked, compareBy)}
              </BarChart>
            ) : graphType === 'line' ? (
              <LineChart data={rows} margin={{ top: 20, right: 32, left: 8, bottom: 40 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="key" interval={0} tick={{ fill: '#626363', fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} position={tooltipFixedPosition} />
                {seriesKeys.length > 0 && <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: '#F5F5F6' }} iconType="rect" />}
                {renderLines(rows, seriesKeys, compareBy)}
              </LineChart>
            ) : (
              <PieChart>
                <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} position={tooltipFixedPosition} />
                <Legend layout="vertical" verticalAlign="top" align="right" wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: '#F5F5F6' }} iconType="rect" />
                <Pie data={pieDisplayRows} dataKey="value" nameKey="key" cx="45%" outerRadius="80%" innerRadius={0} isAnimationActive={false} labelLine={false} stroke="none">
                  {pieDisplayRows.map((d, i) => <Cell key={d.key} fill={colorFor(groupBy, d.key, i)} stroke="none" />)}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </main>

      <InsertSpreadsheetModal
        isOpen={isInsertOpen}
        defaultGraphName={groupBy?.label || 'Graph'}
        dashboards={dashboards}
        onCreateDashboard={handleCreateDashboard}
        onClose={() => setIsInsertOpen(false)}
        onInsert={handleInsert}
      />

      {toast && (
        <div className="ism-toast" role="status">
          {toast.graphName ? <>“<span className="ism-toast__accent">{toast.graphName}</span>” inserted into <span className="ism-toast__accent">{toast.dashboardName}</span></>
            : <>Graph inserted into <span className="ism-toast__accent">{toast.dashboardName}</span></>}
        </div>
      )}
    </>
  )
}
