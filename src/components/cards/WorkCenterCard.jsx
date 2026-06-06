import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import StatusBadge from '../badges/StatusBadge'
import OpenSafetyItemsDropdown from '../incidents/OpenSafetyItemsDropdown'
import Icon from '../shared/Icon'
import { Button, ButtonGroup } from '../shared/Button'
import './WorkCenterCard.css'

// ── StatusDot ─────────────────────────────────────────────────────────────────

function StatusDot({ hasCritical }) {
  return (
    <span className={`status-dot${hasCritical ? ' status-dot--critical' : ''}`} />
  )
}

// ── CustomTooltip ─────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const entry = payload[0]?.payload
  if (!entry?.load) return null
  const squareColor = entry.up != null ? '#60375C' : '#007A76'
  return (
    <div className="wc-tooltip">
      <p style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, background: squareColor, borderRadius: 2, flexShrink: 0 }} />
        <span>Total Load: <strong style={{ color: '#F5F5F6' }}>{entry.load}h</strong></span>
      </p>
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

// ── GreyBadgeDropdown ─────────────────────────────────────────────────────────

function GreyBadgeDropdown({ isOpen, anchorRect, onClose, onReportIncident }) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    function handleMouseDown(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen, onClose])

  if (!isOpen || !anchorRect) return null

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className="grey-badge-dropdown"
      style={{
        '--dropdown-top':   `${anchorRect.bottom + 6}px`,
        '--dropdown-right': `${window.innerWidth - anchorRect.right}px`,
      }}
    >
      <button
        className="grey-badge-dropdown__report-btn"
        onClick={() => { onClose(); onReportIncident?.() }}
      >
        <Icon char="" size={12} />
        REPORT INCIDENT
      </button>
    </div>,
    document.body
  )
}

// ── Derived badge variant ─────────────────────────────────────────────────────

function getVariantFromIncidents(list) {
  if (!list?.length) return 'grey'
  if (list.some(i => i.severity === 'critical')) return 'red'
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

  const incidentCount = incidents.length
  const badgeVariant  = getVariantFromIncidents(incidents)

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
              <BarChart data={center.data} margin={{ top: 4, right: 28, left: 12, bottom: 2 }} barCategoryGap="8%">
                <XAxis
                  dataKey="week"
                  tick={{ fill: '#626363', fontSize: 12, fontFamily: 'Arial, sans-serif', textAnchor: 'middle' }}
                  axisLine={false} tickLine={false}
                  interval={0}
                />
                <YAxis hide domain={[-55, 22]} width={0} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <ReferenceLine y={0} stroke="#60375C" strokeWidth={1.5} />
                <Bar dataKey="up"   stackId="orders" fill="#60375C" isAnimationActive={false}
                  activeBar={{ fill: '#5B3457' }}
                />
                <Bar dataKey="down" stackId="orders" fill="#007A76" isAnimationActive={false}
                  activeBar={{ fill: '#60375C' }}
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
            <div ref={badgeRef}>
              <StatusBadge
                label={`${incidentCount} Incident${incidentCount !== 1 ? 's' : ''}`}
                variant={badgeVariant}
                isOpen={isDropdownOpen}
                onToggle={handleBadgeClick}
              />
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

      {badgeVariant === 'grey' ? (
        <GreyBadgeDropdown
          isOpen={isDropdownOpen}
          anchorRect={anchorRect}
          onClose={onCloseDropdown}
          onReportIncident={onReportIncident}
        />
      ) : (
        <OpenSafetyItemsDropdown
          isOpen={isDropdownOpen}
          anchorRect={anchorRect}
          workCenterName={center.name}
          incidents={incidents}
          onClose={onCloseDropdown}
          onViewIncident={onViewIncident}
          onReportIncident={onReportIncident}
        />
      )}
    </>
  )
}
