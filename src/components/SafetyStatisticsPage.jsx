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

const FONT = "'Segoe UI', sans-serif"

// ── Mock data (one record per metric) ─────────────────────────────────────────

// Colors used across the prototype for the three work centers — kept for the
// multi-line Incident Count chart and any work-center-keyed bar/pie.
const WORK_CENTER_COLORS = {
  'Carpentry Workshop': '#7FBFEF',
  'Paint':              '#EF6A82',
  'Assembly':           '#5DD3B0',
}

// Varied palette for metrics whose keys aren't work centers (job titles,
// time-of-day buckets, injury types, …).
const PALETTE = [
  '#7FBFEF', '#EF6A82', '#5DD3B0', '#FBB945', '#B79CDF',
  '#F5946D', '#E26370', '#7AC7F1', '#9BE3C1', '#B5D49D',
]
const pal = i => PALETTE[i % PALETTE.length]

// Original time-series (used by the Incident Count metric in line mode so
// each work center keeps its own line over the last 5 weeks).
const INCIDENT_OVER_TIME = [
  { key: '19 - 25 Apr',    'Carpentry Workshop': 5, 'Paint': 2, 'Assembly': 8 },
  { key: '26 Apr - 2 May', 'Carpentry Workshop': 0, 'Paint': 2, 'Assembly': 7 },
  { key: '3 - 9 May',      'Carpentry Workshop': 2, 'Paint': 1, 'Assembly': 0 },
  { key: '10 - 16 May',    'Carpentry Workshop': 2, 'Paint': 0, 'Assembly': 4 },
  { key: '17 - 23 May',    'Carpentry Workshop': 1, 'Paint': 1, 'Assembly': 10 },
]

const workCenterItems = [
  { key: 'Carpentry Workshop', value: 6,  color: WORK_CENTER_COLORS['Carpentry Workshop'] },
  { key: 'Paint',              value: 10, color: WORK_CENTER_COLORS['Paint'] },
  { key: 'Assembly',           value: 3,  color: WORK_CENTER_COLORS['Assembly'] },
]

// Each metric carries everything needed to render bar / pie / line.
//   - items: aggregated rows used by bar + pie (and the fallback single-line)
//   - multiLine: optional; if present, line mode draws one series per entry
//     over the supplied time-series data (used for Incident Count).
//   - unit: optional suffix shown in the tooltip value (e.g. " days").
const METRICS_DATA = {
  'incident-count': {
    label: 'Incident Count',
    items: workCenterItems,
    multiLine: {
      data: INCIDENT_OVER_TIME,
      xKey: 'key',
      series: [
        { name: 'Carpentry Workshop', color: WORK_CENTER_COLORS['Carpentry Workshop'] },
        { name: 'Paint',              color: WORK_CENTER_COLORS['Paint'] },
        { name: 'Assembly',           color: WORK_CENTER_COLORS['Assembly'] },
      ],
    },
  },
  'incident-per-type': {
    label: 'Incident Per Type',
    items: workCenterItems,
  },
  'incident-rate': {
    label: 'Incident Rate',
    items: workCenterItems,
  },
  'recurrence-by-location': {
    label: 'Recurrence by Location',
    items: [
      { key: 'Warehouse 1', value: 8,  color: pal(0) },
      { key: 'Warehouse 2', value: 14, color: pal(1) },
      { key: 'Warehouse 3', value: 3,  color: pal(2) },
    ],
  },
  'recurrence-by-work-center': {
    label: 'Recurrence by Work Center',
    items: [
      { key: 'Carpentry Workshop', value: 12, color: WORK_CENTER_COLORS['Carpentry Workshop'] },
      { key: 'Paint',              value: 9,  color: WORK_CENTER_COLORS['Paint'] },
      { key: 'Assembly',           value: 4,  color: WORK_CENTER_COLORS['Assembly'] },
    ],
  },
  'recurring-trend': {
    label: 'Recurring Trend',
    items: [
      { key: 'Dec', value: 3, color: pal(0) },
      { key: 'Jan', value: 5, color: pal(0) },
      { key: 'Feb', value: 4, color: pal(0) },
      { key: 'Mar', value: 7, color: pal(0) },
      { key: 'Apr', value: 6, color: pal(0) },
      { key: 'May', value: 8, color: pal(0) },
    ],
  },
  'report-to-resolution-gap': {
    label: 'Report-to-Resolution Gap',
    unit: ' days',
    items: [
      { key: 'Carpentry Workshop', value: 4.2, color: WORK_CENTER_COLORS['Carpentry Workshop'] },
      { key: 'Paint',              value: 2.8, color: WORK_CENTER_COLORS['Paint'] },
      { key: 'Assembly',           value: 1.1, color: WORK_CENTER_COLORS['Assembly'] },
    ],
  },
  'by-job-title': {
    label: 'By Job Title',
    items: [
      { key: 'Machine Operator',  value: 9, color: pal(0) },
      { key: 'Warehouse Worker',  value: 7, color: pal(1) },
      { key: 'Shift Supervisor',  value: 2, color: pal(2) },
      { key: 'Maintenance Tech',  value: 4, color: pal(3) },
      { key: 'Quality Inspector', value: 1, color: pal(4) },
    ],
  },
  'by-time-of-day': {
    label: 'By Time of Day',
    items: [
      { key: 'Morning (6-12)',    value: 10, color: pal(0) },
      { key: 'Afternoon (12-18)', value: 8,  color: pal(1) },
      { key: 'Evening (18-24)',  value: 5,  color: pal(2) },
      { key: 'Night (0-6)',      value: 2,  color: pal(3) },
    ],
  },
  'by-injury-type': {
    label: 'By Injury Type',
    items: [
      { key: 'Overexertion',          value: 6, color: pal(0) },
      { key: 'Falls (same level)',    value: 4, color: pal(1) },
      { key: 'Struck by object',      value: 5, color: pal(2) },
      { key: 'Falls to lower level',  value: 2, color: pal(3) },
      { key: 'Other exertions',       value: 3, color: pal(4) },
      { key: 'Slip/trip (no fall)',   value: 2, color: pal(5) },
      { key: 'Caught in equipment',   value: 1, color: pal(6) },
      { key: 'Repetitive motions',    value: 1, color: pal(7) },
      { key: 'Struck against',        value: 1, color: pal(8) },
      { key: 'Roadway',               value: 0, color: pal(9) },
    ],
  },
}

const METRICS = Object.entries(METRICS_DATA).map(([id, def]) => ({ id, label: def.label }))

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
      <Button
        variant="purple"
        active={open}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', height: 32,
          fontFamily: FONT, fontWeight: 600, fontSize: 13.5,
          whiteSpace: 'nowrap',
        }}
      >
        {current.label}
        <Icon char={open ? '' : ''} size={11} />
      </Button>

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

const iconBtn = { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }

// ── Stats toolbar ─────────────────────────────────────────────────────────────

function StatsToolbar({
  metric, onMetricChange,
  graphType, onGraphTypeChange,
  sortOrder, onSortChange,
  filteredCenter, onClearFilter,
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

      <ButtonGroup gap={3} style={{ marginLeft: 4 }}>
        <Button active={graphType === 'bar'}  onClick={() => onGraphTypeChange('bar')}  title="Bar chart"  style={iconBtn}><Icon char={''} size={14} /></Button>
        <Button active={graphType === 'line'} onClick={() => onGraphTypeChange('line')} title="Line chart" style={iconBtn}><Icon char={''} size={14} /></Button>
        <Button active={graphType === 'pie'}  onClick={() => onGraphTypeChange('pie')}  title="Pie chart"  style={iconBtn}><Icon char={''} size={14} /></Button>
      </ButtonGroup>

      {/* Sort makes no visual difference on a pie — hide there. */}
      {graphType !== 'pie' && (
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

// ── Chart renderers ───────────────────────────────────────────────────────────

const tooltipContentStyle = {
  background: '#262A36',
  border: '1px solid #3C3E4A',
  borderRadius: 4,
  padding: '8px 12px',
  fontFamily: FONT,
  fontSize: 12.5,
  color: '#F5F5F6',
  boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
}
const tooltipLabelStyle = {
  color: '#F5F5F6',
  fontFamily: FONT,
  fontWeight: 700,
  fontSize: 12.5,
  marginBottom: 4,
}
const tooltipItemStyle = {
  color: '#F5F5F6',
  fontFamily: FONT,
  fontSize: 12.5,
  padding: 0,
}
// Pin the tooltip to the top of the chart area (y: 0). The x value 0
// keeps it from sliding off-screen at the right edge — recharts clamps
// it within the chart bounds when needed.
const tooltipFixedPosition = { y: 0 }

// Chart bodies. These return the chart's *contents* (axes, series, etc.) —
// callers wrap them in BarChart/LineChart/PieChart so ResponsiveContainer can
// inject width/height onto the chart element directly via cloneElement.

const barChartChildren = (items) => (
  <>
    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
    <XAxis
      dataKey="key"
      tick={{ fill: '#A0A4AF', fontSize: 12, fontFamily: FONT }}
      axisLine={false} tickLine={false} tickMargin={12}
      interval={0}
    />
    <YAxis
      tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }}
      axisLine={false} tickLine={false}
    />
    <Tooltip
      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
      contentStyle={tooltipContentStyle}
      labelStyle={tooltipLabelStyle}
      itemStyle={tooltipItemStyle}
      position={tooltipFixedPosition}
    />
    <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
      {items.map(d => <Cell key={d.key} fill={d.color} />)}
    </Bar>
  </>
)

// Line mode — two branches:
//   * If multiLine is set on the metric (Incident Count), draw one line per
//     series over the time-series data. Clicking a line filters down to just
//     that series.
//   * Otherwise (single-series metrics like By Job Title or Recurring Trend),
//     plot one line connecting the metric's items; no click-to-isolate.
const lineChartChildren = (current, items, filteredCenter, onLineClick) => {
  if (current.multiLine) {
    const { xKey, series } = current.multiLine
    return (
      <>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }}
          axisLine={false} tickLine={false} tickMargin={12}
        />
        <YAxis
          tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }}
          axisLine={false} tickLine={false} allowDecimals={false}
        />
        <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} position={tooltipFixedPosition} />
        <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 13, paddingTop: 8, color: '#F5F5F6' }} iconType="rect" />
        {series
          .filter(s => !filteredCenter || filteredCenter === s.name)
          .map(s => (
            <Line
              key={s.name}
              type="linear"
              dataKey={s.name}
              stroke={s.color}
              strokeWidth={filteredCenter === s.name ? 2.8 : 2.2}
              dot={{ r: 4, fill: s.color, strokeWidth: 0, style: { cursor: 'pointer' } }}
              activeDot={{ r: 5, fill: s.color, strokeWidth: 0, style: { cursor: 'pointer' } }}
              isAnimationActive={false}
              onClick={() => onLineClick(s.name)}
              style={{ cursor: 'pointer' }}
            />
          ))}
      </>
    )
  }

  // Single-series line for aggregated metrics
  const stroke = items[0]?.color || PALETTE[0]
  return (
    <>
      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
      <XAxis
        dataKey="key"
        tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }}
        axisLine={false} tickLine={false} tickMargin={12}
        interval={0}
      />
      <YAxis
        tick={{ fill: '#626363', fontSize: 12, fontFamily: FONT }}
        axisLine={false} tickLine={false}
      />
      <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} position={tooltipFixedPosition} />
      <Line
        type="linear"
        dataKey="value"
        stroke={stroke}
        strokeWidth={2.4}
        dot={{ r: 4, fill: stroke, strokeWidth: 0 }}
        activeDot={{ r: 5, fill: stroke, strokeWidth: 0 }}
        isAnimationActive={false}
      />
    </>
  )
}

const pieChartChildren = (items) => (
  <>
    <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} position={tooltipFixedPosition} />
    <Legend
      layout="vertical" verticalAlign="top" align="right"
      wrapperStyle={{ fontFamily: FONT, fontSize: 13, color: '#F5F5F6' }}
      iconType="rect"
    />
    <Pie
      data={items}
      dataKey="value"
      nameKey="key"
      cx="45%"
      outerRadius="80%"
      innerRadius={0}
      isAnimationActive={false}
      labelLine={false}
    >
      {items.map(d => <Cell key={d.key} fill={d.color} />)}
    </Pie>
  </>
)

// ── Page sub-header (matches Overview sub-header layout) ──────────────────────

function StatsSubHeader({ filteredCenter, onClearFilter }) {
  return (
    <div
      className="flex items-center h-10"
      style={{ background: '#262A36', borderBottom: '1px solid #3C3E4A' }}
    >
      {/* Left: title (flex 1) so the centered search stays geometrically centered */}
      <div style={{ flex: 1, padding: '0 16px', display: 'flex', alignItems: 'center' }}>
        <span style={{
          fontFamily: FONT, fontWeight: 400, fontSize: 16.51, color: '#F5F5F6',
        }}>
          Work Centers Overview
        </span>
      </div>

      {/* Center: search bar (with inline filter chip when active) */}
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
              title="Clear filter"
              aria-label="Clear filter"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 0, marginLeft: 2,
                color: '#D7B3D3',
                display: 'inline-flex', alignItems: 'center', lineHeight: 1,
                fontSize: 14,
              }}
            >
              ×
            </button>
          </div>
        )}
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#626363', flex: 1 }}>Search...</span>
        <Icon char={''} size={11} color="#626363" />
      </div>

      {/* Right: view-switcher icons + Report Incident shortcut (flex 1) */}
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

export default function SafetyStatisticsPage({ initialParams = null }) {
  const [metric, setMetric]       = useState('incident-count')
  const [graphType, setGraphType] = useState(initialParams?.initialGraphType ?? 'bar')
  const [sortOrder, setSortOrder] = useState(null)
  // Filter keyed by item-name (e.g. 'Paint'). Click a line in line mode to
  // isolate, or arrive here from the Overview work-center chart icon.
  const [filteredCenter, setFilteredCenter] = useState(initialParams?.initialFilter ?? null)

  // Switching metrics invalidates the filter (different item-keys).
  useEffect(() => { setFilteredCenter(null) }, [metric])

  const current = METRICS_DATA[metric] ?? METRICS_DATA['incident-count']

  const items = (() => {
    let arr = [...current.items]
    if (filteredCenter) arr = arr.filter(d => d.key === filteredCenter)
    if (sortOrder === 'desc') arr.sort((a, b) => b.value - a.value)
    if (sortOrder === 'asc')  arr.sort((a, b) => a.value - b.value)
    return arr
  })()

  return (
    <>
      <StatsSubHeader filteredCenter={filteredCenter} onClearFilter={() => setFilteredCenter(null)} />
      <main className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
        <StatsToolbar
          metric={metric}
          onMetricChange={setMetric}
          graphType={graphType}
          onGraphTypeChange={setGraphType}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          filteredCenter={filteredCenter}
          onClearFilter={() => setFilteredCenter(null)}
        />

        {/* Explicit height — `flex: 1` doesn't propagate through min-h-screen on the root */}
        <div style={{ padding: '0 16px 16px', height: 'calc(100vh - 156px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            {graphType === 'bar' ? (
              <BarChart data={items} margin={{ top: 20, right: 24, left: 8, bottom: 32 }}>
                {barChartChildren(items)}
              </BarChart>
            ) : graphType === 'line' ? (
              <LineChart
                data={current.multiLine ? current.multiLine.data : items}
                margin={{ top: 20, right: 32, left: 8, bottom: 24 }}
              >
                {lineChartChildren(current, items, filteredCenter, (name) =>
                  setFilteredCenter(filteredCenter === name ? null : name)
                )}
              </LineChart>
            ) : (
              <PieChart>
                {pieChartChildren(items)}
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </main>
    </>
  )
}
