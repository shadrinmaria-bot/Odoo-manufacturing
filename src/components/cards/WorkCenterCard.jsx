import React, { useState, useRef } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import StatusBadge from '../badges/StatusBadge'
import OpenSafetyItemsDropdown from '../incidents/OpenSafetyItemsDropdown'
import Icon from '../shared/Icon'
import { Button, ButtonGroup } from '../shared/Button'
import './WorkCenterCard.css'

// Weekly load segments. Hours up to the base line are teal; hours past it are
// purple.
//
// Hover shading follows Odoo exactly, and it is not uniform:
//   • teal WITH excess stacked above it → turns purple, so the whole column
//     reads as one purple bar
//   • teal with NO excess              → just darkens
//   • the excess block                 → just darkens
// Both "darken" steps use the same ×0.947 factor, so they feel identical.
const COLOR_LOAD        = '#007A76'
const COLOR_LOAD_DARK   = '#007470'
const COLOR_EXCESS      = '#60375C'
const COLOR_EXCESS_DARK = '#5B3457'

// Headroom above the base line, so the line sits ~2/3 up rather than at the very
// top. Grows in 10h steps if a work center ever books more than this.
const Y_HEADROOM = 60

// Tooltip placement relative to the cursor. TIP_WIDTH only needs to be close —
// it decides when to flip the tooltip to the left of the pointer near the right
// edge of the card.
const TIP_OFFSET = 14
const TIP_WIDTH  = 150

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
    <ButtonGroup gap={1} className="wc-card__buttons">
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
  const chartAreaRef = useRef(null)
  const [anchorRect, setAnchorRect] = useState(null)
  const [hovered, setHovered] = useState(null)   // { series: 'base'|'excess', index } | null
  const [cursor, setCursor] = useState(null)     // { x, y, w } in chart space

  // Recharts anchors the tooltip to the data point — the top-centre of the bar —
  // so it sits still while the pointer moves inside a bar. Feeding it the live
  // cursor instead makes it track the mouse; the wrapper's transform transition
  // then eases it along rather than teleporting.
  const tipPos = cursor
    ? {
        x: cursor.w && cursor.x + TIP_OFFSET + TIP_WIDTH > cursor.w
          ? cursor.x - TIP_WIDTH - TIP_OFFSET     // flip left near the right edge
          : cursor.x + TIP_OFFSET,
        y: Math.max(0, cursor.y - TIP_OFFSET),
      }
    : undefined

  const incidentCount = incidents.length
  const badgeVariant  = getVariantFromIncidents(incidents)
  const baseLoad      = center.baseLoad ?? 40

  const isHovered  = (series, i) => hovered?.series === series && hovered.index === i
  const baseFill   = (d, i) => !isHovered('base', i)
    ? COLOR_LOAD
    : (d.excess ? COLOR_EXCESS : COLOR_LOAD_DARK)
  const excessFill = (d, i) => isHovered('excess', i) ? COLOR_EXCESS_DARK : COLOR_EXCESS

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
          <div className="wc-card__chart-area" ref={chartAreaRef}>
            <ResponsiveContainer width="100%" height="100%">
              {/* barCategoryGap is subtracted from BOTH sides of each band, so
                  15% leaves the bar at 1 - 2×15% = 70% of its column — the ratio
                  the reference screenshot uses. */}
              <BarChart
                data={center.data}
                // No margins: the plot, and with it the base line, runs the full
                // width of the card exactly as it does in Odoo.
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barCategoryGap="15%"
                onMouseMove={(state) => {
                  if (state?.chartX == null) return
                  setCursor({ x: state.chartX, y: state.chartY, w: chartAreaRef.current?.offsetWidth ?? 0 })
                }}
                onMouseLeave={() => { setHovered(null); setCursor(null) }}
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
                  content={<LoadTooltip hovered={hovered?.series} />}
                  cursor={false}
                  position={tipPos}
                  animationDuration={220}
                  animationEasing="ease-out"
                />
                <ReferenceLine y={baseLoad} stroke={COLOR_EXCESS} strokeWidth={1.5} />
                <Bar
                  dataKey="base" stackId="load"
                  isAnimationActive={false} activeBar={false}
                  onMouseEnter={(_, index) => setHovered({ series: 'base', index })}
                  onMouseLeave={() => setHovered(null)}
                >
                  {center.data.map((d, i) => (
                    <Cell key={`base-${i}`} fill={baseFill(d, i)} />
                  ))}
                </Bar>
                <Bar
                  dataKey="excess" stackId="load"
                  isAnimationActive={false} activeBar={false}
                  onMouseEnter={(_, index) => setHovered({ series: 'excess', index })}
                  onMouseLeave={() => setHovered(null)}
                >
                  {center.data.map((d, i) => (
                    <Cell key={`excess-${i}`} fill={excessFill(d, i)} />
                  ))}
                </Bar>
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
