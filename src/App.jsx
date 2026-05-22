import { useState } from 'react'
import ManufacturingDashboard from './components/ManufacturingDashboard'
import StatusBadgeDemo from './components/StatusBadgeDemo'

const FONT = "'Segoe UI', sans-serif"

export default function App() {
  const [view, setView] = useState('dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#1B1D26' }}>
      {/* Dev switcher */}
      <div style={{
        position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
        display: 'flex', gap: 6,
      }}>
        {[['dashboard', 'Dashboard'], ['badge', 'StatusBadge Demo']].map(([id, lbl]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            style={{
              fontFamily: FONT, fontSize: 12, fontWeight: 600,
              padding: '6px 14px', borderRadius: 6, border: 'none',
              cursor: 'pointer',
              background: view === id ? '#6B3E66' : '#262A36',
              color: view === id ? '#fff' : '#71717A',
              transition: 'all 0.15s',
            }}
          >
            {lbl}
          </button>
        ))}
      </div>

      {view === 'dashboard' ? <ManufacturingDashboard /> : <StatusBadgeDemo />}
    </div>
  )
}
