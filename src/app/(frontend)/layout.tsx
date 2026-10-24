import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

export const metadata: Metadata = {
  title: { default: 'Capto Mundi — travel photo albums and journal', template: '%s — Capto Mundi' },
  description:
    'Travel photo albums and stories by Rafal Sionkowski: routes, people, and what is worth knowing before you go.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
