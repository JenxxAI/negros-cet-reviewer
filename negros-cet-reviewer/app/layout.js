import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'NegrosREV — Free College Entrance Reviewer',
  description: 'Free community-based college entrance exam reviewer for students in Negros Occidental. Practice for SUNN, TUP, CHMSU, PNU and more.',
  openGraph: {
    title: 'NegrosREV — Free College Entrance Reviewer',
    description: 'Free practice reviewer for students in Negros Occidental. No signup. No ads.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
