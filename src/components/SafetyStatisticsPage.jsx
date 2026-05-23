import React, { useState, useEffect, useRef } from 'react'
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts'
import Icon from './Icon'

const FONT = "'Segoe UI', sans-serif"

// ── Mock data (will be replaced by real metrics later) ────────────────────────

const WORK_CENTER_COLORS = {
  'Carpentry Workshop': '#7FBFEF',
  'Paint':              '#EF6A82',
  'Assembly':           '#5DD3B0',
}

// Aggregated per work center (used by Bar + Pie modes)
const INCIDENT_COUNTS = [
  { center: 'Carpentry Workshop', count: 6 },
  { center: 'Paint',              count: 10 },
  { center: 'Assembly',           count: 3 },
]

// Time-series (used by Line mode)
const INCIDENT_OVER_TIME = [
  { week: '19 - 25 Apr',    'Carpentry Workshop': 5, 'Paint': 2, 'Assembly': 8 },
  { week: '26 Apr - 2 May', 'Carpentry Workshop': 0, 'Paint': 2, 'Assembly': 7 },
  { week: '3 - 9 May',      'Carpentry Workshop': 2, 'Paint': 1, 'Assembly': 0 },
  { week: '10 - 16 May',    'Carpentry Workshop': 2, 'Paint': 0, 'Assembly': 4 },
  { week: '17 - 23 May',    'Carpentry Workshop': 1, 'Paint': 1, 'Assembly': 10 },
]

const METRICS = [
  { id: 'incident-count',    label: 'Incident Count'    },
  { id: 'incident-per-type', label: 'Incident Per Type' },
  { id: 'incident-rate',     label: 'Incident Rate'     },
]

// ── Metric dropdown (purple, matches WORK ORDERS button style) ────────────────

function MetricDropdown({ metric, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = METRICS.find(m => m.id === metric) ?? METRICS[0]

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
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#6B3E66', border: 'none', borderRadius: 4,
          padding: '7px 14px', height: 32,
          cursor: 'pointer',
          fontFamily: FONT, fontWeight: 600, fontSize: 13.5,
          color: '#F5F5F6', whiteSpace: 'nowrap',
          transition: 'filter 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
        onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
      >
        {current.label}
        <Icon char={open ? '' : ''} size={11} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            background: '#2A2E3A',
            border: '1px solid #3C3E4A',
            borderRadius: 4,
            minWidth: 220,
            padding: '4px 0',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
          }}
        >
          {METRICS.map(m => {
            const isSelected = m.id === metric
            return (
              <button
                key={m.id}
                onClick={() => { onChange(m.id); setOpen(false) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: isSelected ? 'rgba(26,211,187,0.07)' : 'transparent',
                  color: isSelected ? '#1AD3BB' : '#F5F5F6',
                  border: 'none', cursor: 'pointer',
                  padding: '8px 14px',
                  fontFamily: FONT, fontSize: 13.5,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Small icon button (toolbar) ───────────────────────────────────────────────

function ToolbarButton({ char, active, onClick, title }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 32, height: 32,
        background: active
          ? 'rgba(26,211,187,0.07)'
          : hovered ? '#4A4D58' : '#3C3E4A',
        border: active ? '1px solid rgba(26,211,187,0.45)' : '1px solid transparent',
        borderRadius: 4, cursor: 'pointer',
        color: active ? '#1AD3BB' : '#A0A4AF',
        transition: 'all 0.12s',
      }}
    >
      <Icon char={char} size={14} />
    </button>
  )
}

// ── Stats toolbar ─────────────────────────────────────────────────────────────

function StatsToolbar({
  metric, onMetricChange,
  graphType, onGraphTypeChange,
  sortOrder, onSortChange,
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        padding: '14px 16px',
        gap: 10,
      }}
    >
      <MetricDropdown metric={metric} onChange={onMetricChange} />

      <div style={{ display: 'flex', gap: 3, marginLeft: 4 }}>
        <ToolbarButton char={''} active={graphType === 'bar'}  onClick={() => onGraphTypeChange('bar')}  title="Bar chart"  />
        <ToolbarButton char={''} active={graphType === 'line'} onClick={() => onGraphTypeChange('line')} title="Line chart" />
        <ToolbarButton char={''} active={graphType === 'pie'}  onClick={() => onGraphTypeChange('pie')}  title="Pie chart"  />
      </div>

      <div style={{ display: 'flex', gap: 3 }}>
        <ToolbarButton
          char={''}
          active={sortOrder === 'desc'}
          onClick={() => onSortChange(sortOrder === 'desc' ? null : 'desc')}
          title="Sort descending"
        />
        <ToolbarButton
          char={''}
          active={sortOrder === 'asc'}
          onClick={() => onSortChange(sortOrder === 'asc' ? null : 'asc')}
          title="Sort ascending"
        />
      </div>
    </div>
  )
}

// ── Chart renderers ───────────────────────────────────────────────────────────

const tooltipStyle = {
  background: '#262A36',
  border: '1px solid #3C3E4A',
  borderRadius: 4,
  fontFamily: FONT,
  fontSize: 12.5,
}

// Chart bodies. These return the chart's *contents* (axes, series, etc.) —
// callers wrap them in BarChart/LineChart/PieChart so ResponsiveContainer can
// inject width/height onto the chart element directly via cloneElement.
const barChartChildren = (data) => (
  <>
    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
    <XAxis
      dataKey="center"
      tick={{ fill: '#A0A4AF', fontSize: 12, fontFamily: FONT }}
      axisLine={false} tickLine={false} tickMargin={12}
    />
    <YAxis
      tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }}
      axisLine={false} tickLine={false} allowDecimals={false}
    />
    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={tooltipStyle} />
    <Bar dataKey="count" radius={[2, 2, 0, 0]} isAnimationActive={false}>
      {data.map(d => <Cell key={d.center} fill={WORK_CENTER_COLORS[d.center]} />)}
    </Bar>
  </>
)

const lineChartChildren = (
  <>
    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
    <XAxis
      dataKey="week"
      tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }}
      axisLine={false} tickLine={false} tickMargin={12}
    />
    <YAxis
      tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }}
      axisLine={false} tickLine={false} allowDecimals={false}
    />
    <Tooltip contentStyle={tooltipStyle} />
    <Legend
      wrapperStyle={{ fontFamily: FONT, fontSize: 13, paddingTop: 8, color: '#F5F5F6' }}
      iconType="rect"
    />
    {Object.entries(WORK_CENTER_COLORS).map(([center, color]) => (
      <Line
        key={center}
        type="linear"
        dataKey={center}
        stroke={color}
        strokeWidth={2.2}
        dot={{ r: 4, fill: color, strokeWidth: 0 }}
        activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
        isAnimationActive={false}
      />
    ))}
  </>
)

const pieChartChildren = (data) => (
  <>
    <Tooltip contentStyle={tooltipStyle} />
    <Legend
      layout="vertical" verticalAlign="top" align="right"
      wrapperStyle={{ fontFamily: FONT, fontSize: 13, color: '#F5F5F6' }}
      iconType="rect"
    />
    <Pie
      data={data}
      dataKey="count"
      nameKey="center"
      cx="45%"
      outerRadius="80%"
      innerRadius={0}
      isAnimationActive={false}
      labelLine={false}
    >
      {data.map(d => <Cell key={d.center} fill={WORK_CENTER_COLORS[d.center]} />)}
    </Pie>
  </>
)

// ── Page sub-header (matches Overview sub-header layout) ──────────────────────

function StatsSubHeader() {
  return (
    <div
      className="flex items-center px-4 h-10 gap-3"
      style={{ background: '#262A36', borderBottom: '1px solid #3C3E4A' }}
    >
      <span style={{
        fontFamily: FONT, fontWeight: 400, fontSize: 16.51, color: '#F5F5F6',
      }}>
        Work Centers Overview
      </span>
      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1 border"
        style={{ background: '#1B1D26', borderColor: '#3C3E4A', borderRadius: 4, minWidth: 280 }}>
        <Icon char={''} size={13} color="#626363" />
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#626363', flex: 1 }}>Search...</span>
        <Icon char={''} size={11} color="#626363" />
      </div>

      {/* View-switcher icons (placeholders — codes to be supplied later) */}
      <div className="flex items-center gap-1" style={{ color: '#A0A4AF' }}>
        {[
          { label: 'Graph view',  path: <><rect x="3" y="11" width="4" height="8" rx="1" /><rect x="10" y="6" width="4" height="13" rx="1" /><rect x="17" y="9" width="4" height="10" rx="1" /></> },
          { label: 'Pivot view',  path: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></> },
          { label: 'List view',   path: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" /></> },
        ].map(v => (
          <button
            key={v.label}
            title={v.label}
            style={{
              width: 32, height: 32, background: 'transparent', border: '1px solid #3C3E4A',
              borderRadius: 4, color: '#A0A4AF', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {v.path}
            </svg>
          </button>
        ))}

        {/* Report Incident shortcut */}
        <button
          title="Report Incident"
          style={{
            width: 32, height: 32, background: '#B83232', border: 'none',
            borderRadius: 4, color: '#F5F5F6', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: 4,
          }}
        >
          <Icon char={''} size={13} />
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SafetyStatisticsPage() {
  const [metric, setMetric]       = useState('incident-count')
  const [graphType, setGraphType] = useState('bar')
  const [sortOrder, setSortOrder] = useState(null)

  // Sorting only applies to per-center aggregated data (bar + pie).
  // Line mode is time-series so sort is ignored.
  const aggregated = (() => {
    const arr = [...INCIDENT_COUNTS]
    if (sortOrder === 'desc') arr.sort((a, b) => b.count - a.count)
    if (sortOrder === 'asc')  arr.sort((a, b) => a.count - b.count)
    return arr
  })()

  return (
    <>
      <StatsSubHeader />
      <main className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
        <StatsToolbar
          metric={metric}
          onMetricChange={setMetric}
          graphType={graphType}
          onGraphTypeChange={setGraphType}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {/* Explicit height — `flex: 1` doesn't propagate through min-h-screen on the root */}
        <div style={{ padding: '0 16px 16px', height: 'calc(100vh - 156px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            {graphType === 'bar' ? (
              <BarChart data={aggregated} margin={{ top: 20, right: 24, left: 8, bottom: 32 }}>
                {barChartChildren(aggregated)}
              </BarChart>
            ) : graphType === 'line' ? (
              <LineChart data={INCIDENT_OVER_TIME} margin={{ top: 20, right: 32, left: 8, bottom: 24 }}>
                {lineChartChildren}
              </LineChart>
            ) : (
              <PieChart>
                {pieChartChildren(aggregated)}
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </main>
    </>
  )
}
