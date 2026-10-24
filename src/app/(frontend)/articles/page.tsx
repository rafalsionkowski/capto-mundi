import type { Metadata } from 'next'
import Link from 'next/link'

import { Empty, SiteFooter, SiteHeader } from '@/components/Chrome'
import { Photo } from '@/components/Photo'
import { categoryLabel, readTime } from '@/lib/format'
import { getClient } from '@/lib/payload'
import { articleCategories } from '@/collections/Articles'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Articles' }

type Props = { searchParams: Promise<{ category?: string }> }

export default async function ArticlesPage({ searchParams }: Props) {
  const { category } = await searchParams
  const valid = articleCategories.some((c) => c.value === category) ? category : undefined

  const payload = await getClient()
  const res = await payload.find({
    collection: 'articles',
    where: valid ? { category: { equals: valid } } : undefined,
    sort: '-publishedAt',
    limit: 100,
    depth: 1,
  })

  const chips = [{ label: 'All', value: undefined as string | undefined }, ...articleCategories.map((c) => ({ label: c.label, value: c.value as string | undefined }))]

  return (
    <>
      <SiteHeader current="articles" />
      <section className="container stack gap-32" style={{ paddingBlock: 48 }}>
        <div className="stack gap-20">
          <div className="eyebrow">Travel journal</div>
          <h1 className="display-md">Articles</h1>
          <p className="lead">Travelogues, routes and practical tips from the journeys behind the photos in the albums.</p>
        </div>
        <div className="chips" role="group" aria-label="Category filter">
          {chips.map((c) => (
            <Link
              key={c.label}
              className="chip"
              href={c.value ? `/articles?category=${c.value}` : '/articles'}
              aria-current={(valid ?? undefined) === c.value ? 'true' : undefined}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        {res.docs.length === 0 ? (
          <Empty>
            No articles here yet. <Link href="/admin/collections/articles/create">Write the first one in the admin panel</Link>.
          </Empty>
        ) : (
          <div className="grid-3" style={{ borderTop: '1px solid var(--line)', paddingTop: 48, rowGap: 56 }}>
            {res.docs.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="card" style={{ gap: 20 }}>
                <Photo media={a.heroImage} label="Article photo" className="r32" sizes="(max-width: 700px) 100vw, 33vw" />
                <div className="stack gap-12">
                  <div className="kicker">{categoryLabel(a.category)}{readTime(a.readingMinutes)}</div>
                  <div className="card-title ttl" style={{ textWrap: 'balance' }}>{a.title}</div>
                  <p style={{ fontSize: 16, color: 'var(--body)' }}>{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </>
  )
}
