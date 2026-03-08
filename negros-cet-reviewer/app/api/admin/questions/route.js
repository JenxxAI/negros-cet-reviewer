import { createClient } from '@supabase/supabase-js'

// IP-based rate limiter: max 10 failed auth attempts per 15 minutes per IP.
// Note: in-memory — resets on instance restart (sufficient for deterring brute force).
const failedAttempts = new Map() // ip -> { count, windowStart }
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_FAILURES = 10

function isRateLimited(ip) {
  const now = Date.now()
  const entry = failedAttempts.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    return false
  }
  return entry.count >= RATE_LIMIT_MAX_FAILURES
}

function recordFailure(ip) {
  const now = Date.now()
  const entry = failedAttempts.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, windowStart: now })
  } else {
    entry.count++
  }
}

function clearFailures(ip) {
  failedAttempts.delete(ip)
}

export async function POST(request) {
  // Extract caller IP (X-Forwarded-For set by Vercel/proxy)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  // Rate limit check before password validation to prevent brute force
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many failed attempts. Try again later.' }, { status: 429 })
  }

  // Password check — ADMIN_PASSWORD is a server-only env var (never NEXT_PUBLIC_)
  const password = request.headers.get('x-admin-password')
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    recordFailure(ip)
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Successful auth — clear failure counter for this IP
  clearFailures(ip)

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: 'Server configuration error' }, { status: 500 })
  }

  // Service role client bypasses RLS — only used server-side
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    school_slug, subject_slug, question_text,
    choice_a, choice_b, choice_c, choice_d,
    correct_answer, difficulty, explanation,
  } = body

  // Input validation
  const validAnswers = ['a', 'b', 'c', 'd']
  const validDifficulties = ['easy', 'medium', 'hard']
  if (
    !school_slug || !subject_slug || !question_text ||
    !choice_a || !choice_b || !choice_c || !choice_d ||
    !validAnswers.includes(correct_answer) ||
    !validDifficulties.includes(difficulty)
  ) {
    return Response.json({ error: 'Missing or invalid required fields' }, { status: 400 })
  }

  // Length limits to prevent abuse
  if (
    question_text.length > 1000 ||
    choice_a.length > 300 || choice_b.length > 300 ||
    choice_c.length > 300 || choice_d.length > 300 ||
    (explanation && explanation.length > 2000)
  ) {
    return Response.json({ error: 'Content exceeds length limits' }, { status: 400 })
  }

  // Look up school
  const { data: schoolData, error: schoolErr } = await supabaseAdmin
    .from('schools')
    .select('id')
    .eq('slug', school_slug)
    .single()

  if (schoolErr || !schoolData) {
    return Response.json({ error: `School not found: ${school_slug}` }, { status: 400 })
  }

  // Look up subject under that school
  const { data: subjectData, error: subjectErr } = await supabaseAdmin
    .from('subjects')
    .select('id')
    .eq('slug', subject_slug)
    .eq('school_id', schoolData.id)
    .single()

  if (subjectErr || !subjectData) {
    return Response.json({ error: `Subject not found: ${subject_slug} under ${school_slug}` }, { status: 400 })
  }

  // Insert question
  const { data, error } = await supabaseAdmin
    .from('questions')
    .insert({
      school_id: schoolData.id,
      subject_id: subjectData.id,
      question_text,
      choice_a,
      choice_b,
      choice_c,
      choice_d,
      correct_answer,
      difficulty,
      explanation: explanation || null,
      is_active: true,
    })
    .select('id')
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Structured audit log — captured by Vercel log drains and dashboard
  console.log(JSON.stringify({
    event: 'question_added',
    id: data.id,
    school: school_slug,
    subject: subject_slug,
    difficulty,
    ip,
    ts: new Date().toISOString(),
  }))

  return Response.json({ success: true, id: data.id })
}
