'use client'

import React, { useCallback, useEffect, useState } from 'react'

export type GalleryPhoto = {
  src: string
  full: string
  srcSet?: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const total = photos.length

  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(() => setOpen((i) => (i === null ? i : (i + total - 1) % total)), [total])
  const next = useCallback(() => setOpen((i) => (i === null ? i : (i + 1) % total)), [total])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close, prev, next])

  const current = open === null ? null : photos[open]

  return (
    <>
      <div className="masonry">
        {photos.map((p, i) => (
          <div className="shot-wrap" key={p.src + i}>
            <button className="shot" type="button" onClick={() => setOpen(i)} aria-label={`Enlarge photo ${i + 1}: ${p.alt}`}>
              <img
                src={p.src}
                srcSet={p.srcSet}
                sizes="(max-width: 700px) 100vw, 33vw"
                alt={p.alt}
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
              />
            </button>
            {p.caption ? <div className="shot-cap">{p.caption}</div> : null}
          </div>
        ))}
      </div>

      {current ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged photo">
          <div className="lb-bar">
            <div>
              {(open ?? 0) + 1} / {total}
            </div>
            <button className="lb-btn" type="button" onClick={close}>
              Close
            </button>
          </div>
          <div className="lb-stage">
            <button className="lb-btn" type="button" onClick={prev} aria-label="Previous photo">
              ←
            </button>
            <div className="lb-img">
              <img src={current.full} alt={current.alt} />
            </div>
            <button className="lb-btn" type="button" onClick={next} aria-label="Next photo">
              →
            </button>
          </div>
          <div className="lb-cap">{current.caption}</div>
        </div>
      ) : null}
    </>
  )
}
