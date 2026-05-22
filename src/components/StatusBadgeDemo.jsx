import React, { useState } from 'react'
import StatusBadge from './StatusBadge'

const FONT = "'Segoe UI', sans-serif"

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 168, flexShrink: 0 }}>
        <span style={{ fontFamily: FONT, fontSize: 11, color: '#52525B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: '#27272A' }} />
}

export default function StatusBadgeDemo() {
  const [redOpen,    setRedOpen]    = useState(false)
  const [orangeOpen, setOrangeOpen] = useState(true)
  const [greenOpen,  setGreenOpen]  = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>

      {/* Title */}
      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <h1 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: '#F5F5F6', margin: '0 0 6px' }}>
          StatusBadge Component
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 13, color: '#52525B', margin: 0 }}>
          Two-part pill · 123×22px · Click chevron to toggle
        </p>
      </div>

      {/* States panel */}
      <div style={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 12, padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 20, minWidth: 480 }}>

        {/* State 1 – Red collapsed */}
        <Row label="1 · Red · collapsed">
          <StatusBadge label="3 Open incidents" variant="red" isOpen={false} onToggle={() => {}} />
        </Row>

        {/* State 2 – Red expanded */}
        <Row label="2 · Red · expanded">
          <StatusBadge label="3 Open incidents" variant="red" isOpen={true} onToggle={() => {}} />
        </Row>

        <Divider />

        {/* State 3 – Orange expanded */}
        <Row label="3 · Orange · expanded">
          <StatusBadge label="2 Open incidents" variant="orange" isOpen={true} onToggle={() => {}} />
        </Row>

        {/* State 4 – Orange collapsed */}
        <Row label="4 · Orange · collapsed">
          <StatusBadge label="2 Open incidents" variant="orange" isOpen={false} onToggle={() => {}} />
        </Row>

        <Divider />

        {/* State 5 – Green collapsed */}
        <Row label="5 · Green · collapsed">
          <StatusBadge label="0 Open incidents" variant="green" isOpen={false} onToggle={() => {}} />
        </Row>

        <Divider />

        {/* Live interactive demos */}
        <Row label="Live · Red">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <StatusBadge label="3 Open incidents" variant="red" isOpen={redOpen} onToggle={() => setRedOpen(o => !o)} />
            <span style={{ fontFamily: FONT, fontSize: 10, color: '#52525B' }}>isOpen = {String(redOpen)}</span>
          </div>
        </Row>

        <Row label="Live · Orange">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <StatusBadge label="2 Open incidents" variant="orange" isOpen={orangeOpen} onToggle={() => setOrangeOpen(o => !o)} />
            <span style={{ fontFamily: FONT, fontSize: 10, color: '#52525B' }}>isOpen = {String(orangeOpen)}</span>
          </div>
        </Row>

        <Row label="Live · Green">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <StatusBadge label="0 Open incidents" variant="green" isOpen={greenOpen} onToggle={() => setGreenOpen(o => !o)} />
            <span style={{ fontFamily: FONT, fontSize: 10, color: '#52525B' }}>isOpen = {String(greenOpen)}</span>
          </div>
        </Row>
      </div>

      {/* API reference */}
      <div style={{ marginTop: 28, background: '#18181B', border: '1px solid #27272A', borderRadius: 8, padding: '14px 22px', minWidth: 480 }}>
        <pre style={{ fontFamily: "'Courier New', monospace", fontSize: 11.5, color: '#71717A', margin: 0, lineHeight: 1.75 }}>{
`<StatusBadge
  label="# Opened Incidents"
  variant="red"    {/* "red" | "orange" | "green" */}
  isOpen={false}
  onToggle={() => {}}
/>`
        }</pre>
      </div>
    </div>
  )
}
