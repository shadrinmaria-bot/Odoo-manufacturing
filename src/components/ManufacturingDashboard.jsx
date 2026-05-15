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
    blocked: true,
    accentColor: '#FF71A7',
    incidents: 3,
    incidentBadgeHex: '#FB5157',
    incidentArrow: '▼',
    statusLabel: 'Late',
    oee: 100,
    data: carpentryData,
    chartColor: '#FB5157',
  },
  {
    id: 'paint',
    name: 'Paint',
    blocked: false,
    accentColor: '#ADFFFE',
    incidents: 2,
    incidentBadgeHex: '#E79A21',
    incidentArrow: '▲',
    statusLabel: 'In Progress',
    oee: 100,
    data: paintData,
    chartColor: '#E79A21',
  },
  {
    id: 'assembly',
    name: 'Assembly',
    blocked: false,
    accentColor: '#7396EB',
    incidents: 0,
    incidentBadgeHex: '#3CC962',
    incidentArrow: '▲',
    statusLabel: null,
    oee: 100,
    data: assemblyData,
    chartColor: '#3CC962',
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusDot({ blocked, accentColor }) {
  if (blocked) {
    return (
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#FB5157',
          boxShadow: '0 0 6px #FB5157',
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
    )
  }
  return (
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        border: `2px solid ${accentColor}`,
        background: 'transparent',
        flexShrink: 0,
        display: 'inline-block',
      }}
    />
  )
}

function IncidentBadge({ center }) {
  return (
    <span
      className="flex items-center justify-center gap-1 whitespace-nowrap text-white"
      style={{
        background: center.incidentBadgeHex,
        height: 20,
        width: 147,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 21,
        flexShrink: 0,
        fontFamily: "'Segoe UI', sans-serif",
        fontWeight: 700,
        fontSize: 11.87,
        lineHeight: 1,
      }}
    >
      <span style={{ fontSize: 9 }}>{center.incidentArrow}</span>
      {center.incidents} Open incident{center.incidents !== 1 ? 's' : ''}
    </span>
  )
}

function WorkOrderButtons() {
  return (
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-1.5 text-white transition-colors hover:brightness-110"
        style={{
          background: '#6B3E66',
          borderRadius: '3.78px 0 0 3.78px',
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: 600,
          fontSize: 14.5,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        WORK ORDERS
      </button>
      <button className="p-1.5 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </button>
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
      <div
        className="border rounded px-2 py-1 text-xs"
        style={{ background: '#262A36', borderColor: '#3C3E4B', color: '#ccc' }}
      >
        <p style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 600 }}>{label}</p>
        <p>Orders: <span style={{ color: '#fff', fontWeight: 700 }}>{payload[0].value}</span></p>
      </div>
    )
  }
  return null
}

function WorkCenterCard({ center }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex flex-col overflow-hidden transition-all"
      style={{
        width: 623,
        height: 263,
        background: '#262A36',
        border: `0.63px solid #3C3E4B`,
        borderRadius: 8,
        boxShadow: hovered ? '0 0 0 1px rgba(255,255,255,0.1)' : 'none',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left accent line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 2.5,
          background: center.accentColor,
          borderRadius: '8px 0 0 8px',
        }}
      />

      {/* Card header row */}
      <div className="flex items-center justify-between pl-5 pr-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <StatusDot blocked={center.blocked} accentColor={center.accentColor} />
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 600,
              fontSize: 14.5,
              color: '#E2E8F0',
            }}
          >
            {center.name}
          </span>
        </div>
        <IncidentBadge center={center} />
      </div>

      {/* Stats row */}
      <div className="flex items-center pl-5 pr-4 pb-3 gap-5">
        <WorkOrderButtons />

        <div className="flex items-baseline gap-3 ml-1">
          {center.statusLabel ? (
            <span
              style={{
                fontFamily: "'Segoe UI', sans-serif",
                fontWeight: 400,
                fontSize: 15.14,
                color: '#1AD3BB',
              }}
            >
              {center.statusLabel}
            </span>
          ) : null}
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 400,
              fontSize: 15.14,
              color: '#1AD3BB',
            }}
          >
            OEE
          </span>
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 700,
              fontSize: 15.14,
              color: '#1DC959',
            }}
          >
            {center.oee}%
          </span>
        </div>
      </div>

      {/* Divider — Odoo purple */}
      <div style={{ height: 1, background: '#6B3E66', marginLeft: 5, marginRight: 0 }} />

      {/* Timeline chart */}
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={center.data} margin={{ top: 8, right: 16, left: -28, bottom: 2 }}>
            <defs>
              <linearGradient id={`grad-${center.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={center.chartColor} stopOpacity={0.28} />
                <stop offset="95%" stopColor={center.chartColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="week"
              tick={{
                fill: '#626363',
                fontSize: 12,
                fontFamily: 'Arial, sans-serif',
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x="This Week"
              stroke="rgba(255,255,255,0.12)"
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
      style={{ background: '#1B1D26', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-2 mr-4">
        <div className="w-6 h-6 rounded" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }} />
        <span
          style={{
            fontFamily: "'Segoe UI', sans-serif",
            fontWeight: 600,
            fontSize: 14.5,
            color: '#E2E8F0',
          }}
        >
          Manufacturing
        </span>
      </div>

      <nav className="flex items-center gap-0.5">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className="px-3 py-1.5 rounded transition-colors"
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: active === item ? 600 : 400,
              fontSize: 14,
              color: active === item ? '#1AD3BB' : '#94A3B8',
              border: active === item ? '1px solid rgba(26,211,187,0.4)' : '1px solid transparent',
              background: active === item ? 'rgba(26,211,187,0.05)' : 'transparent',
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
          </svg>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors hover:brightness-110"
          style={{
            background: '#FB5157',
            fontFamily: "'Segoe UI', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: '#fff',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Report Incident
        </button>
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
          P
        </div>
      </div>
    </header>
  )
}

// ── Sub-header ────────────────────────────────────────────────────────────────

function SubHeader() {
  return (
    <div
      className="flex items-center px-4 h-10 gap-3 border-b"
      style={{ background: '#1B1D26', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <span
        style={{
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: 400,
          fontSize: 14,
          color: '#CBD5E1',
        }}
      >
        Work Centers Overview
      </span>
      <div className="flex-1" />

      <div
        className="flex items-center gap-2 px-3 py-1 rounded border"
        style={{ background: '#262A36', borderColor: '#3C3E4B', minWidth: 240 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#626363" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#626363' }}>Search...</span>
      </div>

      <button className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M6 12h12M10 18h4" />
        </svg>
      </button>

      <div className="flex items-center gap-1" style={{ color: '#626363', fontSize: 12, fontFamily: 'Arial, sans-serif' }}>
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

      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors hover:brightness-110"
        style={{
          background: '#FB5157',
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          color: '#fff',
        }}
      >
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
    { color: '#FB5157', label: 'Critical open item' },
    { color: '#E79A21', label: 'Needs attention' },
    { color: '#3CC962', label: 'No open safety items' },
  ]

  return (
    <div className="flex items-center gap-6 px-4 py-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            style={{
              width: 12,
              height: 2,
              borderRadius: 9999,
              background: item.color,
              display: 'inline-block',
            }}
          />
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#626363' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function ManufacturingDashboard() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1B1D26' }}>
      <TopNav />
      <SubHeader />

      <main className="flex-1 p-4 overflow-x-auto">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {workCenters.map((center) => (
            <WorkCenterCard key={center.id} center={center} />
          ))}
        </div>
      </main>

      <Legend />
    </div>
  )
}
