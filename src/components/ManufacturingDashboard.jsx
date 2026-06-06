import React, { useState } from 'react'
import { TopNav, SubHeader, PlaceholderPage } from './nav/TopNav'
import WorkCenterCard from './cards/WorkCenterCard'
import SafetyIncidentModal from './modals/SafetyIncidentModal'
import IncidentDetailModal from './modals/IncidentDetailModal'
import SafetyStatisticsPage from '../pages/SafetyStatisticsPage'
import ChatPanel from './chat/ChatPanel'
import ToastNotification from './shared/ToastNotification'
import './ManufacturingDashboard.css'

// ── Work center chart data ────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getMondayOf(d) {
  const date = new Date(d)
  const day  = date.getDay()               // 0 = Sunday
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  date.setHours(0, 0, 0, 0)
  return date
}

function weekRangeLabel(monday) {
  const end = new Date(monday)
  end.setDate(end.getDate() + 6)
  const s  = monday.getDate()
  const e  = end.getDate()
  const sm = MONTHS[monday.getMonth()]
  const em = MONTHS[end.getMonth()]
  return sm === em ? `${s}-${e} ${sm}` : `${s} ${sm}-${e} ${em}`
}

// Threshold for weekly load hours — bars above this show a purple overflow segment.
const THRESHOLD_HOURS = 30

// "This Week" is always the SECOND column (index 1), matching the reference:
// 1 past week on the left, 3 scheduled future weeks on the right.
const THIS_WEEK_COL = 1   // 0-based column index for "This Week"

function buildWeeklyData(loadHours) {
  const thisMonday = getMondayOf(new Date())
  return loadHours.map((hours, i) => {
    const offset = i - THIS_WEEK_COL   // negative = past, 0 = this week, positive = future
    const monday = new Date(thisMonday)
    monday.setDate(monday.getDate() + offset * 7)
    const week = offset === 0 ? 'This Week' : weekRangeLabel(monday)
    if (!hours) return { week, load: null, down: null }
    return { week, load: hours, down: -hours }
  })
}

// 5-column layout: [last wk, This Week, +1 wk, +2 wk, +3 wk]
// Values > 30 h get a purple overflow cap; ≤ 30 h are teal only.
const carpentryData = buildWeeklyData([22, 44, 38, 28, 35])
const paintData     = buildWeeklyData([28, 32, 20, 38, 25])
const assemblyData  = buildWeeklyData([48, 22, 30, 15, 42])

const WORK_CENTER_DEFS = [
  { id: 'carpentry', name: 'Carpentry Workshop', accentColor: '#FF71A7', statusLabel: 'Late',        statusCount: 3,    oee: 100, data: carpentryData },
  { id: 'paint',     name: 'Paint',              accentColor: '#ADFFFE', statusLabel: 'In Progress', statusCount: 1,    oee: 100, data: paintData     },
  { id: 'assembly',  name: 'Assembly',           accentColor: '#7396EB', statusLabel: null,          statusCount: null, oee: 100, data: assemblyData  },
]

// ── Demo incidents ────────────────────────────────────────────────────────────

const DEMO_INCIDENTS = {
  carpentry: [
    {
      id: 'c2', title: 'PPE signage faded',
      severity: 'attention',
      reportedBy: 'J. Miller', incidentDate: 'Apr 30, 9:15 AM',
      date: 'Apr 30', location: 'North entrance',
      injuredWorker: 'John Doe', workerId: '2012380163', jobTitle: 'Machine Operator',
      incidentLocation: 'Carpentry Workshop', workCenterLocation: 'Warehouse 2',
      incidentDetails: 'PPE safety signage at the north entrance has faded to the point of being illegible. Workers may not be aware of required PPE for the area.',
      injuryType: { id: 'other', label: 'Other' },
      actionsTaken: 'Area Secured, Supervisor Notified',
    },
    {
      id: 'c3', title: 'Emergency exit obstructed',
      severity: 'attention',
      reportedBy: 'Emma Granger', incidentDate: 'May 20, 2:00 PM',
      date: 'May 20', location: 'East side exit',
      injuredWorker: 'Jane Smith', workerId: '2012380164', jobTitle: 'Quality Inspector',
      incidentLocation: 'Carpentry Workshop', workCenterLocation: 'Warehouse 2',
      incidentDetails: 'Emergency exit door on the east side of the carpentry workshop was found partially obstructed during routine audit. Exit path was blocked by stored materials.',
      injuryType: { id: 'slip', label: 'Slip or trip without fall' },
      actionsTaken: 'Area Secured, Equipment Shut Down',
    },
  ],
  paint: [
    {
      id: 'p1', title: 'Chemical spill — mixing station',
      severity: 'attention',
      reportedBy: 'Floor Supervisor', incidentDate: 'Apr 22, 11:30 AM',
      date: 'Apr 22', location: 'Mixing station',
      injuredWorker: 'Mike Johnson', workerId: '2012380165', jobTitle: 'Forklift Operator',
      incidentLocation: 'Paint', workCenterLocation: 'Warehouse 2',
      incidentDetails: 'Minor chemical spill occurred near the paint mixing station. No injuries reported. Area was immediately cordoned off.',
      injuryType: { id: 'other-exertions', label: 'Other exertions or bodily reactions' },
      actionsTaken: 'First Aid Administered, Area Secured',
    },
    {
      id: 'p2', title: 'Ventilation partially blocked',
      severity: 'attention',
      reportedBy: 'Emma Granger', incidentDate: 'May 1, 8:00 AM',
      date: 'May 1', location: 'Spray booth',
      injuredWorker: 'Sara Lee', workerId: '2012380166', jobTitle: 'Assembly Technician',
      incidentLocation: 'Paint', workCenterLocation: 'Warehouse 2',
      incidentDetails: 'Routine maintenance inspection found ventilation ducts partially blocked with paint residue. Risk of fume accumulation in the paint booth area.',
      injuryType: { id: 'repetitive', label: 'Repetitive motions involving microtasks' },
      actionsTaken: 'Equipment Shut Down, Supervisor Notified',
    },
  ],
  assembly: [],
}

// ── Label maps (used when building new incidents from modal form) ─────────────

const WORKERS_MAP = {
  'john-doe':         'John Doe',
  'jane-smith':       'Jane Smith',
  'mike-johnson':     'Mike Johnson',
  'sara-lee':         'Sara Lee',
  'maria-lan':        'Maria Lan',
  'valeria-kulishov': 'Valeria Kulishov',
  'amit-tzadik':      'Amit Tzadik',
  'oran-shuster':     'Oran Shuster',
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

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function ManufacturingDashboard() {
  const [incidents,      setIncidents]      = useState(DEMO_INCIDENTS)
  const [openDropdown,   setOpenDropdown]   = useState(null)
  const [detailIncident, setDetailIncident] = useState(null)
  const [isModalOpen,    setIsModalOpen]    = useState(false)
  const [activePage,     setActivePage]     = useState({ section: 'Overview', subItem: null, params: null })
  const [isChatOpen,     setIsChatOpen]     = useState(false)
  const [chatSession,    setChatSession]    = useState(null)
  const [toast,          setToast]          = useState({ key: 0, severity: null })

  function showToast(severity) {
    setToast(t => ({ key: t.key + 1, severity }))
  }

  function buildSharedIncidentMessage(incident) {
    const sevLabel = incident.severity === 'critical' ? 'Critical' : 'Needs Attention'
    const typeLabel = incident.injuryType?.label || 'Incident'
    return (
      <>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>🚨 Safety Incident Report Shared</div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{typeLabel}</div>
        <div>Injured Worker: {incident.injuredWorker || '—'}</div>
        <div>Location: {incident.incidentLocation || '—'}</div>
        <div>Date: {incident.incidentDate || '—'}</div>
        <div style={{ marginBottom: 4 }}>Severity: {sevLabel}</div>
        <div style={{ opacity: 0.75 }}>View full report for details.</div>
      </>
    )
  }

  function nowTimeLabel() {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  function handleShareIncident(incident, shareOptions) {
    if (!incident) return
    const recipients = shareOptions?.recipients ?? []
    const first = recipients[0] ?? { name: 'Maria Shadrin', initial: 'M' }
    const extras = Math.max(0, recipients.length - 1)
    const contactName = extras > 0
      ? `${first.name} +${extras} other${extras === 1 ? '' : 's'}`
      : first.name
    const initialMessages = [
      { id: 'share-intro', type: 'intro' },
      { id: 'share-sep',   type: 'separator', label: 'Today' },
      {
        id: `share-${Date.now()}`, type: 'message', from: 'user',
        name: 'You', time: nowTimeLabel(),
        text: buildSharedIncidentMessage(incident),
      },
    ]
    setChatSession({
      contact: { name: contactName, initial: (first.initial || first.name.charAt(0)).toUpperCase() },
      initialMessages,
    })
    setDetailIncident(null)
    setIsChatOpen(true)
  }

  function handleCloseChat() {
    setIsChatOpen(false)
    setChatSession(null)
  }

  function goToWorkCenterStats(workCenterName) {
    setActivePage({
      section: 'Reporting',
      subItem: 'Safety Statistics',
      params: {
        initialFilter:    workCenterName,
        initialGroupBy:   'workCenter',
        initialCompareBy: null,
        initialDate:      'last7',
        initialGraphType: 'line',
      },
    })
  }

  function toggleDropdown(id) { setOpenDropdown(p => p === id ? null : id) }
  function closeDropdown()    { setOpenDropdown(null) }

  function markIncidentAsDone(incidentId) {
    setIncidents(prev => {
      const next = {}
      for (const key in prev) next[key] = prev[key].filter(i => i.id !== incidentId)
      return next
    })
  }

  function handleSubmitIncident(workCenterId, severity, formData) {
    if (!workCenterId || workCenterId === 'other') {
      showToast(severity)
      setIsModalOpen(false)
      return
    }
    const workerLabel = WORKERS_MAP[formData.injuredWorker] || formData.injuredWorker
    const injuryLabel = INJURY_LABELS[formData.selectedInjuryType] || formData.otherInjuryText || 'Other'
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const shortDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const locationLabel = WORK_CENTER_DISPLAY[workCenterId] || workCenterId
    const newIncident = {
      id:               `${workCenterId}-${Date.now()}`,
      title:            injuryLabel.length > 35 ? injuryLabel.slice(0, 35) + '…' : injuryLabel,
      severity,
      reportedBy:       WORKERS_MAP[formData.reportedBy] || formData.reportedBy || 'Unknown',
      incidentDate:     dateStr,
      date:             shortDate,
      location:         locationLabel,
      injuredWorker:    workerLabel,
      workerId:         formData.workerId,
      jobTitle:         formData.jobTitle,
      incidentLocation: locationLabel,
      workCenterLocation: formData.workCenterLocation || 'Warehouse 2',
      incidentDetails:  formData.incidentDetails,
      injuryType:       { id: formData.selectedInjuryType, label: injuryLabel },
      actionsTaken:     formData.actionsTaken,
    }
    setIncidents(prev => ({ ...prev, [workCenterId]: [...(prev[workCenterId] || []), newIncident] }))
    showToast(severity)
    setIsModalOpen(false)
  }

  function handleReset() {
    setIncidents(DEMO_INCIDENTS)
    setOpenDropdown(null)
    setDetailIncident(null)
  }

  const isOverview    = activePage.section === 'Overview'
  const isSafetyStats = activePage.section === 'Reporting' && activePage.subItem === 'Safety Statistics'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1B1D26' }}>
      <TopNav
        activePage={activePage}
        onSelect={(section, subItem) => setActivePage({ section, subItem, params: null })}
        onOpenChat={() => { setChatSession(null); setIsChatOpen(true) }}
      />

      {isOverview ? (
        <>
          <SubHeader onOpenModal={() => setIsModalOpen(true)} />
          <main className="overview-main">
            <div className="cards-grid">
              {WORK_CENTER_DEFS.map(center => (
                <WorkCenterCard
                  key={center.id}
                  center={center}
                  incidents={incidents[center.id] ?? []}
                  isDropdownOpen={openDropdown === center.id}
                  onToggleDropdown={() => toggleDropdown(center.id)}
                  onCloseDropdown={closeDropdown}
                  onViewIncident={(incident) => { closeDropdown(); setDetailIncident(incident) }}
                  onDeleteIncident={() => {}}
                  onShowStats={() => goToWorkCenterStats(center.name)}
                  onReportIncident={() => setIsModalOpen(true)}
                />
              ))}
            </div>
            <div className="cards-footer">
              <button className="reset-btn" onClick={handleReset}>
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
          onOpenModal={() => setIsModalOpen(true)}
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
        onMarkAsDone={markIncidentAsDone}
        onShare={handleShareIncident}
      />
      <ChatPanel
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        contact={chatSession?.contact}
        initialMessages={chatSession?.initialMessages}
      />

      {toast.severity && (
        <ToastNotification
          key={toast.key}
          severity={toast.severity}
          onClose={() => setToast(t => ({ ...t, severity: null }))}
        />
      )}
    </div>
  )
}
