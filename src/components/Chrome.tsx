import Link from 'next/link'
import React from 'react'

type NavKey = 'albums' | 'articles' | 'about'

export function SiteHeader({ current }: { current?: NavKey }) {
  const cur = (k: NavKey) => (current === k ? 'page' : undefined)
  return (
    <header className="container header">
      <div className="brand">
        <Link href="/" className="logo">
          Capto Mundi
        </Link>
        <span className="byline">by Rafal Sionkowski</span>
      </div>
      <nav className="nav" aria-label="Main">
        <Link href="/albums" aria-current={cur('albums')}>Albums</Link>
        <Link href="/articles" aria-current={cur('articles')}>Articles</Link>
        <Link href="/#about" aria-current={cur('about')}>About</Link>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="container footer">
      © {new Date().getFullYear()} Capto Mundi by Rafal Sionkowski. All photos and texts © Rafal Sionkowski.
    </footer>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="empty">{children}</div>
}
