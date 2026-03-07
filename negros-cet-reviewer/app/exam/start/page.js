'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

// ─── Supabase question fetcher ─────────────────────────────────────────────
async function fetchQuestionsFromDB(school, subject, difficulty, count) {
  try {
    const { data: schoolData } = await supabase
      .from('schools')
      .select('id')
      .eq('slug', school)
      .single()

    if (!schoolData) return null

    let q = supabase
      .from('questions')
      .select('id, question_text, choice_a, choice_b, choice_c, choice_d, correct_answer, explanation')
      .eq('school_id', schoolData.id)
      .eq('is_active', true)

    if (subject !== 'all') {
      const { data: subjectData } = await supabase
        .from('subjects')
        .select('id')
        .eq('slug', subject)
        .eq('school_id', schoolData.id)
        .single()
      if (subjectData) q = q.eq('subject_id', subjectData.id)
    }

    if (difficulty !== 'mixed') q = q.eq('difficulty', difficulty)

    const { data, error } = await q.limit(count)
    if (error || !data || data.length === 0) return null

    const answerMap = { a: 0, b: 1, c: 2, d: 3 }
    return data.map(row => ({
      id: row.id,
      question: row.question_text,
      choices: [row.choice_a, row.choice_b, row.choice_c, row.choice_d],
      answer: answerMap[row.correct_answer],
      explanation: row.explanation || '',
    }))
  } catch {
    return null
  }
}

// Sample questions — fallback used when DB is empty or unavailable
const SAMPLE_QUESTIONS = {
  math: [
    { id: 1, question: 'What is 15% of 200?', choices: ['25', '30', '35', '40'], answer: 1, explanation: '15% of 200 = 0.15 × 200 = 30' },
    { id: 2, question: 'If x + 7 = 15, what is x?', choices: ['6', '7', '8', '9'], answer: 2, explanation: 'x = 15 - 7 = 8' },
    { id: 3, question: 'What is the area of a rectangle with length 8 and width 5?', choices: ['13', '26', '40', '45'], answer: 2, explanation: 'Area = length × width = 8 × 5 = 40' },
    { id: 4, question: 'Simplify: 3/4 + 1/2', choices: ['4/6', '5/4', '4/4', '7/4'], answer: 1, explanation: '3/4 + 2/4 = 5/4' },
    { id: 5, question: 'A train travels 120 km in 2 hours. What is its speed?', choices: ['60 km/h', '50 km/h', '70 km/h', '80 km/h'], answer: 0, explanation: 'Speed = Distance / Time = 120 / 2 = 60 km/h' },
    { id: 6, question: 'What is 2³?', choices: ['6', '8', '9', '12'], answer: 1, explanation: '2³ = 2 × 2 × 2 = 8' },
    { id: 7, question: 'If a shirt costs ₱250 and is on 20% sale, how much do you pay?', choices: ['₱200', '₱210', '₱220', '₱230'], answer: 0, explanation: 'Discount = 20% of 250 = 50. Price = 250 - 50 = ₱200' },
    { id: 8, question: 'What is the perimeter of a square with side 6?', choices: ['12', '18', '24', '36'], answer: 2, explanation: 'Perimeter = 4 × side = 4 × 6 = 24' },
    { id: 9, question: 'Solve: 5x = 35', choices: ['5', '6', '7', '8'], answer: 2, explanation: 'x = 35 / 5 = 7' },
    { id: 10, question: 'What is the LCM of 4 and 6?', choices: ['8', '10', '12', '24'], answer: 2, explanation: 'LCM of 4 and 6 = 12' },
  ],
  english: [
    { id: 1, question: 'Choose the correct word: "She ___ to school every day."', choices: ['go', 'goes', 'going', 'gone'], answer: 1, explanation: 'Third person singular (she) uses "goes"' },
    { id: 2, question: 'What is the synonym of "happy"?', choices: ['sad', 'angry', 'joyful', 'tired'], answer: 2, explanation: 'Joyful means feeling great happiness — same as happy' },
    { id: 3, question: 'Which sentence is grammatically correct?', choices: ['They was late.', 'He were absent.', 'She is present.', 'We is ready.'], answer: 2, explanation: '"She is present" — singular subject (she) uses "is"' },
    { id: 4, question: 'What is the antonym of "ancient"?', choices: ['old', 'modern', 'historical', 'traditional'], answer: 1, explanation: '"Modern" is the opposite of "ancient"' },
    { id: 5, question: '"The students ___ studying for the exam." — Fill in the blank.', choices: ['is', 'was', 'are', 'has'], answer: 2, explanation: 'Plural subject (students) uses "are"' },
    { id: 6, question: 'Which word is a noun?', choices: ['quickly', 'beautiful', 'freedom', 'run'], answer: 2, explanation: '"Freedom" is a noun — it names a concept' },
    { id: 7, question: 'What does "benevolent" mean?', choices: ['cruel', 'kind-hearted', 'lazy', 'confused'], answer: 1, explanation: '"Benevolent" means well-meaning and kind' },
    { id: 8, question: 'Identify the verb: "The dog barked loudly."', choices: ['dog', 'barked', 'loudly', 'the'], answer: 1, explanation: '"Barked" is the verb — it shows the action' },
    { id: 9, question: 'Choose the correct punctuation: "What time is it___"', choices: ['.', ',', '?', '!'], answer: 2, explanation: 'Questions end with a question mark (?)' },
    { id: 10, question: 'What is the plural of "child"?', choices: ['childs', 'childes', 'children', 'childrens'], answer: 2, explanation: '"Children" is the irregular plural of "child"' },
  ],
  logic: [
    { id: 1, question: 'What comes next? 2, 4, 6, 8, ___', choices: ['9', '10', '11', '12'], answer: 1, explanation: 'Pattern: +2 each time. 8 + 2 = 10' },
    { id: 2, question: 'Which is the odd one out? Dog, Cat, Rose, Bird', choices: ['Dog', 'Cat', 'Rose', 'Bird'], answer: 2, explanation: '"Rose" is a plant — all others are animals' },
    { id: 3, question: 'Finger is to Hand as Toe is to ___', choices: ['Arm', 'Leg', 'Foot', 'Knee'], answer: 2, explanation: 'Finger is part of Hand. Toe is part of Foot.' },
    { id: 4, question: 'What comes next? 1, 4, 9, 16, ___', choices: ['20', '25', '30', '36'], answer: 1, explanation: 'Pattern: perfect squares. 5² = 25' },
    { id: 5, question: 'Which is the odd one out? Apple, Banana, Carrot, Mango', choices: ['Apple', 'Banana', 'Carrot', 'Mango'], answer: 2, explanation: '"Carrot" is a vegetable — all others are fruits' },
    { id: 6, question: 'If all cats are animals, and some animals are pets, then:', choices: ['All cats are pets', 'Some cats may be pets', 'No cats are pets', 'All pets are cats'], answer: 1, explanation: 'We can only conclude that some cats may be pets' },
    { id: 7, question: 'Complete: Book is to Read as Food is to ___', choices: ['Drink', 'Eat', 'Cook', 'Buy'], answer: 1, explanation: 'You read a book. You eat food.' },
    { id: 8, question: 'What comes next? A, C, E, G, ___', choices: ['H', 'I', 'J', 'K'], answer: 1, explanation: 'Pattern: skip one letter. G → I' },
    { id: 9, question: 'Which shape has 3 sides?', choices: ['Square', 'Circle', 'Triangle', 'Rectangle'], answer: 2, explanation: 'A triangle has exactly 3 sides' },
    { id: 10, question: 'If today is Wednesday, what day is 3 days from now?', choices: ['Friday', 'Saturday', 'Sunday', 'Monday'], answer: 1, explanation: 'Wednesday + 3 days = Saturday' },
  ],
  science: [
    { id: 1, question: 'What is the chemical symbol for water?', choices: ['WO', 'H2O', 'HO2', 'W2O'], answer: 1, explanation: 'Water is H2O — 2 hydrogen atoms and 1 oxygen atom' },
    { id: 2, question: 'Which planet is closest to the Sun?', choices: ['Venus', 'Earth', 'Mercury', 'Mars'], answer: 2, explanation: 'Mercury is the closest planet to the Sun' },
    { id: 3, question: 'What organ pumps blood in the human body?', choices: ['Lungs', 'Brain', 'Heart', 'Liver'], answer: 2, explanation: 'The heart is the organ responsible for pumping blood' },
    { id: 4, question: 'What is the process by which plants make food?', choices: ['Respiration', 'Photosynthesis', 'Digestion', 'Absorption'], answer: 1, explanation: 'Photosynthesis is how plants convert sunlight into food' },
    { id: 5, question: 'What is the atomic number of Carbon?', choices: ['4', '6', '8', '12'], answer: 1, explanation: 'Carbon has atomic number 6' },
    { id: 6, question: 'Which gas do humans breathe in?', choices: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], answer: 2, explanation: 'Humans breathe in Oxygen (O2)' },
    { id: 7, question: 'What is the speed of light?', choices: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], answer: 1, explanation: 'Speed of light = 3×10⁸ m/s (300,000 km/s)' },
    { id: 8, question: 'Which is the largest organ in the human body?', choices: ['Heart', 'Brain', 'Liver', 'Skin'], answer: 3, explanation: 'The skin is the largest organ of the human body' },
    { id: 9, question: 'What force pulls objects toward Earth?', choices: ['Magnetism', 'Friction', 'Gravity', 'Inertia'], answer: 2, explanation: 'Gravity is the force that pulls objects toward Earth' },
    { id: 10, question: 'DNA stands for?', choices: ['Deoxyribonucleic Acid', 'Diribose Nucleic Acid', 'Deoxyribose Natural Acid', 'Double Nucleic Acid'], answer: 0, explanation: 'DNA = Deoxyribonucleic Acid' },
  ],
  genknowledge: [
    { id: 1, question: 'Who was the first President of the Philippines?', choices: ['Manuel Quezon', 'Emilio Aguinaldo', 'Jose Rizal', 'Andres Bonifacio'], answer: 1, explanation: 'Emilio Aguinaldo was the first President of the Philippines' },
    { id: 2, question: 'What is the capital of the Philippines?', choices: ['Cebu', 'Davao', 'Manila', 'Quezon City'], answer: 2, explanation: 'Manila is the capital of the Philippines' },
    { id: 3, question: 'What is the national flower of the Philippines?', choices: ['Rose', 'Sampaguita', 'Sunflower', 'Orchid'], answer: 1, explanation: 'Sampaguita (Jasminum sambac) is the national flower' },
    { id: 4, question: 'In what year did the Philippines gain independence from the US?', choices: ['1944', '1945', '1946', '1947'], answer: 2, explanation: 'The Philippines gained independence on July 4, 1946' },
    { id: 5, question: 'Who wrote the Philippine national anthem?', choices: ['Jose Palma', 'Julian Felipe', 'Emilio Aguinaldo', 'Apolinario Mabini'], answer: 0, explanation: 'Jose Palma wrote the lyrics of Lupang Hinirang' },
    { id: 6, question: 'What is the largest island in the Philippines?', choices: ['Visayas', 'Mindanao', 'Luzon', 'Palawan'], answer: 2, explanation: 'Luzon is the largest island in the Philippines' },
    { id: 7, question: 'What does SUNN stand for?', choices: ['State University Northern Negros', 'State University of Northern Negros', 'Southern University Northern Negros', 'State Unified Northern Negros'], answer: 1, explanation: 'SUNN = State University of Northern Negros' },
    { id: 8, question: 'What is Negros Occidental\'s capital?', choices: ['Sagay', 'Silay', 'Bacolod', 'Victorias'], answer: 2, explanation: 'Bacolod City is the capital of Negros Occidental' },
    { id: 9, question: 'How many provinces does the Philippines have?', choices: ['72', '81', '89', '100'], answer: 1, explanation: 'The Philippines has 81 provinces' },
    { id: 10, question: 'What is the national language of the Philippines?', choices: ['English', 'Cebuano', 'Filipino', 'Tagalog'], answer: 2, explanation: 'Filipino is the national language (based on Tagalog)' },
  ],
  filipino: [
    { id: 1, question: 'Ano ang kahulugan ng salitang "matiyaga"?', choices: ['Mabilis', 'Mapagtiis', 'Masayahin', 'Matalino'], answer: 1, explanation: '"Matiyaga" ay nangangahulugang mapagtiis o mapaghintay' },
    { id: 2, question: 'Piliin ang tamang pangungusap:', choices: ['Kumain ako ng mansanas kanina.', 'Mansanas kumain ako kanina.', 'Ako mansanas kumain kanina.', 'Kanina ako kumain mansanas.'], answer: 0, explanation: 'Ang tamang pagkakasunod-sunod ng Filipino na pangungusap' },
    { id: 3, question: 'Ano ang salitang-ugat ng "kagandahan"?', choices: ['Ganda', 'Kaganda', 'Gandahan', 'Maganda'], answer: 0, explanation: 'Ang salitang-ugat ng "kagandahan" ay "ganda"' },
    { id: 4, question: 'Alin ang pangngalan sa mga sumusunod?', choices: ['Tumakbo', 'Maganda', 'Kabataan', 'Mabilis'], answer: 2, explanation: '"Kabataan" ay isang pangngalan — nagngangalan ng grupo ng tao' },
    { id: 5, question: 'Ano ang kasingkahulugan ng "masaya"?', choices: ['Malungkot', 'Galit', 'Natutuwa', 'Takot'], answer: 2, explanation: '"Natutuwa" ay kasingkahulugan ng "masaya"' },
  ],
  technical: [
    { id: 1, question: 'What does CPU stand for?', choices: ['Central Processing Unit', 'Computer Processing Unit', 'Core Processing Unit', 'Central Program Unit'], answer: 0, explanation: 'CPU = Central Processing Unit — the brain of the computer' },
    { id: 2, question: 'A gear with 20 teeth meshes with a gear with 40 teeth. If the small gear turns 4 times, how many times does the large gear turn?', choices: ['1', '2', '4', '8'], answer: 1, explanation: 'Gear ratio = 20/40 = 1/2. 4 × (1/2) = 2 turns' },
    { id: 3, question: 'Which tool is used to measure electrical resistance?', choices: ['Voltmeter', 'Ammeter', 'Ohmmeter', 'Wattmeter'], answer: 2, explanation: 'An Ohmmeter measures electrical resistance in Ohms' },
    { id: 4, question: 'What is the unit of electric current?', choices: ['Volt', 'Watt', 'Ohm', 'Ampere'], answer: 3, explanation: 'Electric current is measured in Amperes (A)' },
    { id: 5, question: 'Which type of lever has the fulcrum between the effort and load?', choices: ['First class', 'Second class', 'Third class', 'Fourth class'], answer: 0, explanation: 'First class lever: fulcrum is between effort and load (e.g., seesaw)' },
    { id: 6, question: 'What does HTML stand for?', choices: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], answer: 0, explanation: 'HTML = HyperText Markup Language — used for web pages' },
    { id: 7, question: 'Which of these is an input device?', choices: ['Monitor', 'Printer', 'Keyboard', 'Speaker'], answer: 2, explanation: 'A keyboard is an input device — it sends data to the computer' },
    { id: 8, question: 'What is 1 byte equal to?', choices: ['4 bits', '8 bits', '16 bits', '32 bits'], answer: 1, explanation: '1 byte = 8 bits' },
    { id: 9, question: 'In a simple circuit, what happens if a wire is cut?', choices: ['Current doubles', 'Current flows normally', 'Circuit opens, current stops', 'Voltage increases'], answer: 2, explanation: 'Cutting a wire opens the circuit and stops current flow' },
    { id: 10, question: 'What type of energy does a battery store?', choices: ['Kinetic energy', 'Chemical energy', 'Thermal energy', 'Nuclear energy'], answer: 1, explanation: 'A battery stores chemical energy and converts it to electrical energy' },
  ],
}

function ExamRoom() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const school = searchParams.get('school') || 'general'
  const subject = searchParams.get('subject') || 'math'
  const difficulty = searchParams.get('difficulty') || 'mixed'
  const count = parseInt(searchParams.get('count') || '10')

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(count * 60)
  const [finished, setFinished] = useState(false)
  const [flagged, setFlagged] = useState({})

  // Load questions: try Supabase first, fall back to sample questions
  useEffect(() => {
    async function load() {
      const dbQuestions = await fetchQuestionsFromDB(school, subject, difficulty, count)
      const finalQuestions = (dbQuestions && dbQuestions.length > 0)
        ? dbQuestions
        : (() => {
            const subjectKey = subject === 'all' ? 'math' : subject
            const raw = SAMPLE_QUESTIONS[subjectKey] || SAMPLE_QUESTIONS.math
            return raw.slice(0, Math.min(count, raw.length))
          })()
      if (finalQuestions.length === 0) { setError(true); setLoading(false); return }
      setQuestions(finalQuestions)
      setTimeLeft(finalQuestions.length * 60)
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Save session to Supabase when exam finishes
  useEffect(() => {
    if (!finished || questions.length === 0) return
    const score = questions.filter((q, i) => answers[i] === q.answer).length
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

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading questions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Couldn’t load questions</div>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Check your internet connection and try again.</p>
          <button className="btn btn-primary" onClick={() => { setError(false); setLoading(true) }} style={{ width: '100%' }}>Try Again</button>
        </div>
      </div>
    )
  }

  const handleAnswer = (i) => {
    if (showAnswer) return
    setAnswers(a => ({ ...a, [current]: i }))
    setShowAnswer(true)
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1)
    setShowAnswer(false)
  }

  const handleFinish = () => setFinished(true)

  const toggleFlag = () => setFlagged(f => ({ ...f, [current]: !f[current] }))

  // Results
  if (finished) {
    const score = questions.filter((q, i) => answers[i] === q.answer).length
    const percent = Math.round((score / questions.length) * 100)
    const passed = percent >= 60

    return (
      <div style={{ minHeight: '100vh', padding: '24px', maxWidth: 700, margin: '0 auto' }}>
        {/* Score card */}
        <div className="card" style={{ textAlign: 'center', marginBottom: 24, borderColor: passed ? '#3fb950' : '#f85149' }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>{passed ? '🎉' : '📚'}</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: passed ? '#3fb950' : '#f85149' }}>{score}/{questions.length}</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{percent}%</div>
          <span className={`badge ${passed ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 14, padding: '6px 16px' }}>
            {passed ? '✅ PASSED' : '❌ NEEDS IMPROVEMENT'}
          </span>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 16 }}>
            {passed ? 'Great job! Keep practicing to improve your score.' : "Don't give up! Review the explanations below and try again."}
          </p>
        </div>

        {/* Answer review */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Answer Review</div>
          {questions.map((q, i) => {
            const userAnswer = answers[i]
            const isCorrect = userAnswer === q.answer
            const answered = userAnswer !== undefined
            return (
              <div key={i} className="card" style={{ marginBottom: 12, borderColor: !answered ? 'var(--border)' : isCorrect ? '#3fb950' : '#f85149' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>{!answered ? '⬜' : isCorrect ? '✅' : '❌'}</span>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Q{i + 1}. {q.question}</div>
                </div>
                {!answered && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Not answered</div>}
                {answered && !isCorrect && (
                  <div style={{ fontSize: 12, color: '#f85149', marginBottom: 4 }}>Your answer: {q.choices[userAnswer]}</div>
                )}
                <div style={{ fontSize: 12, color: '#3fb950', marginBottom: 8 }}>Correct: {q.choices[q.answer]}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--card2)', padding: '8px 12px', borderRadius: 6 }}>
                  💡 {q.explanation}
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => { setCurrent(0); setAnswers({}); setShowAnswer(false); setTimeLeft(questions.length * 60); setFinished(false); setFlagged({}) }} style={{ flex: 1 }}>
            🔄 Retake Exam
          </button>
          <button className="btn btn-outline" onClick={() => router.push(`/exam?school=${school}`)} style={{ flex: 1 }}>
            ← Choose Another Subject
          </button>
        </div>
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
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            Question <strong style={{ color: 'var(--text)' }}>{current + 1}</strong> of {questions.length}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={toggleFlag} style={{ background: flagged[current] ? 'rgba(201,168,76,0.2)' : 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 14, color: flagged[current] ? 'var(--gold)' : 'var(--muted)' }}>
              🚩 {flagged[current] ? 'Flagged' : 'Flag'}
            </button>
            <div style={{ background: timeWarning ? 'rgba(248,81,73,0.15)' : 'var(--card)', border: `1px solid ${timeWarning ? '#f85149' : 'var(--border)'}`, borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 15, color: timeWarning ? '#f85149' : 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
              ⏱️ {formatTime(timeLeft)}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {q.choices.map((choice, i) => {
            let cls = 'choice-btn'
            if (showAnswer) {
              if (i === q.answer) cls += ' correct'
              else if (answers[current] === i && i !== q.answer) cls += ' wrong'
            } else if (answers[current] === i) {
              cls += ' selected'
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={showAnswer}>
                <span className="choice-label">{['A', 'B', 'C', 'D'][i]}</span>
                {choice}
                {showAnswer && i === q.answer && <span style={{ marginLeft: 'auto', color: '#3fb950', fontSize: 16 }}>✓</span>}
                {showAnswer && answers[current] === i && i !== q.answer && <span style={{ marginLeft: 'auto', color: '#f85149', fontSize: 16 }}>✗</span>}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showAnswer && (
          <div className="exam-explanation">
            <strong style={{ color: 'var(--gold)' }}>💡 Explanation: </strong>{q.explanation}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!answered && !showAnswer && (
            <button className="btn btn-outline" onClick={handleFinish} style={{ flex: 1 }}>
              Finish Early
            </button>
          )}
          {(showAnswer || !answered) && (
            <button className="btn btn-primary" onClick={answered ? handleNext : handleFinish}
              style={{ flex: 1 }} disabled={!showAnswer && answered === undefined}>
              {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          )}
        </div>

        {/* Question dots */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20, justifyContent: 'center' }}>
          {questions.map((_, i) => (
            <button key={i} style={{
              width: 44, height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: i === current ? 'var(--gold)' : answers[i] !== undefined ? 'rgba(63,185,80,0.3)' : 'var(--card)',
              color: i === current ? '#0d1117' : answers[i] !== undefined ? '#3fb950' : 'var(--muted)',
              border: `1px solid ${i === current ? 'var(--gold)' : flagged[i] ? 'var(--gold)' : 'var(--border)'}`,
              boxShadow: flagged[i] ? '0 0 0 2px rgba(201,168,76,0.4)' : 'none',
            }} onClick={() => { if (!showAnswer) { setCurrent(i); setShowAnswer(answers[i] !== undefined) } }}>
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default function ExamStartPage() {
  return <Suspense><ExamRoom /></Suspense>
}
