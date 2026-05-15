import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

// ── Data ──────────────────────────────────────────────────────────────────────

const timelineWeeks = ['19-25 Apr', 'This Week', '3-9 May', '10-16 May', '17-23 May']

const carpentryData = [
  { week: '19-25 Apr', orders: 2 },
  { week: 'This Week', orders: 5 },
  { week: '3-9 May',   orders: 3 },
  { week: '10-16 May', orders: 4 },
  { week: '17-23 May', orders: 1 },
]

const paintData = [
  { week: '19-25 Apr', orders: 1 },
  { week: 'This Week', orders: 3 },
  { week: '3-9 May',   orders: 4 },
  { week: '10-16 May', orders: 2 },
  { week: '17-23 May', orders: 3 },
]

const assemblyData = [
  { week: '19-25 Apr', orders: 3 },
  { week: 'This Week', orders: 2 },
  { week: '3-9 May',   orders: 1 },
  { week: '10-16 May', orders: 3 },
  { week: '17-23 May', orders: 2 },
]

const workCenters = [
  {
    id: 'carpentry',
    name: 'Carpentry Workshop',
    statusColor: '#ef4444',
    indicatorColor: '#ef4444',
    incidents: 3,
    incidentLevel: 'critical',
    incidentBadgeColor: 'bg-red-600',
    incidentArrow: '▼',
    statusLabel: 'Late',
    statusLabelColor: 'text-red-400',
    oee: 100,
    data: carpentryData,
    chartColor: '#f43f5e',
    chartFill: 'rgba(244,63,94,0.15)',
  },
  {
    id: 'paint',
    name: 'Paint',
    statusColor: '#f59e0b',
    indicatorColor: '#f59e0b',
    incidents: 2,
    incidentLevel: 'warning',
    incidentBadgeColor: 'bg-amber-500',
    incidentArrow: '▲',
    statusLabel: 'In Progress',
    statusLabelColor: 'text-teal-400',
    oee: 100,
    data: paintData,
    chartColor: '#f59e0b',
    chartFill: 'rgba(245,158,11,0.15)',
  },
  {
    id: 'assembly',
    name: 'Assembly',
    statusColor: '#22c55e',
    indicatorColor: '#22c55e',
    incidents: 0,
    incidentLevel: 'ok',
    incidentBadgeColor: 'bg-green-600',
    incidentArrow: '▲',
    statusLabel: null,
    statusLabelColor: '',
    oee: 100,
    data: assemblyData,
    chartColor: '#22c55e',
    chartFill: 'rgba(34,197,94,0.15)',
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function IncidentBadge({ center }) {
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold text-white ${center.incidentBadgeColor}`}
      style={{ border: `1px solid rgba(255,255,255,0.15)` }}
    >
      <span className="text-[10px]">{center.incidentArrow}</span>
      {center.incidents} Open incident{center.incidents !== 1 ? 's' : ''}
    </span>
  )
}

function OEEGauge({ value }) {
  const radius = 20
  const circ = 2 * Math.PI * radius
  const offset = circ - (value / 100) * circ

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={radius} fill="none" stroke="#1e2a4a" strokeWidth="5" />
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
        />
        <text x="26" y="30" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">
          {value}%
        </text>
      </svg>
    </div>
  )
}

function WorkOrderButtons() {
  return (
    <div className="flex items-center gap-2">
      <button className="px-3 py-1.5 text-xs font-bold border border-teal-500 text-teal-400 rounded hover:bg-teal-500/10 transition-colors tracking-wide">
        WORK ORDERS
      </button>
      {/* monitor icon */}
      <button className="p-1.5 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </button>
      {/* chart icon */}
      <button className="p-1.5 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      </button>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-700 border border-white/10 rounded px-2 py-1 text-xs text-slate-300">
        <p className="font-semibold">{label}</p>
        <p>Orders: <span className="text-white font-bold">{payload[0].value}</span></p>
      </div>
    )
  }
  return null
}

function WorkCenterCard({ center }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden transition-shadow"
      style={{
        background: 'linear-gradient(180deg, #131b30 0%, #0f1628 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered ? '0 0 0 1px rgba(255,255,255,0.12)' : 'none',
        minWidth: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card header row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: center.indicatorColor, boxShadow: `0 0 6px ${center.indicatorColor}` }}
          />
          <span className="font-semibold text-slate-100 text-sm">{center.name}</span>
        </div>
        <IncidentBadge center={center} />
      </div>

      {/* Stats row */}
      <div className="flex items-center px-4 pb-3 gap-6">
        <WorkOrderButtons />

        <div className="flex items-start gap-6 ml-2">
          {center.statusLabel && (
            <div className="flex flex-col items-center">
              <span className={`text-xs font-semibold ${center.statusLabelColor}`}>
                {center.statusLabel}
              </span>
              <span className="text-[10px] text-slate-500">OEE</span>
            </div>
          )}
          {!center.statusLabel && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-teal-400 font-semibold">OEE</span>
            </div>
          )}
          <div className="flex flex-col items-center -mt-1">
            <span className="text-2xl font-bold text-teal-400 leading-none">{center.oee}%</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0' }} />

      {/* Timeline chart */}
      <div className="flex-1 pt-2 pb-1" style={{ minHeight: 90 }}>
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={center.data} margin={{ top: 8, right: 16, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${center.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={center.chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={center.chartColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="week"
              tick={{ fill: '#475569', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x="This Week"
              stroke="rgba(255,255,255,0.15)"
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke={center.chartColor}
              strokeWidth={2}
              fill={`url(#grad-${center.id})`}
              dot={{ r: 3, fill: center.chartColor, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: center.chartColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────

const navItems = ['Overview', 'Operations', 'Planning', 'Products', 'Reporting', 'Configuration']

function TopNav() {
  const [active, setActive] = useState('Reporting')

  return (
    <header
      className="flex items-center px-4 h-12 gap-1 border-b"
      style={{
        background: '#0f1628',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-6 h-6 rounded" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }} />
        <span className="text-slate-100 font-semibold text-sm">Manufacturing</span>
      </div>

      {/* Nav items */}
      <nav className="flex items-center gap-0.5">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              active === item
                ? 'text-teal-400 border border-teal-500/60 bg-teal-500/5'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right side icons */}
      <div className="ml-auto flex items-center gap-3">
        <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
          </svg>
        </button>
        <button className="px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
          ⚠ Report Incident
        </button>
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
          P
        </div>
      </div>
    </header>
  )
}

// ── Sub-header / toolbar ──────────────────────────────────────────────────────

function SubHeader() {
  return (
    <div
      className="flex items-center px-4 h-10 gap-3 border-b"
      style={{
        background: '#0d1221',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <span className="text-slate-300 text-sm font-medium">Work Centers Overview</span>
      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1 rounded border text-xs text-slate-500"
        style={{ background: '#0f1628', borderColor: 'rgba(255,255,255,0.1)', minWidth: 240 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span>Search...</span>
      </div>
      <button className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M6 12h12M10 18h4" />
        </svg>
      </button>

      {/* Pagination */}
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <span>1-3 / 3</span>
        <button className="p-0.5 hover:text-white disabled:opacity-30" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button className="p-0.5 hover:text-white disabled:opacity-30" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Report Incident button */}
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Report Incident
      </button>
    </div>
  )
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { color: '#ef4444', label: 'Critical open item' },
    { color: '#f59e0b', label: 'Needs attention' },
    { color: '#22c55e', label: 'No open safety items' },
  ]

  return (
    <div className="flex items-center gap-6 px-4 py-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="w-3 h-0.5 rounded-full inline-block"
            style={{ background: item.color }}
          />
          <span className="text-xs text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function ManufacturingDashboard() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a' }}>
      <TopNav />
      <SubHeader />

      {/* Cards grid */}
      <main className="flex-1 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {workCenters.map((center) => (
            <WorkCenterCard key={center.id} center={center} />
          ))}
        </div>
      </main>

      <Legend />
    </div>
  )
}
