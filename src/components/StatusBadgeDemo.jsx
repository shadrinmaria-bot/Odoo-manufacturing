import React, { useState } from 'react'
import StatusBadge from './StatusBadge'

const FONT = "'Segoe UI', sans-serif"

function Label({ children }) {
  return (
    <span style={{ fontFamily: FONT, fontSize: 11, color: '#52525B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {children}
    </span>
  )
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 160, flexShrink: 0 }}>
        <Label>{label}</Label>
      </div>
      {children}
    </div>
  )
}

export default function StatusBadgeDemo() {
  const [redOpen,    setRedOpen]    = useState(false)
  const [orangeOpen, setOrangeOpen] = useState(true)

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, padding: 48 }}>

      {/* Title */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: '#F5F5F6', margin: 0, marginBottom: 6 }}>
          StatusBadge Component
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 13, color: '#52525B', margin: 0 }}>
          All 5 states · Click the chevron on interactive demos to toggle
        </p>
      </div>

      {/* States grid */}
      <div style={{
        background: '#18181B',
        border: '1px solid #27272A',
        borderRadius: 12,
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        minWidth: 460,
      }}>

        {/* 1 — Disabled / grey */}
        <Row label="1 · Disabled">
          <StatusBadge label="0 Open incidents" variant="red" isOpen={false} disabled />
        </Row>

        <div style={{ height: 1, background: '#27272A' }} />

        {/* 2 — Red collapsed */}
        <Row label="2 · Red · collapsed">
          <StatusBadge
            label="3 Open incidents"
            variant="red"
            isOpen={false}
            onToggle={() => setRedOpen(true)}
          />
        </Row>

        {/* 3 — Red expanded */}
        <Row label="3 · Red · expanded">
          <StatusBadge
            label="3 Open incidents"
            variant="red"
            isOpen={true}
            onToggle={() => setRedOpen(false)}
          />
        </Row>

        <div style={{ height: 1, background: '#27272A' }} />

        {/* 4 — Orange expanded */}
        <Row label="4 · Orange · expanded">
          <StatusBadge
            label="2 Open incidents"
            variant="orange"
            isOpen={true}
            onToggle={() => setOrangeOpen(false)}
          />
        </Row>

        {/* 5 — Orange collapsed */}
        <Row label="5 · Orange · collapsed">
          <StatusBadge
            label="2 Open incidents"
            variant="orange"
            isOpen={false}
            onToggle={() => setOrangeOpen(true)}
          />
        </Row>

        <div style={{ height: 1, background: '#27272A' }} />

        {/* Interactive live demo */}
        <Row label="Live · Red">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <StatusBadge
              label="3 Open incidents"
              variant="red"
              isOpen={redOpen}
              onToggle={() => setRedOpen(o => !o)}
            />
            <span style={{ fontFamily: FONT, fontSize: 10, color: '#52525B' }}>
              isOpen = {String(redOpen)}
            </span>
          </div>
        </Row>

        <Row label="Live · Orange">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <StatusBadge
              label="2 Open incidents"
              variant="orange"
              isOpen={orangeOpen}
              onToggle={() => setOrangeOpen(o => !o)}
            />
            <span style={{ fontFamily: FONT, fontSize: 10, color: '#52525B' }}>
              isOpen = {String(orangeOpen)}
            </span>
          </div>
        </Row>
      </div>

      {/* API reference */}
      <div style={{ marginTop: 32, background: '#18181B', border: '1px solid #27272A', borderRadius: 8, padding: '16px 24px', minWidth: 460 }}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11.5, color: '#71717A', margin: 0, lineHeight: 1.7 }}>
          <span style={{ color: '#6B3E66' }}>&lt;StatusBadge</span><br />
          {'  '}<span style={{ color: '#FBB945' }}>label</span>=<span style={{ color: '#3CC962' }}>"# Opened Incidents"</span><br />
          {'  '}<span style={{ color: '#FBB945' }}>variant</span>=<span style={{ color: '#3CC962' }}>"red"</span> <span style={{ color: '#52525B' }}>// or "orange"</span><br />
          {'  '}<span style={{ color: '#FBB945' }}>isOpen</span>=<span style={{ color: '#1AD3BB' }}>{'{false}'}</span><br />
          {'  '}<span style={{ color: '#FBB945' }}>onToggle</span>=<span style={{ color: '#1AD3BB' }}>{'{() => {}}'}</span><br />
          <span style={{ color: '#6B3E66' }}>/&gt;</span>
        </p>
      </div>
    </div>
  )
}
