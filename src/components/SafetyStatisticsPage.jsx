import React, { useState, useEffect, useRef } from 'react'
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts'
import Icon from './Icon'
import { Button, ButtonGroup } from './Button'
import {
  INCIDENTS, DIMENSIONS, DATE_FILTERS,
  findDimension, findDateFilter,
  aggregate, colorFor,
  WORK_CENTER_COLORS, PALETTE,
} from '../data/incidents'

const FONT = "'Segoe UI', sans-serif"

// ── Tooltip styling ──────────────────────────────────────────────────────────

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

// ── Generic configuration dropdown (Group By, Compare By, Date) ──────────────

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
    <div ref={ref} style={{ position: 'relative' }}>
      <Button
        variant={variant}
        active={open}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', height: 32,
          fontFamily: FONT, fontWeight: 600, fontSize: 13,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ opacity: 0.7, fontWeight: 500 }}>{prefix}:</span>
        <span>{labelText}</span>
        <Icon char={open ? '' : ''} size={11} />
      </Button>

      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            background: '#2A2E3A',
            border: '1px solid #3C3E4A',
            borderRadius: 4,
            minWidth,
            padding: '4px 0',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
          }}
        >
          {includeNone && (
            <DropdownItem
              label="None"
              selected={!value}
              onClick={() => { onChange(null); setOpen(false) }}
            />
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

function DropdownItem({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        background: selected ? 'rgba(26,211,187,0.07)' : 'transparent',
        color: selected ? '#1AD3BB' : '#F5F5F6',
        border: 'none', cursor: 'pointer',
        padding: '8px 14px',
        fontFamily: FONT, fontSize: 13,
        transition: 'background 0.12s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
    >
      {label}
    </button>
  )
}

// ── Stats toolbar ────────────────────────────────────────────────────────────

const iconBtn = { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }

function StatsToolbar({
  groupById, onGroupByChange,
  compareById, onCompareByChange,
  dateFilterId, onDateChange,
  graphType, onGraphTypeChange,
  stacked, onStackedToggle,
  sortOrder, onSortChange,
}) {
  // Compare By options exclude whatever Group By currently is
  const compareByOptions = DIMENSIONS.filter(d => d.id !== groupById)
  const showStackedToggle = graphType === 'bar' && !!compareById
  const showSort = graphType !== 'pie'

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 8, flexWrap: 'wrap' }}>
      <ConfigDropdown
        prefix="Group by"
        value={groupById}
        options={DIMENSIONS}
        onChange={onGroupByChange}
      />
      <ConfigDropdown
        prefix="Compare by"
        value={compareById}
        options={compareByOptions}
        onChange={onCompareByChange}
        includeNone
      />
      <ConfigDropdown
        prefix="Date"
        value={dateFilterId}
        options={DATE_FILTERS}
        onChange={onDateChange}
        minWidth={180}
      />

      <ButtonGroup gap={3} style={{ marginLeft: 4 }}>
        <Button active={graphType === 'bar'}  onClick={() => onGraphTypeChange('bar')}  title="Bar chart"  style={iconBtn}><Icon char={''} size={14} /></Button>
        <Button active={graphType === 'line'} onClick={() => onGraphTypeChange('line')} title="Line chart" style={iconBtn}><Icon char={''} size={14} /></Button>
        <Button active={graphType === 'pie'}  onClick={() => onGraphTypeChange('pie')}  title="Pie chart"  style={iconBtn}><Icon char={''} size={14} /></Button>
      </ButtonGroup>

      {showStackedToggle && (
        <Button
          active={stacked}
          onClick={onStackedToggle}
          title="Stack series"
          style={{ ...iconBtn, width: 'auto', padding: '0 12px', gap: 6, fontFamily: FONT, fontSize: 13, fontWeight: 600 }}
        >
          <Icon char={''} size={13} />
          <span>Stacked</span>
        </Button>
      )}

      {showSort && (
        <ButtonGroup gap={3}>
          <Button
            active={sortOrder === 'desc'}
            onClick={() => onSortChange(sortOrder === 'desc' ? null : 'desc')}
            title="Sort descending"
            style={iconBtn}
          ><Icon char={''} size={14} /></Button>
          <Button
            active={sortOrder === 'asc'}
            onClick={() => onSortChange(sortOrder === 'asc' ? null : 'asc')}
            title="Sort ascending"
            style={iconBtn}
          ><Icon char={''} size={14} /></Button>
        </ButtonGroup>
      )}
    </div>
  )
}

// ── Chart bodies ─────────────────────────────────────────────────────────────

// Builds the bar series children. When seriesKeys is empty we render a single
// Bar with per-cell colors (the "single dimension" view). When seriesKeys is
// present each series becomes its own Bar — stacked via stackId if requested.
function renderBars(rows, seriesKeys, stacked, compareDim) {
  if (!seriesKeys.length) {
    return (
      <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
        {rows.map((r, i) => (
          <Cell key={r.key} fill={PALETTE[i % PALETTE.length]} />
        ))}
      </Bar>
    )
  }
  return seriesKeys.map((s, i) => (
    <Bar
      key={s}
      dataKey={s}
      stackId={stacked ? 'stack' : undefined}
      fill={colorFor(compareDim, s, i)}
      radius={stacked ? 0 : [2, 2, 0, 0]}
      isAnimationActive={false}
    />
  ))
}

function renderLines(rows, seriesKeys, compareDim) {
  if (!seriesKeys.length) {
    const stroke = PALETTE[0]
    return (
      <Line
        type="linear" dataKey="value" stroke={stroke} strokeWidth={2.4}
        dot={{ r: 4, fill: stroke, strokeWidth: 0 }}
        activeDot={{ r: 5, fill: stroke, strokeWidth: 0 }}
        isAnimationActive={false}
      />
    )
  }
  return seriesKeys.map((s, i) => {
    const stroke = colorFor(compareDim, s, i)
    return (
      <Line
        key={s} type="linear" dataKey={s} stroke={stroke} strokeWidth={2.2}
        dot={{ r: 4, fill: stroke, strokeWidth: 0 }}
        activeDot={{ r: 5, fill: stroke, strokeWidth: 0 }}
        isAnimationActive={false}
      />
    )
  })
}

// Pie ignores compareBy — collapse rows into one slice per group bucket.
function pieRows(rows, seriesKeys) {
  if (!seriesKeys.length) return rows
  return rows.map(r => ({
    key: r.key,
    value: seriesKeys.reduce((sum, s) => sum + (r[s] || 0), 0),
  }))
}

// ── Page sub-header ──────────────────────────────────────────────────────────

function StatsSubHeader({ filteredCenter, onClearFilter, onOpenModal }) {
  return (
    <div className="flex items-center h-10" style={{ background: '#262A36', borderBottom: '1px solid #3C3E4A' }}>
      <div style={{ flex: 1, padding: '0 16px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16.51, color: '#F5F5F6' }}>
          Work Centers Overview
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 border"
        style={{ background: '#1B1D26', borderColor: '#3C3E4A', borderRadius: 4, width: 420 }}>
        <Icon char={''} size={13} color="#626363" />
        {filteredCenter && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 6px 3px 8px',
            background: '#6B3E66',
            border: '1px solid rgba(167,116,160,0.55)',
            borderRadius: 3,
            fontFamily: FONT, fontSize: 12, color: '#F5F5F6',
            whiteSpace: 'nowrap',
          }}>
            <Icon char={''} size={11} color="#D7B3D3" />
            <span>{filteredCenter}</span>
            <button
              onClick={onClearFilter}
              title="Clear filter" aria-label="Clear filter"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 0, marginLeft: 2, color: '#D7B3D3',
                display: 'inline-flex', alignItems: 'center', lineHeight: 1, fontSize: 14,
              }}
            >×</button>
          </div>
        )}
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#626363', flex: 1 }}>Search...</span>
        <Icon char={''} size={11} color="#626363" />
      </div>

      <div style={{ flex: 1, padding: '0 16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, color: '#A0A4AF' }}>
        <ButtonGroup gap={3}>
          {[
            { label: 'Graph view',  path: <><rect x="3" y="11" width="4" height="8" rx="1" /><rect x="10" y="6" width="4" height="13" rx="1" /><rect x="17" y="9" width="4" height="10" rx="1" /></> },
            { label: 'Pivot view',  path: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></> },
            { label: 'List view',   path: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" /></> },
          ].map(v => (
            <Button key={v.label} title={v.label} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {v.path}
              </svg>
            </Button>
          ))}
        </ButtonGroup>

        <button onClick={onOpenModal} title="Report Incident" style={{
          width: 32, height: 32, background: '#B83232', border: 'none', borderRadius: 4,
          color: '#F5F5F6', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4,
        }}>
          <Icon char={''} size={13} />
        </button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SafetyStatisticsPage({ initialParams = null, onOpenModal }) {
  const [groupById, setGroupById]       = useState(initialParams?.initialGroupBy ?? 'workCenter')
  const [compareById, setCompareById]   = useState(initialParams?.initialCompareBy ?? null)
  const [dateFilterId, setDateFilterId] = useState(initialParams?.initialDate ?? 'last90')
  const [graphType, setGraphType]       = useState(initialParams?.initialGraphType ?? 'bar')
  const [stacked, setStacked]           = useState(false)
  const [sortOrder, setSortOrder]       = useState(null)
  const [filteredCenter, setFilteredCenter] = useState(initialParams?.initialFilter ?? null)

  // If compare-by ends up matching group-by (e.g. after a group-by change),
  // clear compare-by so the chart stays well-defined.
  useEffect(() => {
    if (compareById && compareById === groupById) setCompareById(null)
  }, [groupById, compareById])

  const groupBy   = findDimension(groupById)
  const compareBy = compareById ? findDimension(compareById) : null
  const dateFilter = findDateFilter(dateFilterId) ?? DATE_FILTERS[2]

  // Apply date filter, plus optional work-center filter from the search-bar chip
  const filteredIncidents = INCIDENTS.filter(i => {
    if (!dateFilter.predicate(i)) return false
    if (filteredCenter && i.workCenter !== filteredCenter) return false
    return true
  })

  let { rows, seriesKeys } = aggregate(filteredIncidents, groupBy, compareBy)

  // Sort applies to the X axis. For multi-series rows we sort by the row's total.
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
          groupById={groupById}     onGroupByChange={setGroupById}
          compareById={compareById} onCompareByChange={setCompareById}
          dateFilterId={dateFilterId} onDateChange={setDateFilterId}
          graphType={graphType}     onGraphTypeChange={setGraphType}
          stacked={stacked}         onStackedToggle={() => setStacked(s => !s)}
          sortOrder={sortOrder}     onSortChange={setSortOrder}
        />

        {/* Explicit height — flex: 1 doesn't propagate through min-h-screen on the root */}
        <div style={{ padding: '0 16px 16px', height: 'calc(100vh - 156px)' }}>
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
                <Pie data={pieDisplayRows} dataKey="value" nameKey="key" cx="45%" outerRadius="80%" innerRadius={0} isAnimationActive={false} labelLine={false}>
                  {pieDisplayRows.map((d, i) => (
                    <Cell key={d.key} fill={colorFor(groupBy, d.key, i)} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </main>
    </>
  )
}
