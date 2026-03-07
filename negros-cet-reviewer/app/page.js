'use client'
import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '../components/ThemeToggle'
import { supabase } from '../lib/supabase'
import {
  IconTarget, IconClock, IconBarChart, IconTrendingUp, IconLightbulb, IconSmartphone,
  IconCheck, IconAlertTriangle, IconAward, IconStar, IconFacebook, IconLinkedIn,
  IconHeart, IconMessageSquare, IconSend,
} from '../components/Icons'

const SCHOOLS = [
  { name: 'SUNN', full: 'State University of Northern Negros', exam: 'General Aptitude Test', subjects: ['Logic', 'Math', 'Gen. Knowledge'], color: '#3fb950' },
  { name: 'TUP', full: 'Technological University of the Philippines', exam: 'TUPSTAT', subjects: ['Math', 'English', 'Science', 'Technical'], color: '#58a6ff' },
  { name: 'CHMSU', full: 'Carlos Hilado Memorial State University', exam: 'CHMSUET', subjects: ['Math', 'English', 'Science'], color: '#c9a84c' },
  { name: 'PNU', full: 'Philippine Normal University', exam: 'PNUAT', subjects: ['Math', 'English', 'Gen. Info'], color: '#bc8cff' },
  { name: 'La Salle', full: 'La Salle College', exam: 'Entrance Exam', subjects: ['Math', 'English', 'Science', 'Logic'], color: '#f85149' },
  { name: 'CSA', full: 'Colegio San Agustin', exam: 'Entrance Exam', subjects: ['Math', 'English', 'Science'], color: '#ff9500' },
]

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

  const submitFeedback = async (e) => {
    e.preventDefault()
    if (!fbMsg.trim()) return
    setFbState('sending')
    const { error } = await supabase.from('feedback').insert({
      name: fbName.trim() || null,
      message: fbMsg.trim(),
    })
    if (error) {
      setFbState('error')
    } else {
      setFbState('sent')
      setFbName('')
      setFbMsg('')
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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ThemeToggle />
          <Link href="/exam" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Start Reviewing →</Link>
        </div>
      </nav>

      {/* HERO */}
      <main id="main-content">
      <section style={{ textAlign: 'center', padding: '72px 20px 56px', maxWidth: 680, margin: '0 auto' }}>
        <div className="badge badge-gold" style={{ marginBottom: 20, fontSize: 12 }}>Community-Based · Free Forever · Negros Occidental</div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          Ace Your College<br /><span className="gold">Entrance Exam</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Free practice reviewer for students applying to colleges and universities in Negros Occidental. No signup required. No ads. Built by a student, for students.
        </p>
        <div className="hero-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/exam" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>Start Practicing Free →</Link>
          <Link href="#schools" className="btn btn-outline" style={{ fontSize: 16, padding: '14px 32px' }}>View Schools</Link>
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck size={12} color="#3fb950" /> No account needed</span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck size={12} color="#3fb950" /> 100% Free</span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck size={12} color="#3fb950" /> Anonymous</span>
        </p>
      </section>

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
      <section id="schools" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Supported Schools</h2>
          <p className="muted" style={{ fontSize: 14 }}>Choose your target school and practice with tailored questions</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
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

        {/* General Practice */}
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
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
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
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 60px', textAlign: 'center' }}>
        <div className="card" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.3)' }}>
          <div style={{ marginBottom: 16 }}><IconAward size={48} color="var(--gold)" /></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Ready to Start Reviewing?</h2>
          <p className="muted" style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>No account needed. Just pick your school and start practicing. 100% free, always.</p>
          <Link href="/exam" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>Start Now — It's Free →</Link>
        </div>
      </section>

      {/* FEEDBACK */}
      <section id="feedback" style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 60px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <IconMessageSquare size={20} color="var(--gold)" />
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Feedback &amp; Suggestions</h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
            Found a bug? Want more questions for a specific school? Have a suggestion? I'd love to hear from you!
          </p>

          {fbState === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '28px 16px', background: 'rgba(63,185,80,0.07)', borderRadius: 10, border: '1px solid rgba(63,185,80,0.2)' }}>
              <IconCheck size={32} color="#3fb950" />
              <div style={{ fontWeight: 700, marginTop: 10, marginBottom: 4 }}>Thank you!</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Your feedback was received. I appreciate it!</div>
              <button onClick={() => setFbState('idle')} style={{ marginTop: 16, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 20px', color: 'var(--text)', cursor: 'pointer', fontSize: 13 }}>Send another</button>
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
                placeholder="Write your message, bug report, or suggestion here..."
                required
                maxLength={1000}
                rows={4}
                style={{ ...INPUT_STYLE, resize: 'vertical', marginBottom: 12 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{fbMsg.length}/1000</span>
                {fbState === 'error' && <span style={{ fontSize: 12, color: '#f85149' }}>Failed — please try again.</span>}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={fbState === 'sending' || !fbMsg.trim()}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <IconSend size={14} />
                {fbState === 'sending' ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* SUPPORT / TIP JAR */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <div className="card" style={{ borderColor: 'rgba(0,112,205,0.25)', background: 'rgba(0,112,205,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <IconHeart size={18} color="#e85d75" />
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Support the Developer</h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24, lineHeight: 1.6, maxWidth: 440, margin: '0 auto 24px' }}>
            NegrosREV is free, no ads, built on weekends for my OJT. If it helped you study, a small tip is hugely appreciated — but totally optional!
          </p>

          {/* GCash card */}
          <div style={{ display: 'inline-block', background: 'white', borderRadius: 18, padding: '20px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', marginBottom: 16, minWidth: 220 }}>
            {/* GCash header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0070cd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 900 }}>G</div>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#0070cd', letterSpacing: '-0.5px' }}>GCash</span>
            </div>
            {/* QR Code */}
            <img
              src="/gcash-qr.png"
              alt="Scan to tip via GCash"
              width={190}
              height={190}
              style={{ display: 'block', borderRadius: 8, margin: '0 auto' }}
            />
            <div style={{ marginTop: 14, fontSize: 11, color: '#888', marginBottom: 4 }}>Transfer fees may apply.</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#0070cd', letterSpacing: '1px' }}>CA***S MI***L T.</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>+63 956 158 ····</div>
          </div>

          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
            Totally optional — the site remains free forever regardless 🙏
          </p>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--card)', padding: '48px 24px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Footer grid */}
          <div className="footer-grid">

            {/* Brand column */}
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)', marginBottom: 10 }}>NegrosREV</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, maxWidth: 320 }}>
                Free community-based college entrance reviewer for students in Negros Occidental. Built by a student, for students.
              </p>
              <span className="badge badge-gold" style={{ fontSize: 11 }}>Free Forever · No Ads · No Signup</span>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>Quick Links</div>
              <Link href="/exam" className="footer-nav-link">Start Reviewing</Link>
              <Link href="#schools" className="footer-nav-link">Supported Schools</Link>
              <Link href="/exam?school=general" className="footer-nav-link">General Practice</Link>
              <Link href="/exam?school=sunn" className="footer-nav-link">SUNN Reviewer</Link>
              <Link href="/exam?school=tup" className="footer-nav-link">TUP Reviewer</Link>
            </div>

            {/* Connect */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>Made by</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
                Carlos Miguel Torres<br />
                <span style={{ fontSize: 12 }}>Student · SUNN · Negros Occidental</span>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a
                  href="https://www.facebook.com/JenxxAi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <IconFacebook size={15} color="#1877f2" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/carlos-miguel-torres-2644a9332/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <IconLinkedIn size={15} color="#0a66c2" />
                  <span>LinkedIn</span>
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
