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
import StatusBadge from './StatusBadge'
import SafetyIncidentModal from './SafetyIncidentModal'

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

const WORK_CENTER_DEFS = [
  {
    id: 'carpentry',
    name: 'Carpentry Workshop',
    blocked: true,
    accentColor: '#FF71A7',
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
    statusLabel: null,
    statusCount: null,
    oee: 100,
    data: assemblyData,
  },
]


// ── Odoo Logo ─────────────────────────────────────────────────────────────────

function OdooLogo({ size = 24 }) {
  return <img src="/logo.png" width={size} height={size} alt="Manufacturing logo" style={{ display: 'block' }} />
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusDot({ blocked }) {
  if (blocked) {
    return (
      <span style={{
        width: 12, height: 12, borderRadius: '50%',
        background: '#B83232', border: '1.5px solid #C45A5A',
        flexShrink: 0, display: 'inline-block',
      }} />
    )
  }
  return (
    <span style={{
      width: 12, height: 12, borderRadius: '50%',
      border: '2px solid #51545D', background: 'transparent',
      flexShrink: 0, display: 'inline-block',
    }} />
  )
}


const iconBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 32, height: 32, background: '#3C3E4A',
  borderRadius: '0 3.78px 3.78px 0', color: '#A0A4AF',
  border: 'none', cursor: 'pointer',
}

function WorkOrderButtons() {
  return (
    <div className="flex items-center" style={{ gap: 3 }}>
      <button
        className="px-3 text-white hover:brightness-110 transition-all"
        style={{
          background: '#6B3E66', borderRadius: '3.78px 0 0 3.78px',
          fontFamily: "'Segoe UI', sans-serif", fontWeight: 600,
          fontSize: 14.5, height: 32, lineHeight: 1, whiteSpace: 'nowrap',
          border: 'none', cursor: 'pointer',
        }}
      >
        WORK ORDERS
      </button>
      <button style={iconBtnStyle} className="hover:brightness-125 transition-all">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </button>
      <button style={iconBtnStyle} className="hover:brightness-125 transition-all">
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
      <div className="border rounded px-2 py-1 text-xs"
        style={{ background: '#262A36', borderColor: '#3C3E4A', color: '#aaa' }}>
        <p style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 600, color: '#F5F5F6' }}>{label}</p>
        <p>Orders: <span style={{ color: '#F5F5F6', fontWeight: 700 }}>{payload[0].value}</span></p>
      </div>
    )
  }
  return null
}

function WorkCenterCard({ center }) {
  const [hovered,    setHovered]    = useState(false)
  const [badgeOpen,  setBadgeOpen]  = useState(false)

  return (
    <div
      className="flex flex-col overflow-hidden transition-all"
      style={{
        flex: 1, minWidth: 0, height: 263,
        background: '#262A36',
        border: '0.63px solid #3C3E4A',
        borderRadius: 0,
        boxShadow: hovered ? '0 0 0 1px rgba(255,255,255,0.08)' : 'none',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Chart area — sits behind the accent line */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          zIndex: 0,
        }}
      >
        {/* Spacer matching header + stats rows height */}
        <div style={{ height: 110, flexShrink: 0 }} />
        {/* Chart */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={center.data} margin={{ top: 4, right: 16, left: -28, bottom: 2 }}>
              <XAxis
                dataKey="week"
                tick={{ fill: '#626363', fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                axisLine={false} tickLine={false}
              />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x="This Week" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#6B3E66"
                strokeWidth={1.89}
                dot={false}
                activeDot={{ r: 4, fill: '#6B3E66', strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Left accent line — z-index above chart */}
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 2.5, background: center.accentColor,
          zIndex: 2,
        }}
      />

      {/* Content layer — above chart, below accent line overlap */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 8px 20px' }}>
          <div className="flex items-center gap-2">
            <StatusDot blocked={center.blocked} />
            <span style={{
              fontFamily: "'Segoe UI', sans-serif", fontWeight: 600,
              fontSize: 17.03, color: '#F5F5F6',
            }}>
              {center.name}
            </span>
          </div>
          <StatusBadge
            label={`${center.incidents} Open incident${center.incidents !== 1 ? 's' : ''}`}
            variant={center.badgeVariant}
            isOpen={badgeOpen}
            onToggle={() => setBadgeOpen(o => !o)}
          />
        </div>

        {/* Stats row — buttons pinned left, OEE section pinned right */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 20, paddingRight: 16, paddingBottom: 12,
          }}
        >
          <WorkOrderButtons />

          {/* OEE section: label column + spacer + number column */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {/* Left: status label stacked above OEE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {center.statusLabel && (
                <span style={{
                  fontFamily: "'Segoe UI', sans-serif", fontWeight: 400,
                  fontSize: 15.14, color: '#1AD3BB', lineHeight: 1.2, whiteSpace: 'nowrap',
                }}>
                  {center.statusLabel}
                </span>
              )}
              <span style={{
                fontFamily: "'Segoe UI', sans-serif", fontWeight: 400,
                fontSize: 15.14, color: '#1AD3BB', lineHeight: 1.2,
              }}>
                OEE
              </span>
            </div>

            {/* Right: count stacked above 100% */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              {center.statusCount !== null && (
                <span style={{
                  fontFamily: "'Segoe UI', sans-serif", fontWeight: 400,
                  fontSize: 15.14, color: '#F5F5F6', lineHeight: 1.2,
                }}>
                  {center.statusCount}
                </span>
              )}
              <span style={{
                fontFamily: "'Segoe UI', sans-serif", fontWeight: 700,
                fontSize: 15.14, color: '#1DC959', lineHeight: 1.2,
              }}>
                {center.oee}%
              </span>
            </div>
          </div>
        </div>

        {/* Flex spacer so date labels sit at the bottom inside the chart */}
        <div style={{ flex: 1 }} />
      </div>
    </div>
  )
}

// ── Top-right nav icons (replicated from screenshot) ─────────────────────────

function NavIcons() {
  const GAP = 13

  return (
    <div className="flex items-center ml-auto" style={{ gap: GAP }}>
      {/* AI icon */}
      <button className="p-0 hover:opacity-80 transition-opacity" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <img src="/aiicon.png" width="18" height="18" alt="AI" style={{ display: 'block' }} />
      </button>

      {/* Discuss / chat bubble with badge */}
      <button className="p-0 hover:opacity-80 transition-opacity relative" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F5F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <span
          style={{
            position: 'absolute', top: -4, right: -6,
            background: '#e53e3e', color: '#fff',
            fontFamily: "'Segoe UI', sans-serif", fontWeight: 700, fontSize: 9,
            borderRadius: 999, minWidth: 14, height: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px', lineHeight: 1,
          }}
        >
          3
        </span>
      </button>

      {/* Clock / activity icon */}
      <button className="p-0 hover:opacity-80 transition-opacity" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F5F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </button>

      {/* Wrench + cross (settings/debug) icon */}
      <button className="p-0 hover:opacity-80 transition-opacity" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F5F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      {/* Separator */}
      <span style={{ width: 1, height: 18, background: '#3C3E4A', display: 'inline-block' }} />

      {/* User name */}
      <span style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: 14.55, color: '#F5F5F6', whiteSpace: 'nowrap' }}>
        ProductDesign
      </span>

      {/* Avatar */}
      <div
        style={{
          width: 28, height: 28, borderRadius: '50%', background: '#875A7B',
          fontFamily: "'Segoe UI', sans-serif", fontWeight: 700, fontSize: 12,
          color: '#F5F5F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        P
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
      className="flex items-center px-4 h-12"
      style={{ background: '#262A36', borderBottom: '1px solid #3C3E4A' }}
    >
      {/* Logo + app name */}
      <div className="flex items-center gap-2 mr-5">
        <OdooLogo size={22} />
        <span style={{
          fontFamily: "'Segoe UI', sans-serif", fontWeight: 600,
          fontSize: 17.15, color: '#F5F5F6',
        }}>
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
              fontFamily: "'Segoe UI', sans-serif", fontWeight: 400,
              fontSize: 14.55, color: active === item ? '#1AD3BB' : '#F5F5F6',
              border: active === item ? '1px solid rgba(26,211,187,0.4)' : '1px solid transparent',
              background: active === item ? 'rgba(26,211,187,0.05)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <NavIcons />
    </header>
  )
}

// ── Sub-header ────────────────────────────────────────────────────────────────

function SubHeader({ onOpenModal }) {
  return (
    <div
      className="flex items-center px-4 h-10 gap-3"
      style={{ background: '#262A36', borderBottom: '1px solid #3C3E4A' }}
    >
      <span style={{
        fontFamily: "'Segoe UI', sans-serif", fontWeight: 400,
        fontSize: 16.51, color: '#F5F5F6',
      }}>
        Work Centers Overview
      </span>
      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1 border"
        style={{ background: '#1B1D26', borderColor: '#3C3E4A', borderRadius: 4, minWidth: 280 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#626363" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#626363', flex: 1 }}>Search...</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#626363" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1" style={{ color: '#F5F5F6', fontSize: 13, fontFamily: "'Segoe UI', sans-serif" }}>
        <span>1-3 / 3</span>
        <button className="p-0.5 opacity-40" disabled style={{ color: '#F5F5F6' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="p-0.5 opacity-40" disabled style={{ color: '#F5F5F6' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Report Incident */}
      <button
        onClick={onOpenModal}
        className="flex items-center gap-1.5 px-3 hover:brightness-110 transition-all"
        style={{
          background: '#B83232', borderRadius: 4,
          fontFamily: "'Segoe UI', sans-serif", fontWeight: 600,
          fontSize: 13, color: '#F5F5F6', border: 'none', cursor: 'pointer',
          height: 33, whiteSpace: 'nowrap', minWidth: 158,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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

const SEVERITY_ORDER = { none: 0, attention: 1, critical: 2 }

function maxSeverity(a, b) {
  return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b
}

function severityToBadgeVariant(severity) {
  if (severity === 'critical')  return 'red'
  if (severity === 'attention') return 'orange'
  return 'grey'
}

// ── Root ──────────────────────────────────────────────────────────────────────

const INITIAL_COUNTS    = { carpentry: 3, paint: 2, assembly: 0 }
const INITIAL_SEVERITY  = { carpentry: 'critical', paint: 'attention', assembly: 'none' }

export default function ManufacturingDashboard() {
  const [isModalOpen,      setIsModalOpen]      = useState(false)
  const [incidentCounts,   setIncidentCounts]   = useState(INITIAL_COUNTS)
  const [incidentSeverity, setIncidentSeverity] = useState(INITIAL_SEVERITY)

  function handleSubmitIncident(workCenterId, severity) {
    if (workCenterId) {
      setIncidentCounts(prev => ({ ...prev, [workCenterId]: (prev[workCenterId] ?? 0) + 1 }))
      if (severity) {
        setIncidentSeverity(prev => ({
          ...prev,
          [workCenterId]: maxSeverity(prev[workCenterId] ?? 'none', severity),
        }))
      }
    }
    setIsModalOpen(false)
  }

  function handleReset() {
    setIncidentCounts(INITIAL_COUNTS)
    setIncidentSeverity(INITIAL_SEVERITY)
  }

  const workCenters = WORK_CENTER_DEFS.map(def => ({
    ...def,
    incidents:    incidentCounts[def.id] ?? 0,
    badgeVariant: severityToBadgeVariant(incidentSeverity[def.id] ?? 'none'),
  }))

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1B1D26' }}>
      <TopNav />
      <SubHeader onOpenModal={() => setIsModalOpen(true)} />
      <main className="flex-1 p-4">
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          {workCenters.map((center) => (
            <WorkCenterCard key={center.id} center={center} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: '1px solid #3C3E4A',
              borderRadius: 4,
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: '#626363',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#5A5E6B'; e.currentTarget.style.color = '#A0A4AF' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3C3E4A'; e.currentTarget.style.color = '#626363' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
            </svg>
            Reset State
          </button>
        </div>
      </main>
      <SafetyIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitIncident}
      />
    </div>
  )
}
