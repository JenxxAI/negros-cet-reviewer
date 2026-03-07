import './globals.css'

export const metadata = {
  title: 'NegrosREV — Free College Entrance Reviewer',
  description: 'Free community-based college entrance exam reviewer for students in Negros Occidental. Practice for SUNN, TUP, CHMSU, PNU and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
