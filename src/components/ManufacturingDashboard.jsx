import React, { useState } from 'react'
import {
  LineChart,
  Line,
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
    statusCount: 3,
    oee: 100,
    data: carpentryData,
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
    statusCount: 1,
    oee: 100,
    data: paintData,
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
    statusCount: null,
    oee: 100,
    data: assemblyData,
  },
]

// ── Logo ──────────────────────────────────────────────────────────────────────

function OdooLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="0"  y="0"  width="10" height="10" rx="2.5" fill="#F47920" />
      <rect x="12" y="0"  width="10" height="10" rx="2.5" fill="#00B0D7" />
      <rect x="0"  y="12" width="10" height="10" rx="2.5" fill="#71C73E" />
      <rect x="12" y="12" width="10" height="10" rx="2.5" fill="#875A7B" />
    </svg>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusDot({ blocked }) {
  if (blocked) {
    return (
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#B83232',
          border: '1.5px solid #C45A5A',
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
        border: '2px solid #51545D',
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
      className="flex items-center justify-center gap-1 whitespace-nowrap"
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
        color: '#0A0A0A',
      }}
    >
      <span style={{ fontSize: 9 }}>{center.incidentArrow}</span>
      {center.incidents} Open incident{center.incidents !== 1 ? 's' : ''}
    </span>
  )
}

// Icon button style shared by monitor + chart buttons
const iconBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  background: '#3C3E4A',
  borderRadius: '0 3.78px 3.78px 0',
  color: '#A0A4AF',
  border: 'none',
  cursor: 'pointer',
  transition: 'filter 0.15s',
}

function WorkOrderButtons() {
  return (
    <div className="flex items-center" style={{ gap: 3 }}>
      {/* WORK ORDERS — left-rounded only */}
      <button
        className="px-3 text-white transition-colors hover:brightness-110"
        style={{
          background: '#6B3E66',
          borderRadius: '3.78px 0 0 3.78px',
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: 600,
          fontSize: 14.5,
          height: 32,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        WORK ORDERS
      </button>

      {/* Monitor — right-rounded */}
      <button style={iconBtnStyle} className="hover:brightness-125">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </button>

      {/* Chart — right-rounded */}
      <button style={iconBtnStyle} className="hover:brightness-125">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        style={{ background: '#262A36', borderColor: '#3C3E4A', color: '#aaa' }}
      >
        <p style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 600, color: '#F5F5F6' }}>{label}</p>
        <p>Orders: <span style={{ color: '#F5F5F6', fontWeight: 700 }}>{payload[0].value}</span></p>
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
        border: `0.63px solid #3C3E4A`,
        borderRadius: 0,
        boxShadow: hovered ? '0 0 0 1px rgba(255,255,255,0.08)' : 'none',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left accent line — no border-radius since card has none */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 2.5,
          background: center.accentColor,
        }}
      />

      {/* Card header row */}
      <div className="flex items-center justify-between pl-5 pr-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <StatusDot blocked={center.blocked} />
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 600,
              fontSize: 17.03,
              color: '#F5F5F6',
            }}
          >
            {center.name}
          </span>
        </div>
        <IncidentBadge center={center} />
      </div>

      {/* Stats row */}
      <div className="flex items-center pl-5 pr-4 pb-3 gap-6">
        <WorkOrderButtons />

        {/* Status label + OEE label stacked */}
        <div className="flex flex-col" style={{ gap: 2 }}>
          {center.statusLabel && (
            <span
              style={{
                fontFamily: "'Segoe UI', sans-serif",
                fontWeight: 400,
                fontSize: 15.14,
                color: '#1AD3BB',
                lineHeight: 1.2,
              }}
            >
              {center.statusLabel}
            </span>
          )}
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 400,
              fontSize: 15.14,
              color: '#1AD3BB',
              lineHeight: 1.2,
            }}
          >
            OEE
          </span>
        </div>

        {/* Count + OEE value stacked */}
        <div className="flex flex-col items-end" style={{ gap: 2 }}>
          {center.statusCount !== null && (
            <span
              style={{
                fontFamily: "'Segoe UI', sans-serif",
                fontWeight: 400,
                fontSize: 15.14,
                color: '#F5F5F6',
                lineHeight: 1.2,
              }}
            >
              {center.statusCount}
            </span>
          )}
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 700,
              fontSize: 15.14,
              color: '#1DC959',
              lineHeight: 1.2,
            }}
          >
            {center.oee}%
          </span>
        </div>
      </div>

      {/* Timeline chart: purple line first (behind), accent color line on top */}
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={center.data} margin={{ top: 4, right: 16, left: -28, bottom: 2 }}>
            <XAxis
              dataKey="week"
              tick={{ fill: '#626363', fontSize: 12, fontFamily: 'Arial, sans-serif' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="This Week" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />

            {/* Purple base line — rendered first, sits behind */}
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6B3E66"
              strokeWidth={3}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* Work center accent color line — rendered second, sits in front */}
            <Line
              type="monotone"
              dataKey="orders"
              stroke={center.accentColor}
              strokeWidth={1.5}
              dot={{ r: 3, fill: center.accentColor, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: center.accentColor, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
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
      className="flex items-center px-4 h-12 gap-1"
      style={{
        background: '#262A36',
        borderBottom: '1px solid #3C3E4A',
      }}
    >
      {/* Odoo logo + app name */}
      <div className="flex items-center gap-2 mr-5">
        <OdooLogo size={22} />
        <span
          style={{
            fontFamily: "'Segoe UI', sans-serif",
            fontWeight: 600,
            fontSize: 17.15,
            color: '#F5F5F6',
          }}
        >
          Manufacturing
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex items-center gap-0.5">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className="px-3 py-1.5 rounded transition-colors"
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 400,
              fontSize: 14.55,
              color: active === item ? '#1AD3BB' : '#F5F5F6',
              border: active === item ? '1px solid rgba(26,211,187,0.4)' : '1px solid transparent',
              background: active === item ? 'rgba(26,211,187,0.05)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* AI icon */}
        <button className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: '#F5F5F6' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a1 1 0 011 1v2a1 1 0 01-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l1.41 1.42a1 1 0 01-1.42 1.41L4.22 5.64a1 1 0 010-1.42zm12.73 12.73a1 1 0 011.41 0l1.42 1.42a1 1 0 01-1.42 1.41l-1.41-1.41a1 1 0 010-1.42zM2 12a1 1 0 011-1h2a1 1 0 010 2H3a1 1 0 01-1-1zm16 0a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1zM4.22 19.78a1 1 0 010-1.42l1.42-1.41a1 1 0 011.41 1.42L5.64 19.78a1 1 0 01-1.42 0zm12.73-12.73a1 1 0 010-1.42l1.41-1.42a1 1 0 011.42 1.42l-1.42 1.41a1 1 0 01-1.41 0zM12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>
        {/* Bell */}
        <button className="p-1.5 rounded hover:bg-white/5 transition-colors relative" style={{ color: '#F5F5F6' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {/* Clock */}
        <button className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: '#F5F5F6' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </button>
        {/* Settings */}
        <button className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: '#F5F5F6' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
          </svg>
        </button>
        {/* Separator */}
        <span style={{ width: 1, height: 20, background: '#3C3E4A', display: 'inline-block' }} />
        {/* User name */}
        <span style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: 14.55, color: '#F5F5F6' }}>
          ProductDesign
        </span>
        {/* Avatar */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#875A7B',
            fontFamily: "'Segoe UI', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: '#F5F5F6',
          }}
        >
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
      className="flex items-center px-4 h-10 gap-3"
      style={{
        background: '#262A36',
        borderBottom: '1px solid #3C3E4A',
      }}
    >
      <span
        style={{
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: 400,
          fontSize: 16.51,
          color: '#F5F5F6',
        }}
      >
        Work Centers Overview
      </span>
      <div className="flex-1" />

      {/* Search bar */}
      <div
        className="flex items-center gap-2 px-3 py-1 border"
        style={{
          background: '#1B1D26',
          borderColor: '#3C3E4A',
          borderRadius: 4,
          minWidth: 280,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#626363" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#626363', flex: 1 }}>
          Search...
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#626363" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1" style={{ color: '#F5F5F6', fontSize: 13, fontFamily: "'Segoe UI', sans-serif" }}>
        <span>1-3 / 3</span>
        <button className="p-0.5 opacity-40" disabled style={{ color: '#F5F5F6' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button className="p-0.5 opacity-40" disabled style={{ color: '#F5F5F6' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Report Incident */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 transition-colors hover:brightness-110"
        style={{
          background: '#B83232',
          borderRadius: 4,
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          color: '#F5F5F6',
          border: 'none',
          cursor: 'pointer',
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
