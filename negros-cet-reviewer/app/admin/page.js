'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { IconLock, IconPlusCircle, IconAlertTriangle, IconCheck } from '../../components/Icons'

const DIFFICULTIES = ['easy', 'medium', 'hard']
const CORRECT_OPTIONS = ['a', 'b', 'c', 'd']

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [schools, setSchools] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSchool, setSelectedSchool] = useState('')
  const [form, setForm] = useState({
    subject_slug: '',
    question_text: '',
    choice_a: '',
    choice_b: '',
    choice_c: '',
    choice_d: '',
    correct_answer: 'a',
    difficulty: 'medium',
    explanation: '',
  })
  const [status, setStatus] = useState(null) // { type: 'success'|'error', msg: string }
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authed) return
    supabase.from('schools').select('id, name, slug').order('name').then(({ data }) => {
      if (data) setSchools(data)
    })
  }, [authed])

  useEffect(() => {
    if (!selectedSchool) { setSubjects([]); return }
    supabase
      .from('subjects')
      .select('id, name, slug')
      .eq('school_id', selectedSchool)
      .order('name')
      .then(({ data }) => {
        if (data) setSubjects(data)
      })
  }, [selectedSchool])

  const handleAuth = (e) => {
    e.preventDefault()
    if (!password.trim()) return
    // Auth is validated server-side; show the form now and let the first submission reveal if the password is wrong
    setAuthed(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSchool) { setStatus({ type: 'error', msg: 'Please select a school.' }); return }
    setSubmitting(true)
    setStatus(null)

    const school = schools.find(s => s.id === selectedSchool)
    if (!school) { setStatus({ type: 'error', msg: 'School not found.' }); setSubmitting(false); return }

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ ...form, school_slug: school.slug }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (res.status === 401) setAuthed(false)
        setStatus({ type: 'error', msg: json.error || 'Failed to add question.' })
      } else {
        setStatus({ type: 'success', msg: `Question added! ID: ${json.id}` })
        setForm(f => ({ ...f, question_text: '', choice_a: '', choice_b: '', choice_c: '', choice_d: '', correct_answer: 'a', explanation: '' }))
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error. Check your connection.' })
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key, label, multiline = false, placeholder = '') => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          rows={3}
          style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
        />
      ) : (
        <input
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 14 }}
        />
      )}
    </div>
  )

  // Password gate
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ maxWidth: 360, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <IconLock size={36} color="var(--gold)" />
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 12 }}>Admin Access</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>This area is for the site owner only.</div>
          </div>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px', color: 'var(--text)', fontSize: 15, marginBottom: 14, boxSizing: 'border-box' }}
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}>← Back to Home</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <IconPlusCircle size={24} color="var(--gold)" />
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Add Question</h1>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
        Add practice questions to the database. Changes go live immediately.
      </p>

      {/* Warning banner */}
      <div style={{ background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 24, fontSize: 12, color: '#f85149', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <IconAlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>For the site owner only. Questions should not contain copyrighted material from actual past exam papers.</span>
      </div>

      {status && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
          background: status.type === 'success' ? 'rgba(63,185,80,0.1)' : 'rgba(248,81,73,0.1)',
          border: `1px solid ${status.type === 'success' ? 'rgba(63,185,80,0.3)' : 'rgba(248,81,73,0.3)'}`,
          color: status.type === 'success' ? '#3fb950' : '#f85149',
        }}>
          {status.type === 'success' ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        {/* School */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>School</label>
          <select
            value={selectedSchool}
            onChange={e => { setSelectedSchool(e.target.value); setForm(f => ({ ...f, subject_slug: '' })) }}
            required
            style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 14 }}
          >
            <option value="">— Select school —</option>
            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Subject */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Subject</label>
          <select
            value={form.subject_slug}
            onChange={e => setForm(f => ({ ...f, subject_slug: e.target.value }))}
            required
            disabled={!selectedSchool || subjects.length === 0}
            style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 14, opacity: !selectedSchool ? 0.5 : 1 }}
          >
            <option value="">— Select subject —</option>
            {subjects.map(s => <option key={s.id} value={s.slug}>{s.name}</option>)}
          </select>
        </div>

        {field('question_text', 'Question Text *', true, 'Type the question here...')}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {['a','b','c','d'].map(letter => (
            <div key={letter} style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                Choice {letter.toUpperCase()} *
              </label>
              <input
                value={form[`choice_${letter}`]}
                onChange={e => setForm(f => ({ ...f, [`choice_${letter}`]: e.target.value }))}
                required
                style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
          {/* Correct Answer */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Correct Answer *</label>
            <select
              value={form.correct_answer}
              onChange={e => setForm(f => ({ ...f, correct_answer: e.target.value }))}
              style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 14 }}
            >
              {CORRECT_OPTIONS.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
            </select>
          </div>
          {/* Difficulty */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Difficulty *</label>
            <select
              value={form.difficulty}
              onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
              style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 14 }}
            >
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {field('explanation', 'Explanation (optional)', true, 'Explain why the correct answer is right...')}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ width: '100%', marginTop: 8 }}
        >
          {submitting ? 'Adding...' : 'Add Question'}
        </button>
      </form>
    </div>
  )
}
