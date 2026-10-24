import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { SiteFooter, SiteHeader } from '@/components/Chrome'
import { asMedia, Photo } from '@/components/Photo'
import { categoryLabel, formatDate, readTime } from '@/lib/format'
import { getClient } from '@/lib/payload'
import type { Article } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function loadArticle(slug: string) {
  const payload = await getClient()
  const res = await payload.find({ collection: 'articles', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  const article = res.docs[0]
  if (!article) return null
  const more = await payload.find({
    collection: 'articles',
    where: { id: { not_equals: article.id } },
    sort: '-publishedAt',
    limit: 3,
    depth: 1,
  })
  return { article, more: more.docs }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await loadArticle(slug)
  if (!data) return { title: 'Article' }
  const hero = asMedia(data.article.heroImage)
  return {
    title: data.article.title,
    description: data.article.excerpt,
    openGraph: hero?.sizes?.large?.url || hero?.url ? { images: [hero?.sizes?.large?.url || hero?.url || ''] } : undefined,
  }
}

type Practical = NonNullable<Article['practical']>

const rows = (pairs: [string, string | null | undefined][]) => pairs.filter(([, v]) => v && v.trim() !== '') as [string, string][]

function PracticalInfo({ p }: { p: Practical }) {
  const quick = rows([
    ['Best season', p.quick?.bestSeason],
    ['Time needed', p.quick?.timeNeeded],
    ['Budget per day', p.quick?.budgetPerDay],
    ['Language', p.quick?.language],
    ['Currency', p.quick?.currency],
  ])
  const groups: { title: string; items: [string, string][] }[] = [
    {
      title: 'Before you go',
      items: rows([
        ['When to go', p.before?.whenToGo],
        ['Visa and documents', p.before?.visa],
        ['Health', p.before?.health],
        ['Money', p.before?.money],
        ['Connectivity', p.before?.connectivity],
      ]),
    },
    {
      title: 'Getting there and around',
      items: rows([
        ['Getting there', p.around?.gettingThere],
        ['Local transport', p.around?.localTransport],
        ['Car or bike', p.around?.carOrBike],
        ['On foot', p.around?.onFoot],
      ]),
    },
    {
      title: 'Where to stay and eat',
      items: rows([
        ['Best base', p.stay?.bestBase],
        ['Where I stayed', p.stay?.whereIStayed],
        ['Where to eat', p.stay?.whereToEat],
        ['Try this', p.stay?.tryThis],
      ]),
    },
    {
      title: 'Daily budget',
      items: rows([
        ['Budget', p.budget?.budget],
        ['Mid-range', p.budget?.midRange],
        ['Comfortable', p.budget?.comfortable],
        ['Biggest costs', p.budget?.biggestCosts],
      ]),
    },
  ].filter((g) => g.items.length > 0)

  const lists = [
    { title: 'What to pack', items: (p.packing ?? []).map((i) => i.text) },
    { title: 'Good to know', items: (p.goodToKnow ?? []).map((i) => i.text) },
  ].filter((l) => l.items.length > 0)

  if (!quick.length && !groups.length && !lists.length) return null

  return (
    <section className="practical" id="practical">
      <div className="practical-head">
        <div className="eyebrow">Plan your own trip</div>
        <h2 className="h2" style={{ fontSize: 44 }}>Practical info</h2>
      </div>

      {quick.length ? (
        <div className="quick">
          {quick.map(([k, v]) => (
            <div key={k}>
              <div className="kicker">{k}</div>
              <div className="v">{v}</div>
            </div>
          ))}
        </div>
      ) : null}

      {groups.length || lists.length ? (
        <div className="pcards">
          {groups.map((g) => (
            <div className="pcard" key={g.title}>
              <h3 className="h3">{g.title}</h3>
              <dl>
                {g.items.map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          ))}
          {lists.map((l) => (
            <div className="pcard" key={l.title}>
              <h3 className="h3">{l.title}</h3>
              <ul>
                {l.items.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const data = await loadArticle(slug)
  if (!data) notFound()
  const { article, more } = data
  const trip = article.trip && typeof article.trip === 'object' ? article.trip : null

  const meta = [article.author, formatDate(article.publishedAt), article.place].filter(Boolean).join(' · ')

  return (
    <>
      <SiteHeader current="articles" />
      <article>
        <div className="narrow article-head">
          <Link href="/articles" className="back">← All articles</Link>
          <div className="eyebrow">{categoryLabel(article.category)}{readTime(article.readingMinutes)}</div>
          <h1 className="display-md">{article.title}</h1>
          <p className="lead-serif">{article.excerpt}</p>
          <div className="muted" style={{ fontSize: 14 }}>{meta}</div>
        </div>

        <div className="container">
          <Photo media={article.heroImage} label="Main photo" className="hero-img" sizes="100vw" eager />
          {article.heroCaption ? <div className="caption">{article.heroCaption}</div> : null}
        </div>

        <div className="prose-wrap">
          <div className="prose">
            <RichText data={article.content} />
          </div>
        </div>

        {article.practical ? <PracticalInfo p={article.practical} /> : null}
      </article>

      {trip ? (
        <section className="container" style={{ paddingTop: 96 }}>
          <Link href={`/albums/${trip.slug}`} className="card trip-link">
            <Photo media={trip.cover} label="Album cover" className="r32" sizes="(max-width: 700px) 100vw, 40vw" />
            <div className="stack gap-12">
              <div className="eyebrow">Album from this trip</div>
              <div className="feature-title ttl">{trip.title}</div>
              <div style={{ color: 'var(--body)' }}>See all the photos →</div>
            </div>
          </Link>
        </section>
      ) : null}

      {more.length ? (
        <section className="container" style={{ paddingBlock: '96px 0' }}>
          <h2 className="h2" style={{ fontSize: 36, marginBottom: 40 }}>Keep reading</h2>
          <div className="grid-3">
            {more.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="card">
                <Photo media={a.heroImage} label="" className="r32" sizes="(max-width: 700px) 100vw, 33vw" />
                <div className="stack gap-6">
                  <div className="kicker">{categoryLabel(a.category)}</div>
                  <div className="card-title ttl" style={{ fontSize: 26 }}>{a.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  )
}
