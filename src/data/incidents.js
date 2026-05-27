// ────────────────────────────────────────────────────────────────────────────
// Synthetic incident dataset used by the Safety Statistics page.
//
// All dates are anchored to REFERENCE_NOW so date filters ("Last 30 days",
// etc.) stay stable regardless of when the prototype is opened. Bump the
// constant when you want to "advance time" for demos.
//
// Each incident has the fields needed to bucket it along any of the page's
// dimensions:
//   - reportDate    when the report was filed
//   - incidentTime  when the incident actually happened (used by Time of Day)
//   - resolvedAt    when it was marked as done (null = still open)
//   - workCenter / location / injuryType / jobTitle / severity / actions
// ────────────────────────────────────────────────────────────────────────────

export const REFERENCE_NOW = new Date('2026-05-24T17:00:00')

export const WORK_CENTERS = ['Carpentry Workshop', 'Paint', 'Assembly']
export const LOCATIONS    = ['Warehouse 1', 'Warehouse 2', 'Warehouse 3']
export const JOB_TITLES   = ['Machine Operator', 'Warehouse Worker', 'Maintenance Tech', 'Quality Inspector', 'Shift Supervisor']
export const SEVERITIES   = ['critical', 'attention']

export const INJURY_TYPES = [
  'Overexertion',
  'Other exertions',
  'Repetitive motions',
  'Falls (same level)',
  'Falls to lower level',
  'Slip/trip (no fall)',
  'Struck by object',
  'Struck against',
  'Caught in equipment',
  'Roadway',
]

export const ACTIONS = [
  'First Aid Administered',
  'Area Secured',
  'Worker Sent Home',
  'Emergency Services Called',
  'Equipment Shut Down',
  'Supervisor Notified',
]

// ── Helpers for building stable date strings ─────────────────────────────────

function at(daysAgo, hour, minute = 0) {
  const d = new Date(REFERENCE_NOW)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

// Each entry: [id, daysAgo, hr, workCenter, location, injuryType, jobTitle,
//              severity, resolveAfterDays (null = unresolved), action]
const ROWS = [
  // ── Last 7 days (6 incidents) ──
  ['i01',  0, 15, 'Carpentry Workshop', 'Warehouse 2', 'Overexertion',         'Warehouse Worker',  'critical',  null, 'First Aid Administered'],
  ['i02',  1,  9, 'Paint',              'Warehouse 1', 'Other exertions',      'Machine Operator',  'attention',    1, 'Supervisor Notified'],
  ['i03',  2, 14, 'Carpentry Workshop', 'Warehouse 2', 'Slip/trip (no fall)',  'Maintenance Tech',  'attention', null, 'Area Secured'],
  ['i04',  3,  8, 'Assembly',           'Warehouse 3', 'Falls (same level)',   'Quality Inspector', 'attention',    2, 'First Aid Administered'],
  ['i05',  5, 16, 'Paint',              'Warehouse 2', 'Repetitive motions',   'Machine Operator',  'attention',    1, 'Supervisor Notified'],
  ['i06',  6, 11, 'Carpentry Workshop', 'Warehouse 2', 'Struck by object',     'Warehouse Worker',  'critical',     4, 'Equipment Shut Down'],

  // ── 7-14 days ago (6 incidents) ──
  ['i07',  8, 10, 'Assembly',           'Warehouse 2', 'Repetitive motions',   'Quality Inspector', 'attention',    1, 'Supervisor Notified'],
  ['i08',  9, 13, 'Paint',              'Warehouse 2', 'Struck against',       'Machine Operator',  'attention',    1, 'Area Secured'],
  ['i09', 11, 17, 'Carpentry Workshop', 'Warehouse 3', 'Struck by object',     'Maintenance Tech',  'critical',     2, 'Emergency Services Called'],
  ['i10', 12,  9, 'Paint',              'Warehouse 1', 'Overexertion',         'Machine Operator',  'attention',    3, 'Worker Sent Home'],
  ['i11', 13, 15, 'Assembly',           'Warehouse 3', 'Falls to lower level', 'Shift Supervisor',  'critical',     6, 'Emergency Services Called'],
  ['i12', 14, 12, 'Carpentry Workshop', 'Warehouse 2', 'Struck by object',     'Warehouse Worker',  'attention',    1, 'First Aid Administered'],

  // ── 14-30 days ago (9 incidents) ──
  ['i13', 16, 10, 'Paint',              'Warehouse 2', 'Slip/trip (no fall)',  'Quality Inspector', 'attention',    2, 'Area Secured'],
  ['i14', 18, 14, 'Carpentry Workshop', 'Warehouse 2', 'Caught in equipment',  'Maintenance Tech',  'critical',     8, 'Equipment Shut Down'],
  ['i15', 20,  8, 'Assembly',           'Warehouse 3', 'Falls (same level)',   'Warehouse Worker',  'attention',    1, 'First Aid Administered'],
  ['i16', 22, 11, 'Paint',              'Warehouse 1', 'Repetitive motions',   'Machine Operator',  'attention',    1, 'Supervisor Notified'],
  ['i17', 24, 16, 'Carpentry Workshop', 'Warehouse 2', 'Other exertions',      'Warehouse Worker',  'attention',    4, 'Supervisor Notified'],
  ['i18', 26,  9, 'Assembly',           'Warehouse 2', 'Slip/trip (no fall)',  'Quality Inspector', 'attention',    1, 'Area Secured'],
  ['i19', 27, 13, 'Carpentry Workshop', 'Warehouse 3', 'Overexertion',         'Shift Supervisor',  'attention',    3, 'Worker Sent Home'],
  ['i20', 28, 18, 'Paint',              'Warehouse 1', 'Struck against',       'Maintenance Tech',  'attention',    2, 'Area Secured'],
  ['i21', 30, 10, 'Carpentry Workshop', 'Warehouse 2', 'Falls (same level)',   'Machine Operator',  'critical',     5, 'First Aid Administered'],

  // ── 30-60 days ago (12 incidents) ──
  ['i22', 33, 14, 'Assembly',           'Warehouse 2', 'Other exertions',      'Warehouse Worker',  'attention',    1, 'Supervisor Notified'],
  ['i23', 35, 11, 'Paint',              'Warehouse 2', 'Overexertion',         'Quality Inspector', 'attention',    2, 'First Aid Administered'],
  ['i24', 37,  8, 'Carpentry Workshop', 'Warehouse 1', 'Roadway',              'Warehouse Worker',  'critical',     7, 'Emergency Services Called'],
  ['i25', 39, 16, 'Paint',              'Warehouse 2', 'Slip/trip (no fall)',  'Maintenance Tech',  'attention',    1, 'Area Secured'],
  ['i26', 42, 10, 'Carpentry Workshop', 'Warehouse 2', 'Struck by object',     'Machine Operator',  'attention',    3, 'Equipment Shut Down'],
  ['i27', 45, 12, 'Assembly',           'Warehouse 3', 'Repetitive motions',   'Quality Inspector', 'attention',    1, 'Supervisor Notified'],
  ['i28', 47, 15, 'Paint',              'Warehouse 1', 'Caught in equipment',  'Maintenance Tech',  'critical',    10, 'Equipment Shut Down'],
  ['i29', 50,  9, 'Carpentry Workshop', 'Warehouse 2', 'Overexertion',         'Warehouse Worker',  'attention',    4, 'Worker Sent Home'],
  ['i30', 52, 13, 'Assembly',           'Warehouse 2', 'Falls (same level)',   'Shift Supervisor',  'attention',    1, 'First Aid Administered'],
  ['i31', 54, 17, 'Paint',              'Warehouse 2', 'Struck against',       'Machine Operator',  'attention',    2, 'Area Secured'],
  ['i32', 56, 11, 'Carpentry Workshop', 'Warehouse 3', 'Falls to lower level', 'Maintenance Tech',  'critical',     9, 'Emergency Services Called'],
  ['i33', 58, 14, 'Paint',              'Warehouse 1', 'Repetitive motions',   'Quality Inspector', 'attention',    1, 'Supervisor Notified'],

  // ── 60-90 days ago (7 incidents) ──
  ['i34', 62, 10, 'Assembly',           'Warehouse 3', 'Roadway',              'Warehouse Worker',  'critical',    14, 'Emergency Services Called'],
  ['i35', 66,  9, 'Carpentry Workshop', 'Warehouse 2', 'Other exertions',      'Shift Supervisor',  'attention',    3, 'Supervisor Notified'],
  ['i36', 71, 15, 'Paint',              'Warehouse 1', 'Slip/trip (no fall)',  'Machine Operator',  'attention',    2, 'Area Secured'],
  ['i37', 75, 12, 'Carpentry Workshop', 'Warehouse 2', 'Overexertion',         'Warehouse Worker',  'attention',    5, 'Worker Sent Home'],
  ['i38', 80, 16, 'Assembly',           'Warehouse 2', 'Struck by object',     'Maintenance Tech',  'attention',    2, 'Equipment Shut Down'],
  ['i39', 84, 13, 'Paint',              'Warehouse 2', 'Falls (same level)',   'Quality Inspector', 'attention',    3, 'First Aid Administered'],
  ['i40', 88, 18, 'Carpentry Workshop', 'Warehouse 3', 'Struck by object',     'Machine Operator',  'critical',     8, 'Equipment Shut Down'],
]

export const INCIDENTS = ROWS.map(([id, days, hr, wc, loc, inj, job, sev, resolveDays, action]) => {
  const reportDate = at(days, hr)
  const incidentDate = at(days, Math.max(0, hr - 1)) // 1h before report
  let resolvedAt = null
  if (resolveDays !== null) {
    const r = new Date(REFERENCE_NOW)
    r.setDate(r.getDate() - days + resolveDays)
    r.setHours(hr + 2, 0, 0, 0)
    resolvedAt = r.toISOString()
  }
  return {
    id, reportDate, incidentTime: incidentDate, resolvedAt,
    workCenter: wc, location: loc, injuryType: inj, jobTitle: job, severity: sev,
    actions: action,
  }
})

// ── Dimensions — each is { id, label, extract: (incident) => bucketLabel } ──

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function hourOf(iso)  { return new Date(iso).getHours() }
function monthOf(iso) { return MONTHS[new Date(iso).getMonth()] }
function dayOfWeek(iso) { return WEEKDAYS[new Date(iso).getDay()] }

function timeOfDayBucket(iso) {
  const h = hourOf(iso)
  if (h >= 6  && h < 12) return 'Morning (6-12)'
  if (h >= 12 && h < 18) return 'Afternoon (12-18)'
  if (h >= 18 && h < 24) return 'Evening (18-24)'
  return 'Night (0-6)'
}

function timeToResolutionBucket(i) {
  if (!i.resolvedAt) return 'Unresolved'
  const ms = new Date(i.resolvedAt) - new Date(i.incidentTime)
  const days = ms / (1000 * 60 * 60 * 24)
  if (days < 1) return '< 1 day'
  if (days < 3) return '1-3 days'
  if (days < 7) return '3-7 days'
  return '> 7 days'
}

export const DIMENSIONS = [
  { id: 'workCenter',    label: 'Work Center',    extract: i => i.workCenter,                     domain: WORK_CENTERS },
  { id: 'injuryType',    label: 'Injury Type',    extract: i => i.injuryType,                     domain: INJURY_TYPES },
  { id: 'jobTitle',      label: 'Job Title',      extract: i => i.jobTitle,                       domain: JOB_TITLES },
  { id: 'location',      label: 'Location',       extract: i => i.location,                       domain: LOCATIONS },
  { id: 'severity',      label: 'Severity',       extract: i => i.severity === 'critical' ? 'Critical' : 'Needs Attention', domain: ['Critical', 'Needs Attention'] },
  { id: 'actions',       label: 'Actions Taken',  extract: i => i.actions,                        domain: ACTIONS },
  { id: 'timeOfDay',     label: 'Time of Day',    extract: i => timeOfDayBucket(i.incidentTime),  domain: ['Morning (6-12)', 'Afternoon (12-18)', 'Evening (18-24)', 'Night (0-6)'] },
  { id: 'month',         label: 'Month',          extract: i => monthOf(i.reportDate),            domain: null /* derived */ },
  { id: 'dayOfWeek',     label: 'Day of Week',    extract: i => dayOfWeek(i.reportDate),          domain: WEEKDAYS },
  { id: 'timeToResolve', label: 'Time to Resolution', extract: timeToResolutionBucket,            domain: ['< 1 day', '1-3 days', '3-7 days', '> 7 days', 'Unresolved'] },
]

export function findDimension(id) {
  return DIMENSIONS.find(d => d.id === id)
}

// ── Date filter presets ──────────────────────────────────────────────────────

function startOfMonth(d) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x }
function startOfQuarter(d) {
  const x = new Date(d); x.setMonth(Math.floor(x.getMonth() / 3) * 3, 1); x.setHours(0,0,0,0); return x
}

export const DATE_FILTERS = [
  { id: 'last7',      label: 'Last 7 days',     predicate: i => REFERENCE_NOW - new Date(i.reportDate) <= 7  * 86400000 },
  { id: 'last30',     label: 'Last 30 days',    predicate: i => REFERENCE_NOW - new Date(i.reportDate) <= 30 * 86400000 },
  { id: 'last90',     label: 'Last 90 days',    predicate: i => REFERENCE_NOW - new Date(i.reportDate) <= 90 * 86400000 },
  { id: 'thisMonth',  label: 'This Month',      predicate: i => new Date(i.reportDate) >= startOfMonth(REFERENCE_NOW) },
  { id: 'thisQuarter',label: 'This Quarter',    predicate: i => new Date(i.reportDate) >= startOfQuarter(REFERENCE_NOW) },
  { id: 'all',        label: 'All time',        predicate: () => true },
]

export function findDateFilter(id) {
  return DATE_FILTERS.find(d => d.id === id)
}

// ── Color palette (consistent across charts) ─────────────────────────────────

export const WORK_CENTER_COLORS = {
  'Carpentry Workshop': '#7FBFEF',
  'Paint':              '#EF6A82',
  'Assembly':           '#5DD3B0',
}

export const PALETTE = [
  '#7FBFEF', '#EF6A82', '#5DD3B0', '#008FE3', '#B79CDF',
  '#F5946D', '#E26370', '#7AC7F1', '#9BE3C1', '#B5D49D',
]

// Assigns stable colors per bucket-key for a given dimension.
// Work-center keys use the established WC palette; everything else uses
// PALETTE in domain order.
export function colorFor(dim, key, index = 0) {
  if (dim?.id === 'workCenter' && WORK_CENTER_COLORS[key]) return WORK_CENTER_COLORS[key]
  if (dim?.id === 'severity') return key === 'Critical' ? '#F9464C' : '#008FE3'
  const domain = dim?.domain
  if (domain) {
    const i = domain.indexOf(key)
    if (i >= 0) return PALETTE[i % PALETTE.length]
  }
  return PALETTE[index % PALETTE.length]
}

// ── Aggregation ──────────────────────────────────────────────────────────────

/**
 * Bucket the incident list by groupBy (X axis) and optionally compareBy
 * (series). Returns rows shaped for recharts:
 *   - No compareBy:        [{ key, value }]                   single series
 *   - With compareBy:      [{ key, [seriesA]: N, [seriesB]: N }]   multi series
 * plus a `seriesKeys` array describing the series in domain order.
 */
export function aggregate(incidents, groupBy, compareBy) {
  if (!groupBy) return { rows: [], seriesKeys: [] }

  // Filter to the buckets we actually saw, in domain order when known
  const seenGroup = new Set(incidents.map(groupBy.extract))
  const groupKeys = groupBy.domain
    ? groupBy.domain.filter(k => seenGroup.has(k))
    : Array.from(seenGroup).sort()

  if (!compareBy) {
    const rows = groupKeys.map(k => ({
      key: k,
      value: incidents.filter(i => groupBy.extract(i) === k).length,
    }))
    return { rows, seriesKeys: [] }
  }

  const seenSeries = new Set(incidents.map(compareBy.extract))
  const seriesKeys = compareBy.domain
    ? compareBy.domain.filter(k => seenSeries.has(k))
    : Array.from(seenSeries).sort()

  const rows = groupKeys.map(k => {
    const row = { key: k }
    for (const s of seriesKeys) {
      row[s] = incidents.filter(
        i => groupBy.extract(i) === k && compareBy.extract(i) === s
      ).length
    }
    return row
  })
  return { rows, seriesKeys }
}
