import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'NegrosREV'
  const sub = searchParams.get('sub') || 'Free College Entrance Reviewer for Negros Occidental'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1117',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Gold accent bar */}
        <div style={{
          width: 80,
          height: 6,
          background: '#c9a84c',
          borderRadius: 3,
          marginBottom: 32,
        }} />

        {/* Logo */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#c9a84c',
          letterSpacing: '-3px',
          marginBottom: 20,
          display: 'flex',
        }}>
          NegrosREV
        </div>

        {/* Title */}
        <div style={{
          fontSize: 36,
          color: '#e6edf3',
          textAlign: 'center',
          marginBottom: 16,
          fontWeight: 700,
          display: 'flex',
        }}>
          {title}
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 22,
          color: '#8b949e',
          textAlign: 'center',
          marginBottom: 48,
          display: 'flex',
        }}>
          {sub}
        </div>

        {/* Badge */}
        <div style={{
          fontSize: 18,
          color: '#c9a84c',
          border: '2px solid rgba(201,168,76,0.5)',
          borderRadius: 12,
          padding: '12px 32px',
          display: 'flex',
          letterSpacing: '0.5px',
        }}>
          Free · No Signup · Negros Occidental
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
