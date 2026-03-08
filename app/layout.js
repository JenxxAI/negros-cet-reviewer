import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://negros-cet-reviewer.vercel.app'),
  title: 'NegrosREV — Free College Entrance Reviewer',
  description: 'Free community-based college entrance exam reviewer for students in Negros Occidental. Practice for SUNN, TUP, CHMSU, PNU and more.',
  openGraph: {
    title: 'NegrosREV — Free College Entrance Reviewer',
    description: 'Free practice reviewer for students in Negros Occidental. No signup. No ads.',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'NegrosREV' }],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NegrosREV',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#c9a84c',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Prevent flash of wrong theme (runs before hydration) */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('negrev_theme')==='light')document.documentElement.classList.add('light')}catch{}` }} />
      </head>
      <body>
        {children}
        {/* Register service worker for PWA / offline support */}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))` }} />
      </body>
    </html>
  )
}
