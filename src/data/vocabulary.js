// ────────────────────────────────────────────────────────────────────────────
// Shared domain vocabulary.
//
// Single source of truth for the terms used by the report form
// (SafetyIncidentModal), the Overview cards (ManufacturingDashboard) and the
// Safety Statistics page (data/incidents.js). These three used to keep their
// own private copies, which drifted until only 1 of 11 injury labels still
// matched between the form and the chart. Import from here instead.
//
// Injury types carry two labels on purpose:
//   label — the long descriptive wording shown on the form's tiles
//   short — the compact wording a chart axis can actually fit
// ────────────────────────────────────────────────────────────────────────────

// ── Workers ──────────────────────────────────────────────────────────────────
// `title` is the job title auto-filled into the form when a worker is picked,
// and is what the statistics page groups by under "Job Title".

export const WORKERS = [
  { value: 'john-doe',         label: 'John Doe',         title: 'Machine Operator',        workerId: '2012380163' },
  { value: 'jane-smith',       label: 'Jane Smith',       title: 'Quality Inspector',       workerId: '2012380164' },
  { value: 'mike-johnson',     label: 'Mike Johnson',     title: 'Forklift Operator',       workerId: '2012380165' },
  { value: 'sara-lee',         label: 'Sara Lee',         title: 'Assembly Technician',     workerId: '2012380166' },
  { value: 'maria-lan',        label: 'Maria Lan',        title: 'Production Operator',     workerId: '2012380167' },
  { value: 'valeria-kulishov', label: 'Valeria Kulishov', title: 'Chief Executive Officer', workerId: '2014321860' },
  { value: 'amit-tzadik',      label: 'Amit Tzadik',      title: 'Safety Officer',          workerId: '2012380168' },
  { value: 'oran-shuster',     label: 'Oran Shuster',     title: 'Maintenance Technician',  workerId: '2012380169' },
]

export const JOB_TITLES = WORKERS.map(w => w.title)

// ── Severity ─────────────────────────────────────────────────────────────────

export const SEVERITY_OPTIONS = [
  { value: 'critical',  label: 'Critical',        color: '#B83232' },
  { value: 'attention', label: 'Needs Attention', color: '#008FE3' },
]

// ── Injury types ─────────────────────────────────────────────────────────────
// Order is load-bearing: SafetyIncidentModal renders these as a tile grid and
// slices the list (first 8, then "Other...", then the remaining 2).

export const INJURY_TYPES = [
  // Row 1
  { id: 'overexertion',    label: 'Overexertion involving outside sources',  short: 'Overexertion',          iconSrc: '/icons/injuries/overexertion.svg' },
  { id: 'other-exertions', label: 'Other exertions or bodily reactions',     short: 'Other exertions',       iconSrc: '/icons/injuries/other-exertions.svg' },
  { id: 'repetitive',      label: 'Repetitive motions involving microtasks', short: 'Repetitive motions',    iconSrc: '/icons/injuries/repetitive.svg' },
  // Row 2
  { id: 'fall-same',       label: 'Falls on the same level',                 short: 'Falls (same level)',    iconSrc: '/icons/injuries/fall-same.svg' },
  { id: 'roadway',         label: 'Roadway incidents by motorized vehicles', short: 'Roadway',               iconSrc: '/icons/injuries/roadway.svg' },
  { id: 'struck-against',  label: 'Struck against object or equipment',      short: 'Struck against',        iconSrc: '/icons/injuries/struck-against.svg' },
  // Row 3
  { id: 'struck-by',       label: 'Struck by object or equipment',           short: 'Struck by object',      iconSrc: '/icons/injuries/struck-by.svg' },
  { id: 'slip',            label: 'Slip or trip without fall',               short: 'Slip/trip (no fall)',   iconSrc: '/icons/injuries/slip.svg' },
  // "Other" is the odd one out: its tile is a free-text input whose placeholder
  // is hardcoded in the form, so this label is never shown as tile wording — it
  // only ends up on the stored incident record. Keep it free of the trailing
  // ellipsis affordance, which would otherwise read as "Other..." on the
  // incident row, the detail modal and the shared chat message.
  { id: 'other',           label: 'Other',                                   short: 'Other',                 iconSrc: '/icons/injuries/other.svg' },
  // Row 4
  { id: 'fall-lower',      label: 'Falls to lower level',                    short: 'Falls to lower level',  iconSrc: '/icons/injuries/fall-lower.svg' },
  { id: 'caught',          label: 'Caught in equipment or objects',          short: 'Caught in equipment',   iconSrc: '/icons/injuries/caught.svg' },
]

// ── Work centers ─────────────────────────────────────────────────────────────
// `warehouseLocation` is auto-filled (read-only) into the form when a work
// center is picked, so a work center maps 1:1 onto a warehouse.

export const WORK_CENTERS = [
  { id: 'carpentry', label: 'Carpentry Workshop', warehouseLocation: 'Warehouse 2' },
  { id: 'paint',     label: 'Paint',              warehouseLocation: 'Warehouse 1' },
  { id: 'assembly',  label: 'Assembly',           warehouseLocation: 'Warehouse 3' },
  { id: 'other',     label: 'Other',              warehouseLocation: '' },
]

// The work centers that own a card on the Overview and can hold incidents.
export const REPORTABLE_WORK_CENTERS = WORK_CENTERS.filter(wc => wc.id !== 'other')

// ── Actions taken ────────────────────────────────────────────────────────────
// Doubles as the report form's autocomplete suggestions and the statistics
// page's "Actions Taken" domain.

export const ACTIONS = [
  'First Aid Provided',
  'Supervisor Notified',
  'Worker Removed from Duty',
  'Ambulance Called',
  'Area Secured',
  'Equipment Shut Down',
  'Incident Photographed',
  'Safety Officer Alerted',
  'Medical Examination Scheduled',
  'Corrective Action Initiated',
  'Witness Statements Collected',
  'Management Informed',
]

// ── Derived lookup maps ──────────────────────────────────────────────────────

export const WORKERS_MAP = Object.fromEntries(WORKERS.map(w => [w.value, w.label]))
export const WORK_CENTER_DISPLAY = Object.fromEntries(WORK_CENTERS.map(wc => [wc.id, wc.label]))
export const WORK_CENTER_WAREHOUSE = Object.fromEntries(WORK_CENTERS.map(wc => [wc.id, wc.warehouseLocation]))
export const INJURY_LABELS = Object.fromEntries(INJURY_TYPES.map(t => [t.id, t.label]))
export const INJURY_SHORT = Object.fromEntries(INJURY_TYPES.map(t => [t.id, t.short]))

/** Chart-friendly label for an incident's injuryType ({ id, label } or free text). */
export function injuryShortLabel(injuryType) {
  if (!injuryType) return 'Other'
  const { id, label } = injuryType
  if (id && INJURY_SHORT[id] && id !== 'other') return INJURY_SHORT[id]
  // "Other..." carries free text typed by the reporter — bucket it all as Other
  // so one-off write-ins don't each become their own chart column.
  return 'Other'
}
