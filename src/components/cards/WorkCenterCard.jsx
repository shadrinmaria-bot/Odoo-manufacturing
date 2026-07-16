import React, { useState, useRef } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import StatusBadge from '../badges/StatusBadge'
import OpenSafetyItemsDropdown from '../incidents/OpenSafetyItemsDropdown'
import Icon from '../shared/Icon'
import { Button, ButtonGroup } from '../shared/Button'
import './WorkCenterCard.css'

// Weekly load segments. Hours up to the base line are teal; hours past it are
// purple. Hover shades are a step lighter than the resting fill.
const COLOR_LOAD           = '#007A76'
const COLOR_LOAD_HOVER     = '#0A9A94'
const COLOR_EXCESS         = '#60375C'
const COLOR_EXCESS_HOVER   = '#7B4775'

// Headroom above the base line, so the line sits ~2/3 up rather than at the very
// top. Grows in 10h steps if a work center ever books more than this.
const Y_HEADROOM = 60

// ── StatusDot ─────────────────────────────────────────────────────────────────

function StatusDot({ hasCritical }) {
  return (
    <span className={`status-dot${hasCritical ? ' status-dot--critical' : ''}`} />
  )
}

// ── LoadTooltip ───────────────────────────────────────────────────────────────

/**
 * Reports the segment under the cursor, not the column: the teal part reports
 * the week's TOTAL load, the purple part reports only the hours over budget.
 * `hovered` is tracked by the card, because Recharts' tooltip payload alone
 * can't say which half of a stacked bar the pointer is on.
 */
function LoadTooltip({ active, payload, hovered }) {
  if (!active || !payload?.length || !hovered) return null
  const entry = payload[0]?.payload
  if (!entry?.load) return null

  const isExcess = hovered === 'excess'
  if (isExcess && !entry.excess) return null

  return (
    <div className="wc-tooltip">
      <span
        className="wc-tooltip__swatch"
        style={{ background: isExcess ? COLOR_EXCESS : COLOR_LOAD }}
      />
      <span>
        {isExcess ? 'Excess Load' : 'Total Load'}: {isExcess ? entry.excess : entry.load} hours
      </span>
    </div>
  )
}

// ── WorkOrderButtons ──────────────────────────────────────────────────────────

function WorkOrderButtons({ onShowChart }) {
  return (
    <ButtonGroup gap={3}>
      <Button variant="purple" className="btn-work-orders-primary">WORK ORDERS</Button>
      <Button className="btn-work-orders-icon">
        <Icon char="" size={13} />
      </Button>
      <Button onClick={onShowChart} title="View on Safety Statistics" className="btn-work-orders-icon">
        <Icon char="" size={13} />
      </Button>
    </ButtonGroup>
  )
}

// ── Derived badge variant ─────────────────────────────────────────────────────

function getVariantFromIncidents(list) {
  if (!list?.length) return 'grey'
  const unacked = list.filter(i => !i.acknowledged)
  if (!unacked.length) return 'grey'
  if (unacked.some(i => i.severity === 'critical')) return 'red'
  return 'blue'
}

// ── WorkCenterCard ────────────────────────────────────────────────────────────

export default function WorkCenterCard({
  center,
  incidents,
  isDropdownOpen,
  onToggleDropdown,
  onCloseDropdown,
  onViewIncident,
  onShowStats,
  onReportIncident,
}) {
  const badgeRef = useRef(null)
  const [anchorRect, setAnchorRect] = useState(null)
  const [hovered, setHovered] = useState(null)   // 'base' | 'excess' | null

  const incidentCount = incidents.length
  const badgeVariant  = getVariantFromIncidents(incidents)
  const baseLoad      = center.baseLoad ?? 40

  function handleBadgeClick() {
    if (badgeRef.current) setAnchorRect(badgeRef.current.getBoundingClientRect())
    onToggleDropdown()
  }

  return (
    <>
      <div
        className="wc-card"
        style={{ '--accent-color': center.accentColor }}
      >
        {/* Chart layer */}
        <div className="wc-card__chart-layer">
          <div className="wc-card__chart-spacer" />
          <div className="wc-card__chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={center.data}
                margin={{ top: 4, right: 28, left: 12, bottom: 2 }}
                barCategoryGap="8%"
                onMouseLeave={() => setHovered(null)}
              >
                <XAxis
                  dataKey="week"
                  tick={{ fill: '#626363', fontSize: 12, fontFamily: 'Arial, sans-serif', textAnchor: 'middle' }}
                  axisLine={false} tickLine={false}
                  interval={0}
                />
                <YAxis
                  hide width={0}
                  domain={[0, dataMax => Math.max(Y_HEADROOM, Math.ceil(dataMax / 10) * 10)]}
                />
                <Tooltip
                  content={<LoadTooltip hovered={hovered} />}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <ReferenceLine y={baseLoad} stroke={COLOR_EXCESS} strokeWidth={1.5} />
                <Bar
                  dataKey="base" stackId="load" fill={COLOR_LOAD}
                  isAnimationActive={false}
                  activeBar={{ fill: COLOR_LOAD_HOVER }}
                  onMouseEnter={() => setHovered('base')}
                />
                <Bar
                  dataKey="excess" stackId="load" fill={COLOR_EXCESS}
                  isAnimationActive={false}
                  activeBar={{ fill: COLOR_EXCESS_HOVER }}
                  onMouseEnter={() => setHovered('excess')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accent line */}
        <div className="wc-card__accent" />

        {/* Content layer */}
        <div className="wc-card__content">
          {/* Header */}
          <div className="wc-card__header">
            <div className="wc-card__header-left">
              <StatusDot hasCritical={badgeVariant === 'red'} />
              <span className="wc-card__name">{center.name}</span>
            </div>
            {/* With no incidents the badge is hidden to keep the board quiet;
                a grey alert triangle fades in on card hover so you can still
                report against this specific work center. */}
            <div ref={badgeRef}>
              {incidentCount === 0 ? (
                <button
                  type="button"
                  className="wc-card__report-hint"
                  title={`Report an incident at ${center.name}`}
                  aria-label={`Report an incident at ${center.name}`}
                  onClick={() => onReportIncident?.(center.id)}
                >
                  <Icon char={"\uF071"} size={15} />
                </button>
              ) : (
                <StatusBadge
                  label={`${incidentCount} Incident${incidentCount !== 1 ? 's' : ''}`}
                  variant={badgeVariant}
                  isOpen={isDropdownOpen}
                  onToggle={handleBadgeClick}
                />
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="wc-card__stats">
            <WorkOrderButtons onShowChart={onShowStats} />
            <div className="wc-card__stats-spacer" />
            <div className="wc-card__oee-block">
              <div className="wc-card__oee-left">
                {center.statusLabel && (
                  <span className="wc-card__status-label">{center.statusLabel}</span>
                )}
                <span className="wc-card__oee-label">OEE</span>
              </div>
              <div className="wc-card__oee-right">
                {center.statusCount !== null && (
                  <span className="wc-card__status-count">{center.statusCount}</span>
                )}
                <span className="wc-card__oee-value">{center.oee}%</span>
              </div>
            </div>
          </div>

          <div className="wc-card__flex-fill" />
        </div>
      </div>

      {incidentCount > 0 && (
        <OpenSafetyItemsDropdown
          isOpen={isDropdownOpen}
          anchorRect={anchorRect}
          workCenterName={center.name}
          incidents={incidents}
          onClose={onCloseDropdown}
          onViewIncident={onViewIncident}
          onReportIncident={() => onReportIncident?.(center.id)}
        />
      )}
    </>
  )
}
