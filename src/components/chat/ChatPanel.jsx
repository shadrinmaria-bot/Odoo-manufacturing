import React, { useState, useRef, useEffect } from 'react'
import './ChatPanel.css'

const CONTACT_NAME    = 'OdooBot'
const CONTACT_INITIAL = 'O'
const USER_INITIAL    = 'P'

const INITIAL_MESSAGES = [
  { id: 'intro',  type: 'intro' },
  { id: 'sep-1',  type: 'separator', label: 'Today' },
  {
    id:   'bot-1',
    type: 'message',
    from: 'bot',
    name: CONTACT_NAME,
    time: '10:32 AM',
    text: 'Hello! How can I help you with the manufacturing dashboard today?',
  },
]

export default function ChatPanel({ isOpen, onClose }) {
  const [messages,     setMessages]     = useState(INITIAL_MESSAGES)
  const [input,        setInput]        = useState('')
  const [minimized,    setMinimized]    = useState(false)
  const [dotsMenuOpen, setDotsMenuOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef    = useRef(null)
  const dotsRef        = useRef(null)

  useEffect(() => {
    if (!dotsMenuOpen) return
    function handleMouseDown(e) {
      if (dotsRef.current && !dotsRef.current.contains(e.target)) setDotsMenuOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [dotsMenuOpen])

  useEffect(() => {
    if (!minimized && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, minimized, isOpen])

  function nowTimeLabel() {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [
      ...prev,
      {
        id:   `user-${Date.now()}`,
        type: 'message',
        from: 'user',
        name: 'You',
        time: nowTimeLabel(),
        text,
      },
    ])
    setInput('')
    textareaRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleHide() {
    setDotsMenuOpen(false)
    onClose()
  }

  function handleCloseAll() {
    setMessages(INITIAL_MESSAGES)
    setMinimized(false)
    setDotsMenuOpen(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={`chat-panel${minimized ? ' chat-panel--minimized' : ' chat-panel--expanded'}`}>

      {/* ── Dots action button ── */}
      <div ref={dotsRef} className="chat-dots-wrapper">
        <button
          className={`chat-dots-btn${dotsMenuOpen ? ' chat-dots-btn--open' : ''}`}
          aria-label="Chat options"
          onClick={() => setDotsMenuOpen(p => !p)}
        >
          <svg width="14" height="4" viewBox="0 0 14 4" fill="currentColor">
            <circle cx="2"  cy="2" r="1.5" />
            <circle cx="7"  cy="2" r="1.5" />
            <circle cx="12" cy="2" r="1.5" />
          </svg>
        </button>
        {dotsMenuOpen && (
          <div className="chat-dots-menu">
            <button className="chat-dots-menu__item" onClick={handleHide}>
              <span>👁</span> Hide all conversations
            </button>
            <button className="chat-dots-menu__item" onClick={handleCloseAll}>
              <span>✕</span> Close all conversations
            </button>
          </div>
        )}
      </div>

      {/* ── Header ── */}
      <div className="chat-header">
        <div className="chat-header__avatar">{CONTACT_INITIAL}</div>

        <div className="chat-header__title">
          {CONTACT_NAME}
          <button className="chat-header__caret" aria-label="Contact options">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="chat-header__actions">
          <button className="chat-header__call-btn" aria-label="Start video call">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5l5 3.5V7l-5 3.5z" />
            </svg>
          </button>
          <button className="chat-header__call-btn" aria-label="Start voice call">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.21a1 1 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" />
            </svg>
          </button>
          <button
            className="chat-header__btn"
            aria-label={minimized ? 'Expand chat' : 'Minimise chat'}
            onClick={() => setMinimized(p => !p)}
          >
            {minimized
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" strokeLinecap="round" /></svg>
            }
          </button>
          <button className="chat-header__btn" aria-label="Close chat" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Body (hidden when minimised) ── */}
      {!minimized && (
        <>
          <div className="chat-messages">
            {messages.map(msg => {
              if (msg.type === 'intro') return (
                <div key={msg.id} className="chat-intro">
                  <div className="chat-intro__avatar">{CONTACT_INITIAL}</div>
                  <div className="chat-intro__name">{CONTACT_NAME}</div>
                  <p className="chat-intro__tagline">
                    This is the start of your direct chat with {CONTACT_NAME}
                  </p>
                </div>
              )

              if (msg.type === 'separator') return (
                <div key={msg.id} className="chat-date-sep">
                  <span className="chat-date-sep__line" />
                  <span className="chat-date-sep__label">{msg.label}</span>
                </div>
              )

              if (msg.type === 'system') return (
                <div key={msg.id} className="chat-sys-event">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.21a1 1 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" />
                  </svg>
                  <span>{msg.text}</span>
                </div>
              )

              return (
                <div key={msg.id} className={`chat-msg chat-msg--${msg.from}`}>
                  <div className={`chat-msg__avatar${msg.from === 'user' ? ' chat-msg__avatar--user' : ''}`}>
                    {msg.from === 'bot' ? CONTACT_INITIAL : USER_INITIAL}
                  </div>
                  <div className="chat-msg__body">
                    <div className="chat-msg__meta">
                      <span className="chat-msg__meta-name">{msg.name}</span>
                      <span className="chat-msg__meta-time">{msg.time}</span>
                    </div>
                    <div className={`chat-msg__bubble chat-msg__bubble--${msg.from}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-bar">
            <button className="chat-input-bar__btn" aria-label="Attach or add">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>

            <textarea
              ref={textareaRef}
              className="chat-input-bar__textarea"
              placeholder={`Message ${CONTACT_NAME}…`}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button className="chat-input-bar__emoji" aria-label="Emoji">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 13s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>

            <button
              className="chat-input-bar__send"
              aria-label="Send message"
              disabled={!input.trim()}
              onClick={sendMessage}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.5 21L23 12 2.5 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
