'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { SCHOOL_META } from '../../lib/schools'
import {
  IconPlus, IconFileText, IconFlask, IconGrid, IconFlag, IconGlobe, IconSettings, IconLayers,
  IconEye, IconEyeOff, IconChevronLeft,
} from '../../components/Icons'

// SCHOOL_CONFIG merges shared metadata (name/full/exam/color from lib/schools.js)
// with exam-page-specific subject configs (icon + desc).
const SCHOOL_CONFIG = {
  general: {
    name: 'General Practice',
    color: '#c9a84c',
    subjects: [
      { id: 'math', name: 'Mathematics', icon: <IconPlus size={20} />, desc: 'Arithmetic, Algebra, Geometry, Word Problems' },
      { id: 'english', name: 'English', icon: <IconFileText size={20} />, desc: 'Grammar, Reading Comprehension, Vocabulary' },
      { id: 'science', name: 'Science', icon: <IconFlask size={20} />, desc: 'Biology, Chemistry, Physics, Earth Science' },
      { id: 'logic', name: 'Logic & Reasoning', icon: <IconGrid size={20} />, desc: 'Patterns, Sequences, Analogies, Abstract Reasoning' },
      { id: 'filipino', name: 'Filipino', icon: <IconFlag size={20} />, desc: 'Gramatika, Pagbasa, Bokabularyo' },
      { id: 'genknowledge', name: 'General Knowledge', icon: <IconGlobe size={20} />, desc: 'Philippine History, Current Events, Geography' },
    ]
  },
  sunn: {
    ...SCHOOL_META.sunn,
    subjects: [
      { id: 'logic', name: 'Logic & Reasoning', icon: <IconGrid size={20} />, desc: 'Patterns, Shapes, Sequences, Odd One Out' },
      { id: 'math', name: 'Mathematics', icon: <IconPlus size={20} />, desc: 'Basic Arithmetic, Word Problems' },
      { id: 'genknowledge', name: 'General Knowledge', icon: <IconGlobe size={20} />, desc: 'Philippine History, Current Events' },
    ]
  },
  tup: {
    ...SCHOOL_META.tup,
    subjects: [
      { id: 'math', name: 'Mathematics', icon: <IconPlus size={20} />, desc: 'Algebra, Geometry, Word Problems' },
      { id: 'english', name: 'English', icon: <IconFileText size={20} />, desc: 'Reading Comprehension, Grammar, Writing' },
      { id: 'science', name: 'Science', icon: <IconFlask size={20} />, desc: 'Biology, Chemistry, Physics' },
      { id: 'technical', name: 'Technical Reasoning', icon: <IconSettings size={20} />, desc: 'Mechanical reasoning, technical diagrams, spatial' },
    ]
  },
  chmsu: {
    ...SCHOOL_META.chmsu,
    subjects: [
      { id: 'math', name: 'Mathematics', icon: <IconPlus size={20} />, desc: 'Algebra, Fractions, Word Problems' },
      { id: 'english', name: 'English', icon: <IconFileText size={20} />, desc: 'Grammar, Reading Comprehension, Vocabulary' },
      { id: 'science', name: 'Science', icon: <IconFlask size={20} />, desc: 'General Science, Biology, Chemistry' },
    ]
  },
  pnu: {
    ...SCHOOL_META.pnu,
    subjects: [
      { id: 'math', name: 'Mathematics', icon: <IconPlus size={20} />, desc: 'Basic Math, Algebra, Geometry, Problem Solving' },
      { id: 'english', name: 'English', icon: <IconFileText size={20} />, desc: 'Grammar, Language Proficiency, Reading' },
      { id: 'genknowledge', name: 'General Info & History', icon: <IconGlobe size={20} />, desc: 'Philippine History, Government, Geography' },
    ]
  },
  lasalle: {
    ...SCHOOL_META.lasalle,
    subjects: [
      { id: 'math', name: 'Mathematics', icon: <IconPlus size={20} />, desc: 'Algebra, Geometry, Word Problems' },
      { id: 'english', name: 'English', icon: <IconFileText size={20} />, desc: 'Grammar, Reading, Vocabulary' },
      { id: 'science', name: 'Science', icon: <IconFlask size={20} />, desc: 'Biology, Chemistry, Physics' },
      { id: 'logic', name: 'Abstract Reasoning', icon: <IconGrid size={20} />, desc: 'Patterns, Sequences, Figure Series' },
    ]
  },
  csa: {
    ...SCHOOL_META.csa,
    subjects: [
      { id: 'math', name: 'Mathematics', icon: <IconPlus size={20} />, desc: 'Algebra, Fractions, Word Problems' },
      { id: 'english', name: 'English', icon: <IconFileText size={20} />, desc: 'Grammar, Reading Comprehension' },
      { id: 'science', name: 'Science', icon: <IconFlask size={20} />, desc: 'General Science topics' },
    ]
  },
}

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', desc: 'Basic concepts — good for warm up', color: '#3fb950' },
  { id: 'medium', label: 'Medium', desc: 'Standard exam level difficulty', color: '#c9a84c' },
  { id: 'hard', label: 'Hard', desc: 'Challenging — test your limits', color: '#f85149' },
  { id: 'mixed', label: 'Mixed', desc: 'All difficulty levels combined', color: '#58a6ff' },
]

const QUESTION_COUNTS = [10, 20, 30, 40, 50]

function ExamSetup() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const schoolParam = searchParams.get('school') || 'general'
  const config = SCHOOL_CONFIG[schoolParam] || SCHOOL_CONFIG.general

  const [selectedSubject, setSelectedSubject] = useState(null)
  const [difficulty, setDifficulty] = useState('mixed')
  const [questionCount, setQuestionCount] = useState(20)
  const [examMode, setExamMode] = useState('practice')

  const handleStart = () => {
    router.push(`/exam/start?school=${schoolParam}&subject=${selectedSubject}&difficulty=${difficulty}&count=${questionCount}&mode=${examMode}`)
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Back */}
        <Link href="/" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
          <IconChevronLeft size={16} /> Back to Home
        </Link>

        {/* School Header */}
        <div className="card" style={{ marginBottom: 24, borderColor: config.color + '40' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: config.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: config.color }}>
              {config.name.slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: config.color }}>{config.name}</div>
              {config.full && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{config.full} · {config.exam}</div>}
              {!config.full && <div style={{ fontSize: 12, color: 'var(--muted)' }}>All subjects across Negros schools</div>}
            </div>
          </div>
        </div>

        {/* Step 1 - Subject */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Step 1 — Choose Subject</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {config.subjects.map(s => (
              <button key={s.id} onClick={() => setSelectedSubject(s.id)}
                style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 10, border: `1px solid ${selectedSubject === s.id ? config.color : 'var(--border)'}`, background: selectedSubject === s.id ? config.color + '15' : 'var(--card)', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: selectedSubject === s.id ? config.color : 'var(--text)' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{s.desc}</div>
              </button>
            ))}
            {/* Full mock exam option */}
            <button onClick={() => setSelectedSubject('all')}
              style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 10, border: `1px solid ${selectedSubject === 'all' ? config.color : 'var(--border)'}`, background: selectedSubject === 'all' ? config.color + '15' : 'var(--card)', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ marginBottom: 6 }}><IconLayers size={20} color={selectedSubject === 'all' ? config.color : 'var(--muted)'} /></div>
              <div style={{ fontWeight: 700, fontSize: 14, color: selectedSubject === 'all' ? config.color : 'var(--text)' }}>Full Mock Exam</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>All subjects combined — simulates real exam</div>
            </button>
          </div>
        </div>

        {/* Step 2 - Difficulty */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Step 2 — Difficulty</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {DIFFICULTIES.map(d => (
              <button key={d.id} onClick={() => setDifficulty(d.id)}
                style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 10, border: `1px solid ${difficulty === d.id ? d.color : 'var(--border)'}`, background: difficulty === d.id ? d.color + '15' : 'var(--card)', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: difficulty === d.id ? d.color : 'var(--text)' }}>{d.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3 - Question Count */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Step 3 — Number of Questions</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {QUESTION_COUNTS.map(n => (
              <button key={n} onClick={() => setQuestionCount(n)}
                style={{ padding: '10px 20px', borderRadius: 8, border: `1px solid ${questionCount === n ? 'var(--gold)' : 'var(--border)'}`, background: questionCount === n ? 'rgba(201,168,76,0.15)' : 'var(--card)', color: questionCount === n ? 'var(--gold)' : 'var(--text)', fontWeight: 700, cursor: 'pointer', fontSize: 14, transition: 'all 0.15s' }}>
                {n} items
              </button>
            ))}
          </div>
        </div>

        {/* Step 4 - Exam Mode */}
        <div style={{ marginBottom: 32 }}>
          <div className="step-label">Step 4 — Exam Mode</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            <button onClick={() => setExamMode('practice')}
              style={{ textAlign: 'left', padding: '16px', borderRadius: 10, border: `1px solid ${examMode === 'practice' ? '#3fb950' : 'var(--border)'}`, background: examMode === 'practice' ? 'rgba(63,185,80,0.08)' : 'var(--card)', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ marginBottom: 8 }}><IconEye size={20} color={examMode === 'practice' ? '#3fb950' : 'var(--muted)'} /></div>
              <div style={{ fontWeight: 700, fontSize: 14, color: examMode === 'practice' ? '#3fb950' : 'var(--text)', marginBottom: 4 }}>Practice Mode</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>See the correct answer and explanation immediately after each question</div>
            </button>
            <button onClick={() => setExamMode('exam')}
              style={{ textAlign: 'left', padding: '16px', borderRadius: 10, border: `1px solid ${examMode === 'exam' ? '#f85149' : 'var(--border)'}`, background: examMode === 'exam' ? 'rgba(248,81,73,0.08)' : 'var(--card)', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ marginBottom: 8 }}><IconEyeOff size={20} color={examMode === 'exam' ? '#f85149' : 'var(--muted)'} /></div>
              <div style={{ fontWeight: 700, fontSize: 14, color: examMode === 'exam' ? '#f85149' : 'var(--text)', marginBottom: 4 }}>True Exam Mode</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>No hints during the exam — all answers revealed after you submit</div>
            </button>
          </div>
        </div>

        {/* Start Button */}
        <button className="btn btn-primary" onClick={handleStart} disabled={!selectedSubject}
          style={{ width: '100%', fontSize: 16, padding: '16px', opacity: selectedSubject ? 1 : 0.5 }}>
          {selectedSubject
            ? `Start ${questionCount}-Item ${examMode === 'exam' ? 'True Exam' : 'Practice'} →`
            : 'Select a subject to continue'}
        </button>

      </div>
    </div>
  )
}

export default function ExamPage() {
  return <Suspense><ExamSetup /></Suspense>
}
