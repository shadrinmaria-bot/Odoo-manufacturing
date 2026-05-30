import React, { useState, useRef, useEffect } from 'react'
import './ChatPanel.css'

const INITIAL_MESSAGES = [
  { id: 'bot-intro', type: 'intro' },
  { id: 'sep-today', type: 'separator', label: 'Today' },
  {
    id: 'bot-1',
    type: 'message',
    from: 'bot',
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

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, type: 'message', from: 'user', text },
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
        <div className="chat-header__avatar">O</div>

        <div className="chat-header__title">
          OdooBot
          <button className="chat-header__caret" aria-label="Bot options">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="chat-header__actions">
          <button
            className="chat-header__btn"
            aria-label={minimized ? 'Expand chat' : 'Minimise chat'}
            onClick={() => setMinimized(p => !p)}
          >
            {minimized
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
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
                  <div className="chat-intro__avatar">O</div>
                  <div className="chat-intro__name">OdooBot</div>
                  <p className="chat-intro__tagline">
                    I&rsquo;m here to help with your manufacturing questions and assist with safety incidents.
                  </p>
                </div>
              )

              if (msg.type === 'separator') return (
                <div key={msg.id} className="chat-date-sep">
                  <span className="chat-date-sep__line" />
                  <span className="chat-date-sep__label">{msg.label}</span>
                  <span className="chat-date-sep__line" />
                </div>
              )

              return (
                <div key={msg.id} className={`chat-msg chat-msg--${msg.from}`}>
                  <div className={`chat-msg__avatar${msg.from === 'user' ? ' chat-msg__avatar--user' : ''}`}>
                    {msg.from === 'bot' ? 'O' : 'P'}
                  </div>
                  <div className={`chat-msg__bubble chat-msg__bubble--${msg.from}`}>
                    {msg.text}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-bar">
            <button className="chat-input-bar__btn" aria-label="Attach or add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </button>

            <textarea
              ref={textareaRef}
              className="chat-input-bar__textarea"
              placeholder="Write a message…"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button className="chat-input-bar__btn" aria-label="Emoji">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
