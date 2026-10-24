import type { Access } from 'payload'

/** Visitors see only published documents; logged-in editors see everything (incl. drafts). */
export const publishedOrEditor: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const isEditor: Access = ({ req: { user } }) => Boolean(user)
