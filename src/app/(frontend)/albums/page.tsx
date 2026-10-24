import type { Metadata } from 'next'
import Link from 'next/link'

import { Empty, SiteFooter, SiteHeader } from '@/components/Chrome'
import { Photo } from '@/components/Photo'
import { getClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Albums' }

export default async function AlbumsPage() {
  const payload = await getClient()
  const trips = await payload.find({ collection: 'trips', limit: 100, sort: '-year', depth: 1 })

  return (
    <>
      <SiteHeader current="albums" />
      <section className="container section">
        <div className="stack gap-20" style={{ paddingBlock: '48px 48px' }}>
          <div className="eyebrow">Photo albums</div>
          <h1 className="display-md">Albums</h1>
          <p className="lead">One album for every journey.</p>
        </div>
        {trips.docs.length === 0 ? (
          <Empty>
            No albums yet. <Link href="/admin/collections/trips/create">Add the first one in the admin panel</Link>.
          </Empty>
        ) : (
          <div className="grid-3" style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
            {trips.docs.map((t) => (
              <Link key={t.id} href={`/albums/${t.slug}`} className="card">
                <Photo media={t.cover} label="Album cover" className="r43" sizes="(max-width: 700px) 100vw, 33vw" />
                <div className="stack gap-6">
                  <div className="kicker">{[t.year, t.country].filter(Boolean).join(' · ')}</div>
                  <div className="card-title ttl">{t.title}</div>
                  <div className="muted" style={{ fontSize: 15 }}>
                    {(t.gallery?.length ?? 0) > 0 ? `${t.gallery?.length} photos` : ''}
                  </div>
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
