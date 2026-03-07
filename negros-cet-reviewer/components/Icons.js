// Minimalist SVG icon set — stroke-based (Feather-style), 24×24 viewBox
// All icons: fill="none", strokeLinecap="round", strokeLinejoin="round"

function Svg({ size, color, strokeWidth, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {children}
    </svg>
  )
}

export function IconTarget({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Svg>
  )
}

export function IconClock({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Svg>
  )
}

export function IconBarChart({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </Svg>
  )
}

export function IconTrendingUp({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </Svg>
  )
}

export function IconLightbulb({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </Svg>
  )
}

export function IconSmartphone({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </Svg>
  )
}

export function IconPlus({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  )
}

export function IconFileText({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </Svg>
  )
}

export function IconFlask({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.897L4.72 19.8a2 2 0 0 0 1.8 2.9h11.96a2 2 0 0 0 1.8-2.9l-5.069-9.376A2 2 0 0 1 14 9.527V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
    </Svg>
  )
}

export function IconGrid({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </Svg>
  )
}

export function IconFlag({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </Svg>
  )
}

export function IconGlobe({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  )
}

export function IconSettings({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  )
}

export function IconLayers({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </Svg>
  )
}

export function IconCheck({ size = 20, color = 'currentColor', strokeWidth = 2.5 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  )
}

export function IconX({ size = 20, color = 'currentColor', strokeWidth = 2.5 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  )
}

export function IconAlertTriangle({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  )
}

export function IconAward({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </Svg>
  )
}

export function IconBookOpen({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Svg>
  )
}

export function IconClipboard({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="16" y1="11" x2="8" y2="11" />
      <line x1="16" y1="15" x2="8" y2="15" />
    </Svg>
  )
}

export function IconSquare({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </Svg>
  )
}

export function IconRefresh({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Svg>
  )
}

export function IconStar({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  )
}

export function IconShare({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </Svg>
  )
}

export function IconCopy({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Svg>
  )
}

export function IconSun({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </Svg>
  )
}

export function IconMoon({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
  )
}

export function IconAlertOctagon({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </Svg>
  )
}

export function IconUser({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  )
}

export function IconLock({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  )
}

export function IconPlusCircle({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </Svg>
  )
}

export function IconChevronDown({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <polyline points="6 9 12 15 18 9" />
    </Svg>
  )
}

export function IconChevronLeft({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <polyline points="15 18 9 12 15 6" />
    </Svg>
  )
}

export function IconFacebook({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.931-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}

export function IconLinkedIn({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export function IconArrowRight({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Svg>
  )
}

export function IconHeart({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  )
}

export function IconMessageSquare({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  )
}

export function IconSend({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Svg>
  )
}

export function IconEye({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  )
}

export function IconEyeOff({ size = 20, color = 'currentColor', strokeWidth = 1.75 }) {
  return (
    <Svg size={size} color={color} strokeWidth={strokeWidth}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </Svg>
  )
}
