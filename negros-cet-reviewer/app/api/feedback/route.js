import { createClient } from '@supabase/supabase-js'

// Per-IP rate limiter: max 3 feedback submissions per 60 seconds.
const submits = new Map() // ip -> { count, windowStart }
const WINDOW_MS = 60_000
const MAX_SUBMITS = 3

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = submits.get(ip)
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    submits.set(ip, { count: 1, windowStart: now })
    return false
  }
  if (entry.count >= MAX_SUBMITS) return true
  entry.count++
  return false
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (checkRateLimit(ip)) {
    return Response.json(
      { error: 'Too many submissions. Wait a minute before trying again.' },
      { status: 429 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, message } = body

  if (!message?.trim() || message.trim().length > 1000) {
    return Response.json(
      { error: 'Message is required and must be under 1000 characters.' },
      { status: 400 }
    )
  }
  if (name && name.length > 100) {
    return Response.json({ error: 'Name must be under 100 characters.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { error } = await supabase.from('feedback').insert({
    name: name?.trim() || null,
    message: message.trim(),
  })

  if (error) {
    return Response.json({ error: 'Failed to save feedback.' }, { status: 500 })
  }

  return Response.json({ success: true })
}
