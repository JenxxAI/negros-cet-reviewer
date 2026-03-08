'use client'
import { useRef } from 'react'

/**
 * CoinButton — a tier-tip button that plays a coin-flip animation on click,
 * then calls `onLanded()` after the coin has visually settled.
 *
 * Adapted from the vanilla JS coin-flip pen for React + Next.js.
 */
export default function CoinButton({ amount, label, icon, color, onLanded }) {
  const btnRef  = useRef(null)
  const coinRef = useRef(null)
  const state   = useRef({ clicked: false, moveLoopCount: 0, maxMoveLoopCount: 90, maxFlipAngle: 0, sideRotationCount: 0 })

  const runLoop = () => {
    const s    = state.current
    const coin = coinRef.current
    const btn  = btnRef.current
    if (!coin || !btn) return

    s.moveLoopCount++
    const pct   = s.moveLoopCount / s.maxMoveLoopCount
    const angle = -s.maxFlipAngle * Math.pow((pct - 1), 2) + s.maxFlipAngle

    // Coin trajectory
    coin.style.setProperty('--coin-y-multiplier',        String(-11 * Math.pow(pct * 2 - 1, 4) + 11))
    coin.style.setProperty('--coin-x-multiplier',        String(pct))
    coin.style.setProperty('--coin-scale-multiplier',    String(pct * 0.6))
    coin.style.setProperty('--coin-rotation-multiplier', String(pct * s.sideRotationCount))

    // Face scales / positions (simulate 3-D spin with sin/cos)
    coin.style.setProperty('--front-scale-multiplier', String(Math.max(Math.cos(angle), 0)))
    coin.style.setProperty('--front-y-multiplier',     String(Math.sin(angle)))
    coin.style.setProperty('--middle-scale-multiplier',String(Math.abs(Math.cos(angle))))
    coin.style.setProperty('--middle-y-multiplier',    String(Math.cos((angle + Math.PI / 2) % Math.PI)))
    coin.style.setProperty('--back-scale-multiplier',  String(Math.max(Math.cos(angle - Math.PI), 0)))
    coin.style.setProperty('--back-y-multiplier',      String(Math.sin(angle - Math.PI)))

    // Glare
    coin.style.setProperty('--shine-opacity-multiplier', String(4 * Math.sin((angle + Math.PI / 2) % Math.PI) - 3.2))
    coin.style.setProperty('--shine-bg-multiplier',      String(-40 * (Math.cos((angle + Math.PI / 2) % Math.PI) - 0.5)) + '%')

    if (s.moveLoopCount < s.maxMoveLoopCount) {
      if (s.moveLoopCount === s.maxMoveLoopCount - 6) btn.classList.add('shrink-landing')
      window.requestAnimationFrame(runLoop)
    } else {
      // Coin has landed
      btn.classList.add('coin-landed')
      coin.style.setProperty('opacity', '0')

      // Let "Thank you!" text show briefly before the parent reveals QR
      setTimeout(() => onLanded(), 750)

      // Clean up classes + reset coin for a possible replay
      setTimeout(() => {
        btn.classList.remove('clicked', 'shrink-landing', 'coin-landed')
        coin.style.setProperty('--coin-x-multiplier',         '0')
        coin.style.setProperty('--coin-scale-multiplier',     '0')
        coin.style.setProperty('--coin-rotation-multiplier',  '0')
        coin.style.setProperty('--shine-opacity-multiplier',  '0.4')
        coin.style.setProperty('--shine-bg-multiplier',       '50%')
        coin.style.setProperty('opacity', '1')
        setTimeout(() => { s.clicked = false }, 300)
      }, 1500)
    }
  }

  const handleClick = () => {
    const s = state.current
    if (s.clicked) return

    const btn = btnRef.current
    btn.classList.add('clicked')

    // Short delay so the button-tilt CSS transition fires first
    setTimeout(() => {
      s.sideRotationCount = Math.floor(Math.random() * 5) * 90
      s.maxFlipAngle      = (Math.floor(Math.random() * 4) + 3) * Math.PI
      s.moveLoopCount     = 0
      s.clicked           = true
      window.requestAnimationFrame(runLoop)
    }, 50)
  }

  return (
    <button
      ref={btnRef}
      className="coin-tip-btn"
      style={{ '--tier-color': color }}
      onClick={handleClick}
    >
      <span className="coin-btn-label">
        <span style={{ fontWeight: 700, color, position: 'relative', zIndex: 3 }}>{amount}</span>
        <span style={{ color: 'var(--muted)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, position: 'relative', zIndex: 3 }}>
          {icon} {label}
        </span>
      </span>

      {/* Coin launch area — 18rem tall, overflow-hidden keeps coin hidden at start */}
      <div className="coin-confetti">
        <div className="c-coin" ref={coinRef}>
          <div className="c-coin__middle" />
          <div className="c-coin__back" />
          <div className="c-coin__front" />
        </div>
      </div>
    </button>
  )
}
