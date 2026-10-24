import Link from 'next/link'

import { Empty, SiteFooter, SiteHeader } from '@/components/Chrome'
import { Photo } from '@/components/Photo'
import { getClient } from '@/lib/payload'
import { categoryLabel, readTime } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getClient()

  const [settings, trips, featuredRes, latestRes] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.find({ collection: 'trips', limit: 6, sort: '-year', depth: 1 }),
    payload.find({ collection: 'articles', where: { featured: { equals: true } }, limit: 1, sort: '-publishedAt', depth: 1 }),
    payload.find({ collection: 'articles', limit: 5, sort: '-publishedAt', depth: 1 }),
  ])

  const featured = featuredRes.docs[0] ?? latestRes.docs[0]
  const others = latestRes.docs.filter((a) => a.id !== featured?.id).slice(0, 3)
  const covers = trips.docs.map((t) => t.cover)

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
        <div className="hero-collage" aria-hidden={covers.length === 0}>
          <Photo media={covers[0]} label="Portrait photo" sizes="(max-width: 700px) 50vw, 25vw" eager />
          <Photo media={covers[1]} label="Photo" sizes="(max-width: 700px) 50vw, 25vw" eager />
          <Photo media={covers[2]} label="Photo" sizes="(max-width: 700px) 50vw, 25vw" eager />
          <Photo media={covers[3]} label="Panoramic photo" sizes="(max-width: 700px) 100vw, 50vw" eager />
        </div>
      </section>

      <section className="container section" id="albums">
        <div className="section-head">
          <h2 className="h2">Travel albums</h2>
          <Link href="/albums" className="link">All albums →</Link>
        </div>
        {trips.docs.length === 0 ? (
          <Empty>
            No albums yet. <Link href="/admin/collections/trips/create">Add the first one in the admin panel</Link>.
          </Empty>
        ) : (
          <div className="grid-3">
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
