import React, { useState, useRef, useEffect } from 'react'
import Icon from '../shared/Icon'
import './TopNav.css'

// ── Nav structure ─────────────────────────────────────────────────────────────

const NAV_STRUCTURE = [
  { label: 'Overview',      items: null },
  { label: 'Operations',    items: ['Manufacturing Orders', 'Work Orders', 'Unbuild Orders', 'Scrap'] },
  { label: 'Planning',      items: ['Gantt', 'Kanban', 'Employee Planning'] },
  { label: 'Products',      items: ['Products', 'Bills of Materials'] },
  { label: 'Reporting',     items: ['Work Orders', 'Safety Statistics', 'Overall Equipment Effectiveness'] },
  { label: 'Configuration', items: ['Settings', 'Work Centers', 'Operations'] },
]

const ENABLED_SUB_ITEMS = new Set(['Reporting/Safety Statistics'])

// ── NavIcons ──────────────────────────────────────────────────────────────────

function NavIcons() {
  return (
    <div className="nav-icons">
      <button className="nav-icon-btn" aria-label="AI">
        <img src="/aiicon.png" width="18" height="18" alt="AI" />
      </button>
      <button className="nav-icon-btn nav-icon-btn--relative" aria-label="Discuss">
        <Icon char="" size={18} color="#F5F5F6" />
        <span className="nav-badge">3</span>
      </button>
      <button className="nav-icon-btn" aria-label="Activity">
        <Icon char="" size={18} color="#F5F5F6" />
      </button>
      <button className="nav-icon-btn" aria-label="Debug">
        <Icon char="" font="odoo" size={18} color="#F5F5F6" />
      </button>
      <span className="nav-separator" />
      <span className="nav-username">ProductDesign</span>
      <div className="nav-avatar">P</div>
    </div>
  )
}

// ── NavSection ────────────────────────────────────────────────────────────────

function NavSection({ section, activePage, openDropdown, onToggleDropdown, onSelect }) {
  const isActive = activePage.section === section.label
  const isOpen = openDropdown === section.label
  const hasItems = !!section.items

  function handleClick() {
    if (!hasItems) onSelect(section.label, null)
    else onToggleDropdown(section.label)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleClick}
        className={`nav-btn${isActive ? ' nav-btn--active' : ''}`}
      >
        {section.label}
      </button>

      {isOpen && hasItems && (
        <div className="nav-dropdown">
          {section.items.map(item => {
            const isSubActive = activePage.section === section.label && activePage.subItem === item
            const itemEnabled = ENABLED_SUB_ITEMS.has(`${section.label}/${item}`)
            return (
              <button
                key={item}
                onClick={itemEnabled ? () => onSelect(section.label, item) : undefined}
                disabled={!itemEnabled}
                className={`nav-dropdown-item${isSubActive ? ' nav-dropdown-item--active' : ''}`}
              >
                {item}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── TopNav ────────────────────────────────────────────────────────────────────

export function TopNav({ activePage, onSelect }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const navRef = useRef(null)

  function toggle(label) {
    setOpenDropdown(prev => (prev === label ? null : label))
  }

  function handleSelect(section, subItem) {
    onSelect(section, subItem)
    setOpenDropdown(null)
  }

  useEffect(() => {
    function handleMouseDown(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null)
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <img src="/logo.png" width="22" height="22" alt="Manufacturing logo" />
        <span className="top-nav__app-name">Manufacturing</span>
      </div>
      <nav ref={navRef} className="top-nav__nav">
        {NAV_STRUCTURE.map(section => (
          <NavSection
            key={section.label}
            section={section}
            activePage={activePage}
            openDropdown={openDropdown}
            onToggleDropdown={toggle}
            onSelect={handleSelect}
          />
        ))}
      </nav>
      <NavIcons />
    </header>
  )
}

// ── SubHeader ─────────────────────────────────────────────────────────────────

export function SubHeader({ onOpenModal }) {
  return (
    <div className="sub-header">
      <div className="sub-header__title-area">
        <span className="sub-header__title">Work Centers Overview</span>
      </div>

      <div className="sub-header__search">
        <Icon char="" size={13} color="#626363" />
        <span className="sub-header__search-placeholder">Search...</span>
        <Icon char="" size={11} color="#626363" />
      </div>

      <div className="sub-header__actions">
        <div className="sub-header__pagination">
          <span>1-3 / 3</span>
          <button className="sub-header__page-btn" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="sub-header__page-btn" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
        <button className="sub-header__report-btn" onClick={onOpenModal}>
          <Icon char="" size={12} />
          REPORT INCIDENT
        </button>
      </div>
    </div>
  )
}

// ── PlaceholderPage ───────────────────────────────────────────────────────────

export function PlaceholderPage({ section, subItem }) {
  return (
    <main className="placeholder-page">
      <div className="placeholder-page__inner">
        <div className="placeholder-page__section">{section}</div>
        <h1 className="placeholder-page__heading">{subItem}</h1>
        <p className="placeholder-page__body">This page hasn't been built yet.</p>
      </div>
    </main>
  )
}
