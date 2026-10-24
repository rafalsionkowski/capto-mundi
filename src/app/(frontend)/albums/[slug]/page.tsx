import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SiteFooter, SiteHeader } from '@/components/Chrome'
import { Gallery, type GalleryPhoto } from '@/components/Gallery'
import { asMedia, srcSetFor } from '@/components/Photo'
import { getClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function loadTrip(slug: string) {
  const payload = await getClient()
  const res = await payload.find({ collection: 'trips', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  const trip = res.docs[0]
  if (!trip) return null
  const articles = await payload.find({
    collection: 'articles',
    where: { trip: { equals: trip.id } },
    limit: 1,
    sort: '-publishedAt',
    depth: 0,
  })
  return { trip, article: articles.docs[0] ?? null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await loadTrip(slug)
  return { title: data?.trip.title ?? 'Album', description: data?.trip.summary ?? undefined }
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params
  const data = await loadTrip(slug)
  if (!data) notFound()
  const { trip, article } = data

  const photos: GalleryPhoto[] = (trip.gallery ?? []).flatMap((item) => {
    const m = asMedia(item.image)
    if (!m?.url) return []
    return [
      {
        src: m.sizes?.card?.url || m.url,
        full: m.sizes?.large?.url || m.url,
        srcSet: srcSetFor(m),
        alt: m.alt,
        caption: item.caption ?? undefined,
        width: m.sizes?.card?.width ?? m.width ?? undefined,
        height: m.sizes?.card?.height ?? m.height ?? undefined,
      },
    ]
  })

  const facts = [
    photos.length ? `${photos.length} photos` : null,
    trip.days ? `${trip.days} days` : null,
    trip.route,
  ].filter(Boolean)

  const next = await (async () => {
    const payload = await getClient()
    const res = await payload.find({
      collection: 'trips',
      where: { id: { not_equals: trip.id } },
      sort: '-year',
      limit: 1,
      depth: 0,
    })
    return res.docs[0] ?? null
  })()

  return (
    <>
      <SiteHeader current="albums" />

      <section className="container album-head">
        <div className="stack gap-20">
          <Link href="/albums" className="back">← All albums</Link>
          <div className="eyebrow">{[trip.year, trip.country].filter(Boolean).join(' · ')}</div>
          <h1 className="display">{trip.title}</h1>
        </div>
        <div className="stack gap-28">
          {trip.summary ? <p className="lead">{trip.summary}</p> : null}
          {facts.length ? (
            <div className="facts">
              {facts.map((f) => (
                <div key={String(f)}>{f}</div>
              ))}
            </div>
          ) : null}
          {article ? (
            <Link href={`/articles/${article.slug}`} className="btn-outline">
              Read the article from this trip
            </Link>
          ) : null}
        </div>
      </section>

      <section className="container section">
        {photos.length ? <Gallery photos={photos} /> : <div className="empty">No photos in this album yet.</div>}
      </section>

      {next ? (
        <section className="band" style={{ paddingBlock: 80 }}>
          <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="h2" style={{ fontSize: 36 }}>Next journey</h2>
            <Link href={`/albums/${next.slug}`} className="btn">{next.title} →</Link>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  )
}
