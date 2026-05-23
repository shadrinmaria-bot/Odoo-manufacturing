import React, { useState, useRef, useEffect } from 'react'
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
import OpenSafetyItemsDropdown from './OpenSafetyItemsDropdown'
import IncidentDetailModal from './IncidentDetailModal'
import SafetyStatisticsPage from './SafetyStatisticsPage'
import Icon from './Icon'
import { Button, ButtonGroup } from './Button'

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

// ── Demo incidents ────────────────────────────────────────────────────────────

const DEMO_INCIDENTS = {
  carpentry: [
    {
      id: 'c1', title: 'Machine guard missing - Saw B',
      subtitle: 'Linked to MR-0219 - Reported Apr 28', severity: 'critical',
      reportedBy: 'Emma Granger', incidentDate: 'Apr 25, 3:00 PM',
      injuredWorker: 'Valeria Kulishov', workerId: '2014321860', jobTitle: 'Chief Executive Officer',
      incidentLocation: 'Carpentry Workshop', workCenterLocation: 'Warehouse 2',
      incidentDetails: "Worker was unloading heavy freight boxes (15–20 kg) from a delivery truck at Warehouse 2. While repositioning a shifted oversized box, it made sudden contact with the worker's upper body, forcing an awkward twisting motion. Worker reported immediate sharp pain in the lower back and right shoulder and was escorted to the on-site medical station. Contributing factors include absence of mechanical lifting aid and time pressure from the delivery schedule.",
      injuryType: { id: 'overexertion', label: 'Overexertion involving outside sources' },
      actionsTaken: 'First Aid Provided, Supervisor Notified, Worker Removed from Duty, Ambulance was Called',
    },
    {
      id: 'c2', title: 'PPE signage faded - North entrance',
      subtitle: 'Flagged during morning walk - Apr 30', severity: 'attention',
      reportedBy: 'Emma Granger', incidentDate: 'Apr 30, 9:15 AM',
      injuredWorker: 'John Doe', workerId: '2012380163', jobTitle: 'Machine Operator',
      incidentLocation: 'Carpentry Workshop', workCenterLocation: 'Warehouse 2',
      incidentDetails: 'PPE safety signage at the north entrance has faded to the point of being illegible. Workers may not be aware of required PPE for the area.',
      injuryType: { id: 'other', label: 'Other' },
      actionsTaken: 'Area Secured, Supervisor Notified',
    },
    {
      id: 'c3', title: 'Emergency exit check',
      subtitle: 'Audit - May 20', severity: 'attention',
      reportedBy: 'Emma Granger', incidentDate: 'May 20, 2:00 PM',
      injuredWorker: 'Jane Smith', workerId: '2012380164', jobTitle: 'Quality Inspector',
      incidentLocation: 'Carpentry Workshop', workCenterLocation: 'Warehouse 2',
      incidentDetails: 'Emergency exit door on the east side of the carpentry workshop was found partially obstructed during routine audit. Exit path was blocked by stored materials.',
      injuryType: { id: 'slip', label: 'Slip or trip without fall' },
      actionsTaken: 'Area Secured, Equipment Shut Down',
    },
  ],
  paint: [
    {
      id: 'p1', title: 'Chemical spill near mixing station',
      subtitle: 'Reported by floor supervisor - Apr 22', severity: 'attention',
      reportedBy: 'Emma Granger', incidentDate: 'Apr 22, 11:30 AM',
      injuredWorker: 'Mike Johnson', workerId: '2012380165', jobTitle: 'Forklift Operator',
      incidentLocation: 'Paint', workCenterLocation: 'Warehouse 2',
      incidentDetails: 'Minor chemical spill occurred near the paint mixing station. No injuries reported. Area was immediately cordoned off.',
      injuryType: { id: 'other-exertions', label: 'Other exertions or bodily reactions' },
      actionsTaken: 'First Aid Administered, Area Secured',
    },
    {
      id: 'p2', title: 'Ventilation system partially blocked',
      subtitle: 'Maintenance inspection - May 1', severity: 'attention',
      reportedBy: 'Emma Granger', incidentDate: 'May 1, 8:00 AM',
      injuredWorker: 'Sara Lee', workerId: '2012380166', jobTitle: 'Assembly Technician',
      incidentLocation: 'Paint', workCenterLocation: 'Warehouse 2',
      incidentDetails: 'Routine maintenance inspection found ventilation ducts partially blocked with paint residue. Risk of fume accumulation in the paint booth area.',
      injuryType: { id: 'repetitive', label: 'Repetitive motions involving microtasks' },
      actionsTaken: 'Equipment Shut Down, Supervisor Notified',
    },
  ],
  assembly: [],
}

// ── Derived badge variant ─────────────────────────────────────────────────────

function getVariantFromIncidents(list) {
  if (!list?.length) return 'grey'
  if (list.some(i => i.severity === 'critical')) return 'red'
  return 'orange'
}

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


function WorkOrderButtons({ onShowChart }) {
  // Three-button group: purple WORK ORDERS on the left, then two gray icon
  // buttons. The grouping rule auto-rounds corners (left/middle/right).
  return (
    <ButtonGroup gap={3}>
      <Button
        variant="purple"
        style={{ padding: '0 12px', height: 32, fontWeight: 600, fontSize: 14.5, whiteSpace: 'nowrap', fontFamily: "'Segoe UI', sans-serif" }}
      >
        WORK ORDERS
      </Button>
      <Button
        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon char={''} size={13} />
      </Button>
      <Button
        onClick={onShowChart}
        title="View on Safety Statistics"
        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon char={''} size={13} />
      </Button>
    </ButtonGroup>
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

function WorkCenterCard({
  center,
  incidents,
  isDropdownOpen,
  onToggleDropdown,
  onCloseDropdown,
  onViewIncident,
  onDeleteIncident,
  onShowStats,
}) {
  const [hovered, setHovered] = useState(false)
  const badgeRef = useRef(null)
  const [anchorRect, setAnchorRect] = useState(null)

  const incidentCount = incidents.length
  const badgeVariant = getVariantFromIncidents(incidents)

  function handleBadgeClick() {
    if (badgeRef.current) {
      setAnchorRect(badgeRef.current.getBoundingClientRect())
    }
    onToggleDropdown()
  }

  return (
    <>
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
            <div ref={badgeRef} style={{ cursor: incidentCount > 0 ? 'pointer' : 'default' }}>
              <StatusBadge
                label={`${incidentCount} Opened Incident${incidentCount !== 1 ? 's' : ''}`}
                variant={badgeVariant}
                isOpen={isDropdownOpen}
                onToggle={incidentCount > 0 ? handleBadgeClick : () => {}}
              />
            </div>
          </div>

          {/* Stats row — buttons pinned left, OEE section pinned right */}
          <div
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 20, paddingRight: 16, paddingBottom: 12,
            }}
          >
            <WorkOrderButtons onShowChart={onShowStats} />

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

      <OpenSafetyItemsDropdown
        isOpen={isDropdownOpen}
        anchorRect={anchorRect}
        workCenterName={center.name}
        incidents={incidents}
        onClose={onCloseDropdown}
        onViewIncident={onViewIncident}
        onDeleteIncident={(incidentId) => onDeleteIncident(center.id, incidentId)}
      />
    </>
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
        <Icon char={""} size={18} color="#F5F5F6" style={{ display: 'block' }} />
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
        <Icon char={""} size={18} color="#F5F5F6" style={{ display: 'block' }} />
      </button>

      {/* Wrench + cross (settings/debug) icon */}
      <button className="p-0 hover:opacity-80 transition-opacity" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <Icon char={""} font="odoo" size={18} color="#F5F5F6" style={{ display: 'block' }} />
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

const NAV_STRUCTURE = [
  { label: 'Overview',      items: null },
  { label: 'Operations',    items: ['Manufacturing Orders', 'Work Orders', 'Unbuild Orders', 'Scrap'] },
  { label: 'Planning',      items: ['Gantt', 'Kanban', 'Employee Planning'] },
  { label: 'Products',      items: ['Products', 'Bills of Materials'] },
  { label: 'Reporting',     items: ['Work Orders', 'Safety Statistics', 'Overall Equipment Effectiveness'] },
  { label: 'Configuration', items: ['Settings', 'Work Centers', 'Operations'] },
]

// Only sub-items in this set are clickable. Everything else is rendered
// dimmed/inert until its destination page is built.
const ENABLED_SUB_ITEMS = new Set([
  'Reporting/Safety Statistics',
])

function NavSection({ section, activePage, openDropdown, onToggleDropdown, onSelect }) {
  const isActive = activePage.section === section.label
  const isOpen = openDropdown === section.label
  const hasItems = !!section.items

  function handleClick() {
    if (!hasItems) onSelect(section.label, null)
    else onToggleDropdown(section.label)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleClick}
        className="px-3 py-1.5 rounded transition-colors"
        style={{
          fontFamily: "'Segoe UI', sans-serif", fontWeight: 400,
          fontSize: 14.55, color: isActive ? '#1AD3BB' : '#F5F5F6',
          border: isActive ? '1px solid rgba(26,211,187,0.4)' : '1px solid transparent',
          background: isActive ? 'rgba(26,211,187,0.05)' : 'transparent',
          cursor: 'pointer',
        }}
      >
        {section.label}
      </button>

      {isOpen && hasItems && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            background: '#2A2E3A',
            border: '1px solid #3C3E4A',
            borderRadius: 4,
            minWidth: 200,
            boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
            zIndex: 100,
            padding: '4px 0',
            animation: 'navDropdownFadeIn 0.12s ease',
          }}
        >
          {section.items.map(item => {
            const isSubActive =
              activePage.section === section.label && activePage.subItem === item
            const itemEnabled = ENABLED_SUB_ITEMS.has(`${section.label}/${item}`)
            return (
              <button
                key={item}
                onClick={itemEnabled ? () => onSelect(section.label, item) : undefined}
                disabled={!itemEnabled}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: isSubActive ? 'rgba(26,211,187,0.07)' : 'transparent',
                  border: 'none',
                  cursor: itemEnabled ? 'pointer' : 'default',
                  padding: '8px 14px',
                  fontFamily: "'Segoe UI', sans-serif", fontSize: 13.5,
                  color: isSubActive ? '#1AD3BB' : '#F5F5F6',
                  opacity: itemEnabled ? 1 : 0.55,
                  transition: 'background 0.12s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (itemEnabled && !isSubActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={e => {
                  if (itemEnabled && !isSubActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TopNav({ activePage, onSelect }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const navRef = useRef(null)

  function toggle(label) {
    setOpenDropdown(prev => (prev === label ? null : label))
  }

  function handleSelect(section, subItem) {
    onSelect(section, subItem)
    setOpenDropdown(null)
  }

  useEffect(() => {
    function handleMouseDown(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null)
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

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
      <nav ref={navRef} className="flex items-center gap-0.5">
        {NAV_STRUCTURE.map(section => (
          <NavSection
            key={section.label}
            section={section}
            activePage={activePage}
            openDropdown={openDropdown}
            onToggleDropdown={toggle}
            onSelect={handleSelect}
          />
        ))}
      </nav>

      <NavIcons />

      <style>{`
        @keyframes navDropdownFadeIn {
          from { opacity: 0; transform: translateY(-3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  )
}

// ── Placeholder page (non-Overview routes) ────────────────────────────────────

function PlaceholderPage({ section, subItem }) {
  return (
    <main
      className="flex-1"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{
          fontFamily: "'Segoe UI', sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: '0.08em', color: '#626363',
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          {section}
        </div>
        <h1 style={{
          fontFamily: "'Segoe UI', sans-serif", fontWeight: 600, fontSize: 30,
          color: '#F5F5F6', margin: 0, lineHeight: 1.2,
        }}>
          {subItem}
        </h1>
        <p style={{
          fontFamily: "'Segoe UI', sans-serif", fontSize: 13, color: '#626363', marginTop: 18,
        }}>
          This page hasn't been built yet.
        </p>
      </div>
    </main>
  )
}

// ── Sub-header ────────────────────────────────────────────────────────────────

function SubHeader({ onOpenModal }) {
  return (
    <div
      className="flex items-center h-10"
      style={{ background: '#262A36', borderBottom: '1px solid #3C3E4A' }}
    >
      {/* Left: title takes up half the width so the centered search stays geometrically centered */}
      <div style={{ flex: 1, padding: '0 16px', display: 'flex', alignItems: 'center' }}>
        <span style={{
          fontFamily: "'Segoe UI', sans-serif", fontWeight: 400,
          fontSize: 16.51, color: '#F5F5F6',
        }}>
          Work Centers Overview
        </span>
      </div>

      {/* Center: search bar */}
      <div className="flex items-center gap-2 px-3 py-1 border"
        style={{ background: '#1B1D26', borderColor: '#3C3E4A', borderRadius: 4, width: 420 }}>
        <Icon char={''} size={13} color="#626363" />
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#626363', flex: 1 }}>Search...</span>
        <Icon char={''} size={11} color="#626363" />
      </div>

      {/* Right: pagination + Report Incident */}
      <div style={{ flex: 1, padding: '0 16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
        <div className="flex items-center gap-1" style={{ color: '#F5F5F6', fontSize: 13, fontFamily: "'Segoe UI', sans-serif" }}>
          <span>1-3 / 3</span>
          <button className="p-0.5 opacity-40" disabled style={{ color: '#F5F5F6' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="p-0.5 opacity-40" disabled style={{ color: '#F5F5F6' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

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
          <Icon char={''} size={12} />
          Report Incident
        </button>
      </div>
    </div>
  )
}// ── Worker / injury label maps ─────────────────────────────────────────────────

const WORKERS_MAP = {
  'john-doe':     'John Doe',
  'jane-smith':   'Jane Smith',
  'mike-johnson': 'Mike Johnson',
  'sara-lee':     'Sara Lee',
}

const WORK_CENTER_DISPLAY = {
  carpentry: 'Carpentry Workshop',
  paint:     'Paint',
  assembly:  'Assembly',
  other:     'Other',
}

const INJURY_LABELS = {
  overexertion:      'Overexertion involving outside sources',
  'other-exertions': 'Other exertions or bodily reactions',
  repetitive:        'Repetitive motions involving microtasks',
  'fall-same':       'Falls on the same level',
  roadway:           'Roadway incidents by motorized vehicles',
  'struck-against':  'Struck against object or equipment',
  'struck-by':       'Struck by object or equipment',
  slip:              'Slip or trip without fall',
  'fall-lower':      'Falls to lower level',
  caught:            'Caught in equipment or objects',
  other:             'Other',
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function ManufacturingDashboard() {
  const [incidents,      setIncidents]      = useState(DEMO_INCIDENTS)
  const [openDropdown,   setOpenDropdown]   = useState(null)
  const [detailIncident, setDetailIncident] = useState(null)
  const [isModalOpen,    setIsModalOpen]    = useState(false)
  const [activePage,     setActivePage]     = useState({ section: 'Overview', subItem: null, params: null })

  // Jump from an Overview work-center card straight to the Stats page,
  // line mode, with that center's series pre-filtered.
  function goToWorkCenterStats(workCenterName) {
    setActivePage({
      section: 'Reporting',
      subItem: 'Safety Statistics',
      params: { initialFilter: workCenterName, initialGraphType: 'line' },
    })
  }

  function toggleDropdown(id) { setOpenDropdown(p => p === id ? null : id) }
  function closeDropdown()    { setOpenDropdown(null) }

  function deleteIncident(workCenterId, incidentId) {
    setIncidents(prev => ({
      ...prev,
      [workCenterId]: prev[workCenterId].filter(i => i.id !== incidentId),
    }))
  }

  function handleSubmitIncident(workCenterId, severity, formData) {
    if (!workCenterId || workCenterId === 'other') { setIsModalOpen(false); return }
    const workerLabel  = WORKERS_MAP[formData.injuredWorker] || formData.injuredWorker
    const injuryLabel  = INJURY_LABELS[formData.selectedInjuryType] || formData.otherInjuryText || 'Other'
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const newIncident = {
      id: `${workCenterId}-${Date.now()}`,
      title: injuryLabel.length > 35 ? injuryLabel.slice(0, 35) + '…' : injuryLabel,
      subtitle: `Reported by ${workerLabel} — ${dateStr}`,
      severity,
      reportedBy: 'Emma Granger',
      incidentDate: dateStr,
      injuredWorker: workerLabel,
      workerId: formData.workerId,
      jobTitle: formData.jobTitle,
      incidentLocation: WORK_CENTER_DISPLAY[workCenterId] || workCenterId,
      workCenterLocation: formData.workCenterLocation || 'Warehouse 2',
      incidentDetails: formData.incidentDetails,
      injuryType: { id: formData.selectedInjuryType, label: injuryLabel },
      actionsTaken: formData.actionsTaken,
    }
    setIncidents(prev => ({ ...prev, [workCenterId]: [...(prev[workCenterId] || []), newIncident] }))
    setIsModalOpen(false)
  }

  function handleReset() {
    setIncidents(DEMO_INCIDENTS)
    setOpenDropdown(null)
    setDetailIncident(null)
  }

  const workCenters = WORK_CENTER_DEFS.map(def => ({ ...def }))

  const isOverview = activePage.section === 'Overview'
  const isSafetyStats =
    activePage.section === 'Reporting' && activePage.subItem === 'Safety Statistics'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1B1D26' }}>
      <TopNav
        activePage={activePage}
        onSelect={(section, subItem) => setActivePage({ section, subItem, params: null })}
      />

      {isOverview ? (
        <>
          <SubHeader onOpenModal={() => setIsModalOpen(true)} />
          <main className="flex-1 p-4">
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              {workCenters.map((center) => (
                <WorkCenterCard
                  key={center.id}
                  center={center}
                  incidents={incidents[center.id] ?? []}
                  isDropdownOpen={openDropdown === center.id}
                  onToggleDropdown={() => toggleDropdown(center.id)}
                  onCloseDropdown={closeDropdown}
                  onViewIncident={(incident) => { closeDropdown(); setDetailIncident(incident) }}
                  onDeleteIncident={deleteIncident}
                  onShowStats={() => goToWorkCenterStats(center.name)}
                />
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
        </>
      ) : isSafetyStats ? (
        <SafetyStatisticsPage
          key={activePage.params?.initialFilter ?? 'all'}
          initialParams={activePage.params}
        />
      ) : (
        <PlaceholderPage section={activePage.section} subItem={activePage.subItem} />
      )}
      <SafetyIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitIncident}
      />
      <IncidentDetailModal
        incident={detailIncident}
        isOpen={!!detailIncident}
        onClose={() => setDetailIncident(null)}
      />
    </div>
  )
}
