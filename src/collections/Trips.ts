import type { CollectionConfig } from 'payload'

import { isEditor, publishedOrEditor } from '../lib/access'
import { slugFromTitle } from '../lib/slug'

export const Trips: CollectionConfig = {
  slug: 'trips',
  labels: { singular: 'Trip (album)', plural: 'Trips (albums)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'year', '_status'],
  },
  access: {
    read: publishedOrEditor,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'Place or name of the trip, e.g. the destination.' } },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Part of the URL. Leave empty to generate it from the title.' },
      hooks: { beforeValidate: [slugFromTitle] },
    },
    { name: 'country', type: 'text' },
    { name: 'year', type: 'number', min: 1900, max: 2100 },
    { name: 'days', type: 'number', min: 1 },
    { name: 'route', type: 'text', admin: { description: 'e.g. Lisbon → Porto → Douro Valley' } },
    { name: 'summary', type: 'textarea', admin: { description: 'Short description shown on the album page.' } },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: { description: 'Drag to reorder. Add photos from the media library or upload new ones.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
