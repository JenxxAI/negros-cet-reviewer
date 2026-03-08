'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from '../components/ThemeToggle'
import CoinButton from '../components/CoinButton'
import { supabase } from '../lib/supabase'
import { SCHOOL_LIST as SCHOOLS } from '../lib/schools'
import {
  IconTarget, IconClock, IconBarChart, IconTrendingUp, IconLightbulb, IconSmartphone,
  IconCheck, IconAlertTriangle, IconAward, IconStar, IconFacebook, IconLinkedIn,
  IconHeart, IconMessageSquare, IconSend,
} from '../components/Icons'

const FEATURES = [
  { icon: <IconTarget size={24} color="var(--gold)" />, title: 'School-Specific Exams', desc: 'Practice with questions tailored to your target school\'s exam format' },
  { icon: <IconClock size={24} color="var(--gold)" />, title: 'Timed Mock Exams', desc: 'Simulate the real exam pressure with countdown timers per section' },
  { icon: <IconBarChart size={24} color="var(--gold)" />, title: 'Instant Results', desc: 'Get your score immediately with explanations for every answer' },
  { icon: <IconTrendingUp size={24} color="var(--gold)" />, title: 'Track Progress', desc: 'See your last 5 attempts per subject — scores saved locally, no account needed' },
  { icon: <IconLightbulb size={24} color="var(--gold)" />, title: 'Answer Explanations', desc: 'Understand why each answer is correct, not just memorize' },
  { icon: <IconSmartphone size={24} color="var(--gold)" />, title: 'Mobile Friendly', desc: 'Review anytime, anywhere on any device — even on your phone' },
]

const INPUT_STYLE = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--card2)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '10px 12px',
  color: 'var(--text)', fontSize: 14,
  marginBottom: 10, fontFamily: 'inherit',
}

export default function HomePage() {
  const [fbName, setFbName] = useState('')
  const [fbMsg, setFbMsg] = useState('')
  const [fbState, setFbState] = useState('idle') // idle | sending | sent | error
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [questionCount, setQuestionCount] = useState(null)
  const [showSchools, setShowSchools] = useState(false)
  const [tipTier, setTipTier] = useState(null)

  useEffect(() => {
    supabase.from('questions').select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .then(({ count }) => { if (count) setQuestionCount(count) })
  }, [])

  const submitFeedback = async (e) => {
    e.preventDefault()
    if (!fbMsg.trim()) return
    // Client-side cooldown: 60 s between submissions
    if (lastSubmitTime > 0 && Date.now() - lastSubmitTime < 60_000) {
      setFbState('error')
      return
    }
    setFbState('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fbName.trim() || null, message: fbMsg.trim() }),
      })
      if (!res.ok) throw new Error()
      setFbState('sent')
      setLastSubmitTime(Date.now())
      setFbName('')
      setFbMsg('')
    } catch {
      setFbState('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Skip to main content — keyboard accessibility */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'var(--nav-bg)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)' }}>NegrosREV</span>
          <span className="badge badge-gold">FREE</span>
        </div>
        <ThemeToggle />
      </nav>

      {/* HERO */}
      <main id="main-content">
      <section style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 72px) 20px 56px', maxWidth: 680, margin: '0 auto' }}>
        <div className="badge badge-gold hero-badge" style={{ marginBottom: 20 }}>Community-Based · Free Forever · Negros Occidental</div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          Ace Your College<br /><span className="gold">Entrance Exam</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Free practice reviewer for students applying to colleges and universities in Negros Occidental. No signup required. No ads. Built by a student, for students.
        </p>
        <div className="hero-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/exam" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>Start Practicing Free →</Link>
          <button
            className="btn btn-outline view-schools-hero-btn"
            onClick={() => {
              setShowSchools(true)
              document.getElementById('schools')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >View Schools</button>
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck size={12} color="#3fb950" /> No account needed</span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck size={12} color="#3fb950" /> 100% Free</span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck size={12} color="#3fb950" /> Anonymous</span>
        </p>
      </section>

      {/* STATS BAR */}
      <div style={{ maxWidth: 700, margin: '0 auto 60px', padding: '0 24px' }}>
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-number">{questionCount !== null ? `${questionCount.toLocaleString()}+` : '—'}</div>
            <div className="stat-label">Practice Questions</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number">6</div>
            <div className="stat-label">Schools Covered</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free, No Ads</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Signups Required</div>
          </div>
        </div>
      </div>

      {/* DISCLAIMER */}
      <div style={{ maxWidth: 700, margin: '0 auto 60px', padding: '0 24px' }}>
        <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10, padding: '14px 20px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <IconAlertTriangle size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span><strong style={{ color: 'var(--gold)' }}>Disclaimer:</strong> This is an independent, community-based practice reviewer. It is not affiliated with, endorsed by, or officially connected to any university or college mentioned in this platform. All practice questions are original and do not represent official exam content.</span>
          </div>
        </div>
      </div>

      {/* SCHOOLS */}
      <section id="schools" style={{ background: 'var(--section-alt)', padding: '64px 0 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Supported Schools</h2>
          <p className="muted" style={{ fontSize: 14 }}>Choose your target school and practice with tailored questions</p>
          <button
            className="schools-toggle"
            onClick={() => setShowSchools(s => !s)}
            aria-expanded={showSchools}
          >
            {showSchools ? 'Hide Schools ▲' : 'View Schools ▼'}
          </button>
        </div>
        <div className={showSchools ? 'schools-collapsible' : 'schools-collapsible schools-hidden'}>
        <div className="schools-grid">
          {SCHOOLS.map(school => (
            <Link key={school.name} href={`/exam?school=${school.name.toLowerCase().replace(/\s+/g, '')}`} style={{ textDecoration: 'none' }}>
              <div className="card school-card" style={{ cursor: 'pointer', height: '100%', '--school-color': school.color }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: school.color }}>{school.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{school.full}</div>
                  </div>
                  <span className="badge" style={{ background: `${school.color}20`, color: school.color, border: `1px solid ${school.color}40`, fontSize: 10 }}>
                    {school.exam}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {school.subjects.map(s => (
                    <span key={s} style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--muted)' }}>{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/exam?school=general" style={{ textDecoration: 'none' }}>
            <div className="card school-card" style={{ cursor: 'pointer', background: 'rgba(201,168,76,0.04)', '--school-color': 'var(--gold)' }}>
              <div className="gp-card-inner" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><IconStar size={18} color="var(--gold)" /> General Practice Mode</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>Not sure which school? Practice all subjects that appear in most Negros entrance exams.</div>
                </div>
                <div className="gp-card-tags" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 0 }}>
                  {['Math', 'English', 'Science', 'Logic', 'Filipino', 'Gen. Knowledge'].map(s => (
                    <span key={s} style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>
        </div>
        </div>
      </section>
      <section style={{ padding: '64px 0 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Everything You Need to Prepare</h2>
          <p className="muted" style={{ fontSize: 14 }}>Built with features that actually help you pass</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ display: 'flex', gap: 14 }}>
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>
      <section style={{ background: 'var(--section-alt)', padding: '64px 24px 64px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.3)' }}>
          <div style={{ marginBottom: 16 }}><IconAward size={48} color="var(--gold)" /></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Ready to Start Reviewing?</h2>
          <p className="muted" style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>No account needed. Just pick your school and start practicing. 100% free, always.</p>
          <Link href="/exam" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>Start Now — It's Free →</Link>
        </div>
        </div>
      </section>

      {/* FEEDBACK + TIP JAR */}
      <section style={{ padding: '80px 24px' }}>
        <div className="feedback-tip-row" style={{ maxWidth: 900, margin: '0 auto', justifyContent: 'center' }}>

          {/* Feedback */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <IconMessageSquare size={20} color="var(--gold)" />
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Feedback &amp; Suggestions</h2>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
              Found a bug or have a suggestion? I'd love to hear from you!
            </p>

            {fbState === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '24px 16px', background: 'rgba(63,185,80,0.07)', borderRadius: 10, border: '1px solid rgba(63,185,80,0.2)' }}>
                <IconCheck size={28} color="#3fb950" />
                <div style={{ fontWeight: 700, marginTop: 10, marginBottom: 4 }}>Thank you!</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Your feedback was received.</div>
                <button onClick={() => setFbState('idle')} style={{ marginTop: 14, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 18px', color: 'var(--text)', cursor: 'pointer', fontSize: 13 }}>Send another</button>
              </div>
            ) : (
              <form onSubmit={submitFeedback}>
                <input
                  value={fbName}
                  onChange={e => setFbName(e.target.value)}
                  placeholder="Your name (optional)"
                  maxLength={80}
                  style={INPUT_STYLE}
                />
                <textarea
                  value={fbMsg}
                  onChange={e => setFbMsg(e.target.value)}
                  placeholder="Message, bug report, or suggestion..."
                  required
                  maxLength={1000}
                  rows={3}
                  style={{ ...INPUT_STYLE, resize: 'vertical', marginBottom: 10 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{fbMsg.length}/1000</span>
                  {fbState === 'error' && <span style={{ fontSize: 12, color: '#f85149' }}>Failed — try again.</span>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={fbState === 'sending' || !fbMsg.trim()}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <IconSend size={14} />
                  {fbState === 'sending' ? 'Sending...' : 'Send Feedback'}
                </button>
              </form>
            )}
          </div>

          {/* GCash Tip — single coin button */}
          <div className="card tip-card" style={{ textAlign: 'center', borderColor: tipTier ? 'rgba(0,112,205,0.5)' : 'rgba(0,112,205,0.25)', background: tipTier ? 'rgba(0,112,205,0.07)' : 'rgba(0,112,205,0.04)', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
              <IconHeart size={15} color="#e85d75" />
              <span style={{ fontWeight: 800, fontSize: 15 }}>Support</span>
            </div>

            {!tipTier ? (
              <>
                <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
                  If this helped you, a small tip means a lot{' '}
                  <IconHeart size={11} color="#e85d75" />
                </p>
                <CoinButton
                  amount="Send a Tip"
                  label="via GCash"
                  color="#0070cd"
                  onLanded={() => setTipTier(true)}
                />
              </>
            ) : (
              <div className="tip-reveal">
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>Scan to send a tip via GCash 🙏</div>
                <img
                  src="/gcash_qr.png"
                  alt="Scan to tip via GCash"
                  style={{ display: 'block', margin: '0 auto 10px', borderRadius: 12, width: '100%', maxWidth: 160, boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}
                />
                <button
                  onClick={() => setTipTier(null)}
                  style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 14px', color: 'var(--muted)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}
                >
                  ← hide
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--card)', padding: '48px 24px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Footer grid */}
          <div className="footer-grid">

            {/* Brand column */}
            <div className="footer-col footer-col-brand">
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)', marginBottom: 10 }}>NegrosREV</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, maxWidth: 320 }}>
                Free community-based college entrance reviewer for students in Negros Occidental. Built by a student, for students.
              </p>
              <span className="badge badge-gold" style={{ fontSize: 11 }}>Free Forever · No Ads · No Signup</span>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>Quick Links</div>
              <div className="footer-links-grid">
                <Link href="/exam" className="footer-nav-link">Start Reviewing</Link>
                <Link href="#schools" className="footer-nav-link">Supported Schools</Link>
                <Link href="/exam?school=general" className="footer-nav-link">General Practice</Link>
                <Link href="/exam?school=sunn" className="footer-nav-link">SUNN Reviewer</Link>
                <Link href="/exam?school=tup" className="footer-nav-link">TUP Reviewer</Link>
              </div>
            </div>

            {/* Connect */}
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>Connect</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href="https://www.facebook.com/JenxxAi" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook" title="Facebook">
                  <IconFacebook size={16} color="#1877f2" />
                </a>
                <a href="https://www.linkedin.com/in/carlos-miguel-torres-2644a9332/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn" title="LinkedIn">
                  <IconLinkedIn size={16} color="#0a66c2" />
                </a>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 40, padding: '20px 0' }}>
            <div className="footer-bottom">
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>© 2025 NegrosREV · Carlos Miguel Torres</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Independent project · Not affiliated with any school</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}
