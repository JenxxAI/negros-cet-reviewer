'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { shuffleArray, calculateScore } from '../../../lib/examHelpers'
import SAMPLE_QUESTIONS from '../../../lib/sampleQuestions'
import {
  IconClock, IconAlertTriangle, IconAward, IconBookOpen, IconCheck, IconX,
  IconClipboard, IconSquare, IconLightbulb, IconRefresh, IconTrendingUp, IconFlag,
  IconEye, IconEyeOff, IconShare, IconAlertOctagon, IconBarChart, IconChevronLeft, IconArrowRight,
} from '../../../components/Icons'

// ─── Supabase question fetcher ─────────────────────────────────────────────
async function fetchQuestionsFromDB(school, subject, difficulty, count) {
  try {
    const { data: schoolData } = await supabase
      .from('schools')
      .select('id')
      .eq('slug', school)
      .single()

    if (!schoolData) return null

    let subjectId = null
    if (subject !== 'all') {
      const { data: subjectData } = await supabase
        .from('subjects')
        .select('id')
        .eq('slug', subject)
        .eq('school_id', schoolData.id)
        .single()
      if (subjectData) subjectId = subjectData.id
    }

    // Use the get_random_questions RPC so results are randomized server-side
    const { data, error } = await supabase.rpc('get_random_questions', {
      p_school_id: schoolData.id,
      p_subject_id: subjectId,
      p_difficulty: difficulty,
      p_count: count,
    })

    if (error || !data || data.length === 0) return null

    return data.map(row => ({
      id: row.id,
      question: row.question_text,
      choices: [row.choice_a, row.choice_b, row.choice_c, row.choice_d],
      answer: { a: 0, b: 1, c: 2, d: 3 }[row.correct_answer],
      explanation: row.explanation || '',
      subjectTag: row.subject_slug || null,
      subjectName: row.subject_name || null,
    }))
  } catch {
    return null
  }
}

function ExamRoom() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const school = searchParams.get('school') || 'general'
  const subject = searchParams.get('subject') || 'math'
  const difficulty = searchParams.get('difficulty') || 'mixed'
  const countRaw = parseInt(searchParams.get('count') || '10')
  const count = (isNaN(countRaw) || countRaw < 1) ? 10 : Math.min(countRaw, 50)
  const mode = searchParams.get('mode') || 'practice'

  const sessionKey = `negrev_session_${school}_${subject}_${difficulty}_${count}_${mode}`

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(count * 60)
  const [finished, setFinished] = useState(false)
  const [flagged, setFlagged] = useState({})
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reported, setReported] = useState({})

  // Persist exam state to sessionStorage on every change
  useEffect(() => {
    if (loading || finished || questions.length === 0) return
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify({ questions, current, answers, timeLeft, flagged }))
    } catch {}
  }, [questions, current, answers, timeLeft, flagged]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load questions: restore from sessionStorage if available, else fetch fresh
  useEffect(() => {
    async function load() {
      try {
        const saved = sessionStorage.getItem(sessionKey)
        if (saved) {
          const s = JSON.parse(saved)
          if (s.questions?.length > 0) {
            setQuestions(s.questions)
            setCurrent(s.current ?? 0)
            setAnswers(s.answers ?? {})
            setTimeLeft(s.timeLeft ?? s.questions.length * 60)
            setFlagged(s.flagged ?? {})
            setLoading(false)
            return
          }
        }
      } catch {}

      const dbQuestions = await fetchQuestionsFromDB(school, subject, difficulty, count)
      const finalQuestions = (dbQuestions && dbQuestions.length > 0)
        ? dbQuestions
        : (() => {
            if (subject === 'all') {
              const allSubjects = ['math', 'english', 'logic', 'science', 'genknowledge']
              const allQ = allSubjects.flatMap(s =>
                (SAMPLE_QUESTIONS[s] || []).map(q => ({ ...q, subjectTag: s, subjectName: s.charAt(0).toUpperCase() + s.slice(1) }))
              )
              return shuffleArray(allQ).slice(0, Math.min(count, allQ.length))
            }
            const raw = SAMPLE_QUESTIONS[subject] || SAMPLE_QUESTIONS.math
            return raw.slice(0, Math.min(count, raw.length))
          })()
      if (finalQuestions.length === 0) { setError(true); setLoading(false); return }
      setQuestions(shuffleArray(finalQuestions))
      setTimeLeft(finalQuestions.length * 60)
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Save session to Supabase when exam finishes
  useEffect(() => {
    if (!finished || questions.length === 0) return
    // Clear the saved session — exam is done
    try { sessionStorage.removeItem(sessionKey) } catch {}
    const score = calculateScore(questions, answers)
    const percent = Math.round((score / questions.length) * 100)

    // Save to localStorage for progress tracking (no login needed)
    try {
      const key = `negrev_history_${school}_${subject}`
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      const entry = { score, total: questions.length, percent, difficulty, date: new Date().toLocaleDateString() }
      localStorage.setItem(key, JSON.stringify([entry, ...prev].slice(0, 5)))
    } catch {}

    // Save session to Supabase
    supabase.from('sessions').insert({
      school_slug: school,
      subject_slug: subject,
      difficulty,
      score,
      total_items: questions.length,
      time_taken: Math.max(0, questions.length * 60 - timeLeft),
    }).then()
  }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer — starts only after questions are loaded
  useEffect(() => {
    if (loading || finished) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setFinished(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [loading, finished])

  // Keyboard shortcuts: A/B/C/D = select answer, Space = next, F = flag
  useEffect(() => {
    if (loading || finished) return
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const k = e.key.toLowerCase()
      const choiceMap = { a: 0, b: 1, c: 2, d: 3 }
      if (k in choiceMap) {
        if (mode === 'practice' && showAnswer) return
        setAnswers(prev => ({ ...prev, [current]: choiceMap[k] }))
        if (mode === 'practice') setShowAnswer(true)
        return
      }
      if (k === 'f') {
        setFlagged(prev => ({ ...prev, [current]: !prev[current] }))
        return
      }
      if (k === ' ' && document.activeElement === document.body) {
        e.preventDefault()
        const canAdvance = mode === 'exam' || showAnswer
        if (canAdvance) {
          if (current + 1 >= questions.length) setFinished(true)
          else { setCurrent(c => c + 1); setShowAnswer(false) }
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loading, finished, showAnswer, current, mode, answers, questions.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}><IconClock size={40} color="var(--gold)" /></div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading questions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ marginBottom: 12 }}><IconAlertTriangle size={40} color="#f85149" /></div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Couldn’t load questions</div>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Check your internet connection and try again.</p>
          <button className="btn btn-primary" onClick={() => { setError(false); setLoading(true) }} style={{ width: '100%' }}>Try Again</button>
        </div>
      </div>
    )
  }

  const handleAnswer = (i) => {
    if (mode === 'practice' && showAnswer) return
    if (mode === 'exam' && answers[current] !== undefined) return
    setAnswers(a => ({ ...a, [current]: i }))
    if (mode === 'practice') setShowAnswer(true)
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1)
    setShowAnswer(false)
  }

  const handleFinish = () => setFinished(true)

  const toggleFlag = () => setFlagged(f => ({ ...f, [current]: !f[current] }))

  const handleReport = async (q) => {
    if (reported[q.id]) return
    setReported(r => ({ ...r, [q.id]: true }))
    try {
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: q.id, details: q.question }),
      })
    } catch {
      // Silently fail — report is best-effort
    }
  }

  // Results
  if (finished) {
    const score = calculateScore(questions, answers)
    const percent = Math.round((score / questions.length) * 100)
    const passed = percent >= 60

    // Per-subject breakdown for Full Mock Exam (subject === 'all')
    const subjectBreakdown = subject === 'all' ? (() => {
      const map = {}
      questions.forEach((q, i) => {
        const tag = q.subjectTag || 'general'
        const label = q.subjectName || tag.charAt(0).toUpperCase() + tag.slice(1)
        if (!map[tag]) map[tag] = { label, total: 0, correct: 0 }
        map[tag].total++
        if (answers[i] === q.answer) map[tag].correct++
      })
      return Object.values(map)
    })() : null

    const shareResult = async () => {
      const subjectLabel = subject === 'all' ? 'Full Mock Exam' : subject.charAt(0).toUpperCase() + subject.slice(1)
      const text = `NegrosREV · ${school.toUpperCase()} · ${subjectLabel} · ${score}/${questions.length} (${percent}%)\nnegros-cet-reviewer.vercel.app`
      try {
        if (navigator.share) {
          await navigator.share({ title: 'My NegrosREV Score', text })
        } else {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      } catch {
        // Silently ignore cancelled share or clipboard permission denied
      }
    }

    // Load history from localStorage
    let history = []
    try {
      history = JSON.parse(localStorage.getItem(`negrev_history_${school}_${subject}`) || '[]')
    } catch {}

    return (
      <div style={{ minHeight: '100vh', padding: '24px', maxWidth: 700, margin: '0 auto' }}>
        {/* Score card */}
        <div className="card" style={{ textAlign: 'center', marginBottom: 24, borderColor: passed ? '#3fb950' : '#f85149' }}>
          <div style={{ marginBottom: 12 }}>{passed ? <IconAward size={60} color="#3fb950" /> : <IconBookOpen size={60} color="#f85149" />}</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: passed ? '#3fb950' : '#f85149' }}>{score}/{questions.length}</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{percent}%</div>
          <span className={`badge ${passed ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 14, padding: '6px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {passed ? <><IconCheck size={14} /> PASSED</> : <><IconX size={14} /> NEEDS IMPROVEMENT</>}
          </span>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 16 }}>
            {passed ? 'Great job! Keep practicing to improve your score.' : "Don't give up! Review the explanations below and try again."}
          </p>
          <button
            onClick={shareResult}
            aria-label="Share or copy your score"
            style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 18px', borderRadius: 8, border: `1px solid ${copied ? 'var(--gold)' : 'var(--border)'}`, background: copied ? 'rgba(201,168,76,0.12)' : 'var(--card2)', color: copied ? 'var(--gold)' : 'var(--text)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <IconShare size={14} />
            {copied ? 'Copied!' : 'Share Score'}
          </button>
        </div>

        {/* Per-subject breakdown — only for Full Mock Exam */}
        {subjectBreakdown && subjectBreakdown.length > 0 && (
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconBarChart size={14} color="var(--gold)" /> Per-Subject Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {subjectBreakdown.map(({ label, total, correct }) => {
                const pct = Math.round((correct / total) * 100)
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{label}</span>
                      <span style={{ color: pct >= 60 ? '#3fb950' : '#f85149', fontWeight: 700 }}>{correct}/{total} ({pct}%)</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 60 ? 'linear-gradient(90deg,#3fb950,#4ade80)' : 'linear-gradient(90deg,#f85149,#fb7185)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Answer review */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconClipboard size={16} /> Answer Review
            </div>
            {Object.values(flagged).some(Boolean) && (
              <button onClick={() => setFlaggedOnly(f => !f)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '5px 10px', borderRadius: 6, border: `1px solid ${flaggedOnly ? 'var(--gold)' : 'var(--border)'}`, background: flaggedOnly ? 'rgba(201,168,76,0.1)' : 'var(--card)', color: flaggedOnly ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer' }}>
                {flaggedOnly
                  ? <><IconEye size={12} /> Show All</>
                  : <><IconFlag size={12} /> Flagged Only ({Object.values(flagged).filter(Boolean).length})</>}
              </button>
            )}
          </div>
          {flaggedOnly && !Object.values(flagged).some(Boolean) && (
            <div style={{ color: 'var(--muted)', fontSize: 13, padding: '16px', textAlign: 'center' }}>No flagged questions.</div>
          )}
          {questions
            .map((q, i) => ({ q, i }))
            .filter(({ i }) => !flaggedOnly || flagged[i])
            .map(({ q, i }) => {
              const userAnswer = answers[i]
              const isCorrect = userAnswer === q.answer
              const answered = userAnswer !== undefined
              return (
                <div key={i} className="card" style={{ marginBottom: 12, borderColor: !answered ? 'var(--border)' : isCorrect ? '#3fb950' : '#f85149' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', marginTop: 2 }}>
                      {!answered ? <IconSquare size={18} color="var(--muted)" /> : isCorrect ? <IconCheck size={18} color="#3fb950" /> : <IconX size={18} color="#f85149" />}
                    </span>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      Q{i + 1}. {q.question}
                      {flagged[i] && <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}><IconFlag size={12} color="var(--gold)" /></span>}
                    </div>
                  </div>
                  {!answered && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Not answered</div>}
                  {answered && !isCorrect && (
                    <div style={{ fontSize: 12, color: '#f85149', marginBottom: 4 }}>Your answer: {q.choices[userAnswer]}</div>
                  )}
                  <div style={{ fontSize: 12, color: '#3fb950', marginBottom: 8 }}>Correct: {q.choices[q.answer]}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--card2)', padding: '8px 12px', borderRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <IconLightbulb size={12} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{q.explanation}</span>
                  </div>
                  <button
                    onClick={() => handleReport(q)}
                    disabled={reported[q.id]}
                    aria-label={reported[q.id] ? 'Question reported' : 'Report an issue with this question'}
                    style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px', borderRadius: 6, border: `1px solid ${reported[q.id] ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`, background: 'transparent', color: reported[q.id] ? 'var(--gold)' : 'var(--muted)', cursor: reported[q.id] ? 'default' : 'pointer', opacity: reported[q.id] ? 1 : 0.7 }}
                  >
                    <IconAlertOctagon size={11} />
                    {reported[q.id] ? 'Reported' : 'Report issue'}
                  </button>
                </div>
              )
            })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <button className="btn btn-primary" onClick={() => { try { sessionStorage.removeItem(sessionKey) } catch {} setCurrent(0); setAnswers({}); setShowAnswer(false); setTimeLeft(questions.length * 60); setFinished(false); setFlagged({}); setFlaggedOnly(false); setCopied(false); setReported({}) }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <IconRefresh size={15} /> Retake Exam
          </button>
          <button className="btn btn-outline" onClick={() => router.push(`/exam?school=${school}`)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <IconChevronLeft size={15} /> Choose Another Subject
          </button>
        </div>

        {/* Score history */}
        {history.length > 1 && (
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconTrendingUp size={14} /> Your Recent Attempts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>{h.date} · {h.difficulty}</span>
                  <span style={{ fontWeight: 700, color: h.percent >= 60 ? '#3fb950' : '#f85149' }}>
                    {h.score}/{h.total} ({h.percent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const q = questions[current]
  const answered = answers[current] !== undefined
  const progress = ((current) / questions.length) * 100
  const timeWarning = timeLeft < 60

  return (
    <div style={{ minHeight: '100vh', padding: '16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              Question <strong style={{ color: 'var(--text)' }}>{current + 1}</strong> of {questions.length}
            </div>
            {mode === 'exam' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#f85149', background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.25)', borderRadius: 6, padding: '3px 7px' }}>
                <IconEyeOff size={11} /> Exam Mode
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={toggleFlag}
              aria-label={flagged[current] ? 'Remove flag from this question' : 'Flag this question for review'}
              aria-pressed={!!flagged[current]}
              className="flag-btn"
              style={{ background: flagged[current] ? 'rgba(201,168,76,0.2)' : 'var(--card)', border: `1px solid ${flagged[current] ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: flagged[current] ? 'var(--gold)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconFlag size={14} color={flagged[current] ? 'var(--gold)' : 'var(--muted)'} />
              <span className="flag-text">{flagged[current] ? 'Flagged' : 'Flag'}</span>
            </button>
            <div
              role="timer"
              aria-label={`Time remaining: ${formatTime(timeLeft)}`}
              style={{ background: timeWarning ? 'rgba(248,81,73,0.15)' : 'var(--card)', border: `1px solid ${timeWarning ? '#f85149' : 'var(--border)'}`, borderRadius: 8, padding: '7px 12px', fontWeight: 700, fontSize: 14, color: timeWarning ? '#f85149' : 'var(--text)', fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconClock size={13} color={timeWarning ? '#f85149' : 'var(--text)'} />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-track" style={{ marginBottom: 20 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question */}
        <div className="card" style={{ marginBottom: 16, minHeight: 100 }}>
          <div className="exam-label">
            {subject.toUpperCase()} · {difficulty.toUpperCase()}
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.6 }}>{q.question}</div>
        </div>

        {/* Choices */}
        <div role="radiogroup" aria-label="Answer choices" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {q.choices.map((choice, i) => {
            let cls = 'choice-btn'
            if (showAnswer && mode === 'practice') {
              if (i === q.answer) cls += ' correct'
              else if (answers[current] === i && i !== q.answer) cls += ' wrong'
            } else if (answers[current] === i) {
              cls += ' selected'
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleAnswer(i)}
                disabled={(mode === 'practice' && showAnswer) || (mode === 'exam' && answers[current] !== undefined)}
                role="radio"
                aria-checked={answers[current] === i}
                aria-label={`Choice ${['A','B','C','D'][i]}: ${choice}`}
              >
                <span className="choice-label">{['A', 'B', 'C', 'D'][i]}</span>
                {choice}
                {showAnswer && mode === 'practice' && i === q.answer && <span style={{ marginLeft: 'auto' }}><IconCheck size={16} color="#3fb950" /></span>}
                {showAnswer && mode === 'practice' && answers[current] === i && i !== q.answer && <span style={{ marginLeft: 'auto' }}><IconX size={16} color="#f85149" /></span>}
              </button>
            )
          })}
        </div>

        {/* Explanation — practice mode only */}
        {showAnswer && mode === 'practice' && (
          <div className="exam-explanation" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <IconLightbulb size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span><strong style={{ color: 'var(--gold)' }}>Explanation: </strong>{q.explanation}</span>
          </div>
        )}

        {/* Question dot strip — scrollable on mobile */}
        <div className="q-dot-strip" role="navigation" aria-label="Question navigation">
          {questions.map((_, i) => (
            <button key={i}
              aria-label={`Go to question ${i + 1}${flagged[i] ? ' (flagged)' : ''}${answers[i] !== undefined ? ' (answered)' : ''}`}
              aria-current={i === current ? 'true' : undefined}
              className="q-dot"
              style={{
                background: i === current ? 'var(--gold)' : answers[i] !== undefined ? 'rgba(63,185,80,0.3)' : 'var(--card)',
                color: i === current ? '#0d1117' : answers[i] !== undefined ? '#3fb950' : 'var(--muted)',
                border: `1px solid ${i === current ? 'var(--gold)' : flagged[i] ? 'var(--gold)' : 'var(--border)'}`,
                boxShadow: flagged[i] ? '0 0 0 2px rgba(201,168,76,0.35)' : 'none',
              }}
              onClick={() => {
                if (mode === 'exam') { setCurrent(i) }
                else if (!showAnswer) { setCurrent(i); setShowAnswer(answers[i] !== undefined) }
              }}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Navigation — sticky on mobile */}
        <div className="nav-actions">
          {mode === 'exam' ? (
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button className="btn btn-outline" onClick={() => setCurrent(c => c - 1)}
                disabled={current === 0}
                style={{ flex: 1, opacity: current === 0 ? 0.3 : 1 }}
                aria-label="Previous question">
                ← Prev
              </button>
              <button className="btn btn-primary" onClick={handleNext}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {current + 1 >= questions.length ? 'Submit All' : 'Next'} <IconArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, width: '100%' }}>
              <button className="btn btn-outline" onClick={handleFinish}
                style={{ flex: 1, visibility: (answered || showAnswer) ? 'hidden' : 'visible', pointerEvents: (answered || showAnswer) ? 'none' : 'auto' }}>
                Finish Early
              </button>
              <button className="btn btn-primary" onClick={handleNext}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {current + 1 >= questions.length ? 'See Results' : 'Next'} <IconArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Keyboard hints — desktop only */}
        <div className="kbd-hints">
          <span><kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd> select</span>
          <span><kbd>Space</kbd> next</span>
          <span><kbd>F</kbd> flag</span>
        </div>

      </div>
    </div>
  )
}

export default function ExamStartPage() {
  return <Suspense><ExamRoom /></Suspense>
}
