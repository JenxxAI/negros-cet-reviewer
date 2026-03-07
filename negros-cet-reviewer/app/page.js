'use client'
import Link from 'next/link'
import ThemeToggle from '../components/ThemeToggle'
import {
  IconTarget, IconClock, IconBarChart, IconTrendingUp, IconLightbulb, IconSmartphone,
  IconCheck, IconAlertTriangle, IconAward, IconStar,
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

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh' }}>

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
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 700, margin: '0 auto' }}>
        <div className="badge badge-gold" style={{ marginBottom: 20, fontSize: 12 }}>Community-Based · Free Forever · Negros Occidental</div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          Ace Your College<br /><span className="gold">Entrance Exam</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Free practice reviewer for students applying to colleges and universities in Negros Occidental. No signup required. No ads. Built by a student, for students.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 8 }}><IconStar size={18} color="var(--gold)" /> General Practice Mode</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Not sure which school? Practice all subjects that appear in most Negros entrance exams</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 300 }}>
                  {['Math', 'English', 'Science', 'Logic', 'Filipino', 'Gen. Knowledge'].map(s => (
                    <span key={s} style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--muted)' }}>{s}</span>
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
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div className="card" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.3)' }}>
          <div style={{ marginBottom: 16 }}><IconAward size={48} color="var(--gold)" /></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Ready to Start Reviewing?</h2>
          <p className="muted" style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>No account needed. Just pick your school and start practicing. 100% free, always.</p>
          <Link href="/exam" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>Start Now — It's Free →</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
        <p>NegrosREV — Built by a student from SUNN, for students of Negros Occidental</p>
        <p style={{ marginTop: 6 }}>Independent community project · Not affiliated with any school · All questions are original</p>
      </footer>

    </div>
  )
}
