import React, { useState } from 'react'
import { TopNav, SubHeader, PlaceholderPage } from './nav/TopNav'
import WorkCenterCard from './cards/WorkCenterCard'
import SafetyIncidentModal from './modals/SafetyIncidentModal'
import IncidentDetailModal from './modals/IncidentDetailModal'
import SafetyStatisticsPage from '../pages/SafetyStatisticsPage'
import ChatPanel from './chat/ChatPanel'
import './ManufacturingDashboard.css'

// ── Work center chart data ────────────────────────────────────────────────────

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
  { id: 'carpentry', name: 'Carpentry Workshop', accentColor: '#FF71A7', statusLabel: 'Late',        statusCount: 3,    oee: 100, data: carpentryData },
  { id: 'paint',     name: 'Paint',              accentColor: '#ADFFFE', statusLabel: 'In Progress', statusCount: 1,    oee: 100, data: paintData     },
  { id: 'assembly',  name: 'Assembly',           accentColor: '#7396EB', statusLabel: null,          statusCount: null, oee: 100, data: assemblyData  },
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

// ── Label maps (used when building new incidents from modal form) ─────────────

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

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function ManufacturingDashboard() {
  const [incidents,      setIncidents]      = useState(DEMO_INCIDENTS)
  const [openDropdown,   setOpenDropdown]   = useState(null)
  const [detailIncident, setDetailIncident] = useState(null)
  const [isModalOpen,    setIsModalOpen]    = useState(false)
  const [activePage,     setActivePage]     = useState({ section: 'Overview', subItem: null, params: null })
  const [isChatOpen,     setIsChatOpen]     = useState(false)
  const [chatSession,    setChatSession]    = useState(null)

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

  function handleShareIncident(incident) {
    if (!incident) return
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
      contact: { name: 'Maria Shadrin', initial: 'M' },
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
        initialGroupBy:   'month',
        initialCompareBy: null,
        initialDate:      'last90',
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
    if (!workCenterId || workCenterId === 'other') { setIsModalOpen(false); return }
    const workerLabel = WORKERS_MAP[formData.injuredWorker] || formData.injuredWorker
    const injuryLabel = INJURY_LABELS[formData.selectedInjuryType] || formData.otherInjuryText || 'Other'
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const newIncident = {
      id:               `${workCenterId}-${Date.now()}`,
      title:            injuryLabel.length > 35 ? injuryLabel.slice(0, 35) + '…' : injuryLabel,
      subtitle:         `Reported by ${workerLabel} — ${dateStr}`,
      severity,
      reportedBy:       'Emma Granger',
      incidentDate:     dateStr,
      injuredWorker:    workerLabel,
      workerId:         formData.workerId,
      jobTitle:         formData.jobTitle,
      incidentLocation: WORK_CENTER_DISPLAY[workCenterId] || workCenterId,
      workCenterLocation: formData.workCenterLocation || 'Warehouse 2',
      incidentDetails:  formData.incidentDetails,
      injuryType:       { id: formData.selectedInjuryType, label: injuryLabel },
      actionsTaken:     formData.actionsTaken,
    }
    setIncidents(prev => ({ ...prev, [workCenterId]: [...(prev[workCenterId] || []), newIncident] }))
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
    </div>
  )
}
