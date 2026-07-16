// ────────────────────────────────────────────────────────────────────────────
// Seed incident history for the Safety Statistics page.
//
// These are the incidents that already happened before the prototype is opened.
// Incidents you report from the Overview get appended at runtime — the
// dashboard passes seeds + reported incidents into SafetyStatisticsPage — so
// the chart always shows history plus whatever you filed this session.
//
// Every seed row is RESOLVED, on purpose. That keeps two things true:
//   • the Overview boots with grey "0 Incidents" badges, because seeds are
//     history and never enter a card's open-items list;
//   • the "Unresolved" bucket under Time to Resolution fills only with
//     incidents you actually report, which are genuinely still open.
//
// All vocabulary is imported from ./vocabulary — the same terms the report form
// uses — so a reported incident buckets identically to a seeded one. Do not
// hardcode injury/action/job-title strings in here again; that is exactly how
// this file drifted out of sync with the form last time.
//
// Dates are anchored to REFERENCE_NOW rather than the real clock so the chart
// looks identical on every machine and in every demo. Bump the constant to
// "advance time" — keep it near the real date so reported incidents (which use
// the real clock) land inside the seeded window.
// ────────────────────────────────────────────────────────────────────────────

import {
  WORKERS, INJURY_TYPES, ACTIONS,
  REPORTABLE_WORK_CENTERS,
  injuryShortLabel,
} from './vocabulary.js'

export const REFERENCE_NOW = new Date('2026-07-16T17:00:00')

// ── Domains (derived from the shared vocabulary) ─────────────────────────────

export const WORK_CENTERS = REPORTABLE_WORK_CENTERS.map(wc => wc.label)
export const WAREHOUSES   = [...new Set(REPORTABLE_WORK_CENTERS.map(wc => wc.warehouseLocation))].sort()
export const JOB_TITLES   = [...new Set(WORKERS.map(w => w.title))]
export const INJURY_SHORT_LABELS = INJURY_TYPES.map(t => t.short)
export const SEVERITIES   = ['critical', 'attention']

// ── Deterministic generation ─────────────────────────────────────────────────
// A fixed-seed PRNG, so the dataset is byte-identical on every run and every
// machine while still being tunable through the weight tables below.

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Weighted pick. A weight of 0 means "never choose this". */
function pick(rand, items, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rand() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r < 0) return items[i]
  }
  return items[items.length - 1]
}

function randInt(rand, min, max) {
  return min + Math.floor(rand() * (max - min + 1))
}

// How many incidents land in each age band, and the day range of each band.
// Tuned so every date filter on the toolbar returns a sensible count. Measured
// against REFERENCE_NOW = 2026-07-16:
//   Last 7 days 6 · This Month 11 · This Quarter 11 · This Year 59 · All time 80
// (This Month and This Quarter match because REFERENCE_NOW sits in the first
// month of Q3. Re-measure these after bumping REFERENCE_NOW.)
const AGE_BANDS = [
  { count: 6,  minDays: 0,   maxDays: 6   },
  { count: 12, minDays: 7,   maxDays: 29  },
  { count: 18, minDays: 30,  maxDays: 89  },
  { count: 20, minDays: 90,  maxDays: 179 },
  // Capped at 349 rather than 364: reaching a full 365 days back would spill
  // into a 13th calendar month, one day wide.
  { count: 24, minDays: 180, maxDays: 349 },
]

// Carpentry is the busiest floor, Assembly the quietest.
const WC_WEIGHTS = [40, 34, 26]

// Injury mix. `critical` is the share of that injury which is severe — falls to
// a lower level and machine entrapment are far likelier to be critical than a
// repetitive-strain report, which makes "Compare by: Severity" tell a story.
const INJURY_MIX = {
  'overexertion':    { weight: 14, critical: 0.15 },
  'other-exertions': { weight: 9,  critical: 0.10 },
  'repetitive':      { weight: 11, critical: 0.05 },
  'fall-same':       { weight: 12, critical: 0.20 },
  'roadway':         { weight: 4,  critical: 0.55 },
  'struck-against':  { weight: 8,  critical: 0.18 },
  'struck-by':       { weight: 13, critical: 0.35 },
  'slip':            { weight: 10, critical: 0.12 },
  'fall-lower':      { weight: 6,  critical: 0.60 },
  'caught':          { weight: 5,  critical: 0.65 },
}

// "Other..." is free text typed by a reporter, so it is never seeded.
const SEED_INJURIES = INJURY_TYPES.filter(t => t.id !== 'other')

// Shop-floor staff get hurt; the CEO (weight 0) does not. She stays selectable
// in the report form — she just never appears in the seeded history.
const WORKER_WEIGHTS = WORKERS.map(w => (w.title === 'Chief Executive Officer' ? 0 : 15))

// Time-of-day bands, so all four "Time of Day" buckets are represented.
const TIME_BANDS = [
  { from: 6,  to: 11, weight: 38 },  // Morning
  { from: 12, to: 17, weight: 40 },  // Afternoon
  { from: 18, to: 23, weight: 16 },  // Evening
  { from: 0,  to: 5,  weight: 6  },  // Night
]

const ACTION_WEIGHTS = [18, 16, 8, 5, 14, 11, 7, 9, 6, 8, 5, 7]

function buildSeedIncidents() {
  const rand = mulberry32(20260716)
  const out = []
  let n = 0

  for (const band of AGE_BANDS) {
    for (let k = 0; k < band.count; k++) {
      n++
      const injury   = pick(rand, SEED_INJURIES, SEED_INJURIES.map(t => INJURY_MIX[t.id].weight))
      const severity = rand() < INJURY_MIX[injury.id].critical ? 'critical' : 'attention'
      const wc       = pick(rand, REPORTABLE_WORK_CENTERS, WC_WEIGHTS)
      const worker   = pick(rand, WORKERS, WORKER_WEIGHTS)
      const timeBand = pick(rand, TIME_BANDS, TIME_BANDS.map(b => b.weight))
      const action   = pick(rand, ACTIONS, ACTION_WEIGHTS)

      const daysAgo = randInt(rand, band.minDays, band.maxDays)
      const hour    = randInt(rand, timeBand.from, timeBand.to)
      const minute  = randInt(rand, 0, 3) * 15

      // Incident happens, and is reported roughly an hour later.
      let incidentTime = shiftDays(REFERENCE_NOW, -daysAgo, hour, minute)
      if (incidentTime > REFERENCE_NOW) incidentTime = shiftDays(incidentTime, -1, hour, minute)
      const reportDate = new Date(incidentTime.getTime() + 60 * 60 * 1000)

      // Critical incidents take longer to close out. Resolution can never land
      // in the future, so it is capped at the incident's own age.
      const wanted     = severity === 'critical' ? randInt(rand, 2, 14) : randInt(rand, 0, 4)
      const resolveIn  = Math.min(wanted, daysAgo)
      let resolvedAt   = new Date(reportDate.getTime() + resolveIn * 86400000 + randInt(rand, 1, 6) * 3600000)
      if (resolvedAt > REFERENCE_NOW) resolvedAt = new Date(REFERENCE_NOW.getTime() - 3600000)

      out.push({
        id:           `s${String(n).padStart(2, '0')}`,
        reportDate:   reportDate.toISOString(),
        incidentTime: incidentTime.toISOString(),
        resolvedAt:   resolvedAt.toISOString(),
        workCenter:   wc.label,
        warehouse:    wc.warehouseLocation,
        injuryType:   { id: injury.id, label: injury.label },
        injuredWorker: worker.label,
        workerId:     worker.workerId,
        jobTitle:     worker.title,
        severity,
        actionsTaken: action,
      })
    }
  }
  return out
}

function shiftDays(base, days, hour, minute) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d
}

export const SEED_INCIDENTS = buildSeedIncidents()

// Back-compat alias: the statistics page takes its list as a prop now, but
// falls back to this when rendered standalone.
export const INCIDENTS = SEED_INCIDENTS

// ── Dimensions — each is { id, label, extract: (incident) => bucketLabel } ──

const MONTHS   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function monthKey(d)   { return `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` }
function monthOf(iso)  { return monthKey(new Date(iso)) }
function dayOfWeek(iso) { return WEEKDAYS[new Date(iso).getDay()] }
function hourOf(iso)   { return new Date(iso).getHours() }

// Chronological month domain. Alphabetical sorting would order a 12-month span
// as Apr, Aug, Dec… — the year suffix also stops Aug '25 colliding with Aug '26.
// Extends past REFERENCE_NOW when the real clock has moved on, so incidents
// reported today always have a column to land in.
function buildMonthDomain() {
  const cur = new Date(REFERENCE_NOW)
  cur.setDate(1)
  cur.setMonth(cur.getMonth() - 11)
  cur.setHours(0, 0, 0, 0)
  const realNow = new Date()
  const end = realNow > REFERENCE_NOW ? realNow : REFERENCE_NOW
  const out = []
  while (cur <= end && out.length < 36) {
    out.push(monthKey(cur))
    cur.setMonth(cur.getMonth() + 1)
  }
  return out
}

export const MONTH_DOMAIN = buildMonthDomain()

function timeOfDayBucket(iso) {
  const h = hourOf(iso)
  if (h >= 6  && h < 12) return 'Morning (6-12)'
  if (h >= 12 && h < 18) return 'Afternoon (12-18)'
  if (h >= 18 && h < 24) return 'Evening (18-24)'
  return 'Night (0-6)'
}

function timeToResolutionBucket(i) {
  if (!i.resolvedAt) return 'Unresolved'
  const days = (new Date(i.resolvedAt) - new Date(i.incidentTime)) / 86400000
  if (days < 1) return '< 1 day'
  if (days < 3) return '1-3 days'
  if (days < 7) return '3-7 days'
  return '> 7 days'
}

export const DIMENSIONS = [
  { id: 'workCenter',    label: 'Work Center',        extract: i => i.workCenter,                    domain: WORK_CENTERS },
  { id: 'injuryType',    label: 'Injury Type',        extract: i => injuryShortLabel(i.injuryType),  domain: INJURY_SHORT_LABELS },
  { id: 'jobTitle',      label: 'Job Title',          extract: i => i.jobTitle,                      domain: JOB_TITLES },
  { id: 'location',      label: 'Location',           extract: i => i.warehouse,                     domain: WAREHOUSES },
  { id: 'severity',      label: 'Severity',           extract: i => i.severity === 'critical' ? 'Critical' : 'Needs Attention', domain: ['Critical', 'Needs Attention'] },
  { id: 'actions',       label: 'Actions Taken',      extract: i => i.actionsTaken,                  domain: ACTIONS },
  { id: 'timeOfDay',     label: 'Time of Day',        extract: i => timeOfDayBucket(i.incidentTime), domain: ['Morning (6-12)', 'Afternoon (12-18)', 'Evening (18-24)', 'Night (0-6)'] },
  { id: 'month',         label: 'Month',              extract: i => monthOf(i.reportDate),           domain: MONTH_DOMAIN },
  { id: 'dayOfWeek',     label: 'Day of Week',        extract: i => dayOfWeek(i.reportDate),         domain: WEEKDAYS },
  { id: 'timeToResolve', label: 'Time to Resolution', extract: timeToResolutionBucket,               domain: ['< 1 day', '1-3 days', '3-7 days', '> 7 days', 'Unresolved'] },
]

export function findDimension(id) {
  return DIMENSIONS.find(d => d.id === id)
}

// ── Date filter presets ──────────────────────────────────────────────────────

function startOfMonth(d)   { const x = new Date(d); x.setDate(1); x.setHours(0, 0, 0, 0); return x }
function startOfQuarter(d) { const x = new Date(d); x.setMonth(Math.floor(x.getMonth() / 3) * 3, 1); x.setHours(0, 0, 0, 0); return x }
function startOfYear(d)    { const x = new Date(d); x.setMonth(0, 1); x.setHours(0, 0, 0, 0); return x }

export const DATE_FILTERS = [
  { id: 'last7',       label: 'Last 7 days',              predicate: i => REFERENCE_NOW - new Date(i.reportDate) <= 7  * 86400000 },
  { id: 'last7ByDay',  label: 'Last 7 days (by weekday)', predicate: i => REFERENCE_NOW - new Date(i.reportDate) <= 7  * 86400000 },
  { id: 'last30',      label: 'Last 30 days',             predicate: i => REFERENCE_NOW - new Date(i.reportDate) <= 30 * 86400000 },
  { id: 'last90',      label: 'Last 90 days',             predicate: i => REFERENCE_NOW - new Date(i.reportDate) <= 90 * 86400000 },
  { id: 'thisMonth',   label: 'This Month',               predicate: i => new Date(i.reportDate) >= startOfMonth(REFERENCE_NOW) },
  { id: 'thisQuarter', label: 'This Quarter',             predicate: i => new Date(i.reportDate) >= startOfQuarter(REFERENCE_NOW) },
  { id: 'thisYear',    label: 'This Year',                predicate: i => new Date(i.reportDate) >= startOfYear(REFERENCE_NOW) },
  { id: 'all',         label: 'All time',                 predicate: () => true },
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
  '#C9A0DC', '#8FD4C1',
]

/** Stable 32-bit hash of a string, so a key always maps to the same palette slot. */
function hashKey(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

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
    // Out-of-domain key — e.g. a write-in "Actions Taken" that isn't one of the
    // suggestions. Colour it from the key itself rather than the caller's row
    // index: those are different index spaces, so using the row would both
    // steal a real bucket's colour and change as the date filter changes which
    // rows are visible.
    return PALETTE[hashKey(String(key)) % PALETTE.length]
  }
  return PALETTE[index % PALETTE.length]
}

// ── Aggregation ──────────────────────────────────────────────────────────────

/**
 * Bucket the incident list by groupBy (X axis) and optionally compareBy
 * (series). Returns rows shaped for recharts:
 *   - No compareBy:        [{ key, value }]                          single series
 *   - With compareBy:      [{ key, [seriesA]: N, [seriesB]: N }]     multi series
 * plus a `seriesKeys` array describing the series in domain order.
 */
export function aggregate(incidents, groupBy, compareBy) {
  if (!groupBy) return { rows: [], seriesKeys: [] }

  // Keep only the buckets we actually saw, in domain order when known. Buckets
  // outside the domain are appended rather than dropped, so a value the domain
  // does not anticipate still shows up instead of silently vanishing.
  const seenGroup = new Set(incidents.map(groupBy.extract))
  const groupKeys = groupBy.domain
    ? [
        ...groupBy.domain.filter(k => seenGroup.has(k)),
        ...[...seenGroup].filter(k => !groupBy.domain.includes(k)).sort(),
      ]
    : [...seenGroup].sort()

  if (!compareBy) {
    const rows = groupKeys.map(k => ({
      key: k,
      value: incidents.filter(i => groupBy.extract(i) === k).length,
    }))
    return { rows, seriesKeys: [] }
  }

  const seenSeries = new Set(incidents.map(compareBy.extract))
  const seriesKeys = compareBy.domain
    ? [
        ...compareBy.domain.filter(k => seenSeries.has(k)),
        ...[...seenSeries].filter(k => !compareBy.domain.includes(k)).sort(),
      ]
    : [...seenSeries].sort()

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
