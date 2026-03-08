import { createClient } from '@supabase/supabase-js'

// Per-IP rate limiter: max 5 reports per 60 seconds.
const reportMap = new Map() // ip -> { count, windowStart }
const WINDOW_MS = 60_000
const MAX_REPORTS = 5

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = reportMap.get(ip)
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    reportMap.set(ip, { count: 1, windowStart: now })
    return false
  }
  if (entry.count >= MAX_REPORTS) return true
  entry.count++
  return false
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (checkRateLimit(ip)) {
    return Response.json({ error: 'Too many reports.' }, { status: 429 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { question_id, details } = body

  if (!question_id || typeof question_id !== 'string') {
    return Response.json({ error: 'question_id is required.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { error } = await supabase.from('reports').insert({
    question_id,
    reason: 'user-report',
    details: details ? String(details).slice(0, 2000) : null,
  })

  if (error) {
    return Response.json({ error: 'Failed to save report.' }, { status: 500 })
  }

  return Response.json({ success: true })
}
