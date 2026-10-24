import type { Media } from '@/payload-types'

type MaybeMedia = Media | number | null | undefined

export const asMedia = (m: MaybeMedia): Media | null => (m && typeof m === 'object' ? m : null)

/** Builds a srcSet from the resized variants Payload generates for every upload. */
export function srcSetFor(m: Media): string | undefined {
  const entries = [m.sizes?.thumb, m.sizes?.card, m.sizes?.large]
    .filter((s): s is NonNullable<typeof s> => Boolean(s?.url && s?.width))
    .map((s) => `${s.url} ${s.width}w`)
  return entries.length ? entries.join(', ') : undefined
}

/**
 * A responsive photo. Falls back to a labelled placeholder when no image is set,
 * so pages still look right while content is being added.
 */
export function Photo({
  media,
  sizes = '(max-width: 700px) 100vw, 50vw',
  label = 'Photo',
  className = '',
  eager = false,
}: {
  media: MaybeMedia
  sizes?: string
  label?: string
  className?: string
  eager?: boolean
}) {
  const m = asMedia(media)
  if (!m?.url) {
    return (
      <div className={`ph ${className}`}>
        <span className="ph-label">[{label.toUpperCase()}]</span>
      </div>
    )
  }
  const src = m.sizes?.card?.url || m.url
  return (
    <div className={`ph ${className}`}>
      <img
        src={src}
        srcSet={srcSetFor(m)}
        sizes={sizes}
        alt={m.alt}
        width={m.width ?? undefined}
        height={m.height ?? undefined}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}
