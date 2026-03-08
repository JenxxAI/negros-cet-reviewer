'use client'
import { useState, useEffect } from 'react'
import { IconX, IconArrowRight } from './Icons'

const STEPS = [
  {
    emoji: '👋',
    title: 'Welcome to NegrosREV!',
    body: 'A free reviewer built for students in Negros Occidental. No signup, no ads — just practice.',
  },
  {
    emoji: '🏫',
    title: 'Pick your school',
    body: 'Scroll down and tap your target school. Each school has subjects tailored to their entrance exam.',
  },
  {
    emoji: '⚡',
    title: 'Two ways to study',
    body: (
      <>
        <strong style={{ color: '#3fb950' }}>Practice Mode</strong> — see the correct answer after each question.<br /><br />
        <strong style={{ color: '#f85149' }}>True Exam Mode</strong> — answers revealed only at the end, just like the real thing.
      </>
    ),
  },
]

export default function TourModal() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('negrev_tour_seen')) setVisible(true)
    } catch {}
  }, [])

  const dismiss = () => {
    try { localStorage.setItem('negrev_tour_seen', '1') } catch {}
    setVisible(false)
  }

  const next = () => {
    if (step + 1 >= STEPS.length) { dismiss(); return }
    setStep(s => s + 1)
  }

  if (!visible) return null

  const s = STEPS[step]
  const isLast = step + 1 >= STEPS.length

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome tour"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={e => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '28px 24px 24px',
        maxWidth: 360,
        width: '100%',
        position: 'relative',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Skip tour"
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'transparent', border: 'none',
            color: 'var(--muted)', cursor: 'pointer',
            padding: 6, borderRadius: 6, display: 'flex',
          }}
        >
          <IconX size={16} />
        </button>

        {/* Emoji */}
        <div style={{ fontSize: 36, marginBottom: 12, textAlign: 'center' }}>{s.emoji}</div>

        {/* Title */}
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, textAlign: 'center' }}>{s.title}</div>

        {/* Body */}
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, textAlign: 'center', marginBottom: 24 }}>
          {s.body}
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6,
              height: 6, borderRadius: 99,
              background: i === step ? 'var(--gold)' : 'var(--border)',
              transition: 'all 0.25s',
            }} />
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!isLast && (
            <button
              onClick={dismiss}
              style={{
                flex: 1, padding: '10px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--muted)',
                fontSize: 13, cursor: 'pointer',
              }}
            >
              Skip
            </button>
          )}
          <button
            onClick={next}
            style={{
              flex: 2, padding: '10px',
              background: 'linear-gradient(135deg, var(--gold), #e8c97a)',
              border: 'none', borderRadius: 8,
              color: '#0d1117', fontWeight: 700,
              fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {isLast ? "Let's go!" : <>Next <IconArrowRight size={13} /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
