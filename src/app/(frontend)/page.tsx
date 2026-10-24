import Link from 'next/link'

import { Empty, SiteFooter, SiteHeader } from '@/components/Chrome'
import { Photo } from '@/components/Photo'
import { getClient } from '@/lib/payload'
import { categoryLabel, readTime } from '@/lib/format'
import type { Article, Trip } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getClient()

  const [settings, newestTrips, featuredRes, latestRes] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 2 }),
    payload.find({ collection: 'trips', limit: 6, sort: '-year', depth: 1 }),
    payload.find({ collection: 'articles', where: { featured: { equals: true } }, limit: 1, sort: '-publishedAt', depth: 1 }),
    payload.find({ collection: 'articles', limit: 5, sort: '-publishedAt', depth: 1 }),
  ])

  // Relationships that point at drafts (or deleted items) come back as plain ids: skip those.
  const populated = <T extends object>(items: (T | number | null | undefined)[] | null | undefined): T[] =>
    (items ?? []).filter((x): x is T => Boolean(x) && typeof x === 'object')

  // What the editor picked in Site settings wins; anything left empty is filled automatically.
  const pickedAlbums = populated<Trip>(settings.featuredAlbums).slice(0, 6)
  const albums = pickedAlbums.length ? pickedAlbums : newestTrips.docs

  const pickedFeatured = typeof settings.featuredArticle === 'object' ? settings.featuredArticle : null
  const featured = pickedFeatured ?? featuredRes.docs[0] ?? latestRes.docs[0]

  const pickedMore = populated<Article>(settings.moreArticles).filter((a) => a.id !== featured?.id).slice(0, 3)
  const others = pickedMore.length ? pickedMore : latestRes.docs.filter((a) => a.id !== featured?.id).slice(0, 3)

  const chosen = (settings.heroPhotos ?? []).map((p) => p.image)
  const covers = albums.map((t) => t.cover)
  const collage = [0, 1, 2, 3].map((i) => chosen[i] ?? covers[i])

  return (
    <>
      <SiteHeader />

      <section className="container hero">
        <div className="stack gap-28">
          <div className="eyebrow">Travel photo albums and stories</div>
          <h1 className="display">{settings.heroTitle}</h1>
          <p className="lead">{settings.heroText}</p>
          <div className="stack" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <Link href="/albums" className="btn">Browse the albums</Link>
            <Link href="/articles" className="link-plain">Read the articles</Link>
          </div>
        </div>
        <div className="hero-collage" aria-hidden={collage.every((m) => !m)}>
          <Photo media={collage[0]} label="Portrait photo" sizes="(max-width: 700px) 50vw, 25vw" eager />
          <Photo media={collage[1]} label="Photo" sizes="(max-width: 700px) 50vw, 25vw" eager />
          <Photo media={collage[2]} label="Photo" sizes="(max-width: 700px) 50vw, 25vw" eager />
          <Photo media={collage[3]} label="Panoramic photo" sizes="(max-width: 700px) 100vw, 50vw" eager />
        </div>
      </section>

      <section className="container section" id="albums">
        <div className="section-head">
          <h2 className="h2">Travel albums</h2>
          <Link href="/albums" className="link">All albums →</Link>
        </div>
        {albums.length === 0 ? (
          <Empty>
            No albums yet. <Link href="/admin/collections/trips/create">Add the first one in the admin panel</Link>.
          </Empty>
        ) : (
          <div className="grid-3">
            {albums.map((t) => (
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

      {featured ? (
        <section className="band">
          <div className="container">
            <div className="band-head">
              <h2 className="h2">From the journal</h2>
              <Link href="/articles" className="link">All articles →</Link>
            </div>
            <div className="grid-feature">
              <Link href={`/articles/${featured.slug}`} className="card" style={{ gap: 24 }}>
                <Photo media={featured.heroImage} label="Main article photo" className="r32" sizes="(max-width: 700px) 100vw, 50vw" />
                <div className="stack gap-12">
                  <div className="eyebrow">{categoryLabel(featured.category)}{readTime(featured.readingMinutes)}</div>
                  <div className="feature-title ttl">{featured.title}</div>
                  <p style={{ fontSize: 17, color: 'var(--body)' }}>{featured.excerpt}</p>
                </div>
              </Link>
              <div className="stack">
                {others.map((a) => (
                  <Link key={a.id} href={`/articles/${a.slug}`} className="row-card card" style={{ gap: 24 }}>
                    <Photo media={a.heroImage} label="" sizes="140px" />
                    <div className="stack gap-6">
                      <div className="kicker">{categoryLabel(a.category)}</div>
                      <div className="row-title ttl">{a.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container" id="about" style={{ paddingBlock: '96px 0' }}>
        <div className="grid-3" style={{ gap: 48 }}>
          <div className="stack gap-20">
            <h2 className="h2">About</h2>
            <p className="lead" style={{ fontSize: 18 }}>
              {settings.about || 'Add a few words about yourself in the admin panel (Site settings).'}
            </p>
          </div>
          <div className="stack gap-12" style={{ fontSize: 16 }}>
            <div className="kicker">Contact</div>
            {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
            {settings.instagram ? <a href={settings.instagram}>Instagram</a> : null}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
