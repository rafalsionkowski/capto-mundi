import type { FieldHook } from 'payload'

export const slugify = (input: string): string =>
  input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/gi, 'l')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Fills the slug from the title when the editor leaves it empty. */
export const slugFromTitle: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.trim() !== '') return slugify(value)
  if (data && typeof data.title === 'string') return slugify(data.title)
  return value
}
