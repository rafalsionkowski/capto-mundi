const labels: Record<string, string> = {
  travelogue: 'Travelogue',
  guide: 'Guide',
  route: 'Route',
  reflection: 'Reflection',
}

export const categoryLabel = (c?: string | null) => (c ? labels[c] ?? c : '')

export const readTime = (minutes?: number | null) => (minutes ? ` · ${minutes} min read` : '')

export const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
