import type { CollectionConfig } from 'payload'

import { isEditor } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt' },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Short description of the photo (for accessibility and search engines).' },
    },
    { name: 'credit', type: 'text', admin: { description: 'Optional photo credit.' } },
  ],
  upload: {
    // HEIC (iPhone) is not supported by the image processor, so only web formats are accepted.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    // Store the original at web size: large camera files are scaled down on upload.
    resizeOptions: { width: 3200, height: 3200, fit: 'inside', withoutEnlargement: true },
    focalPoint: true,
    adminThumbnail: 'thumb',
    imageSizes: [
      { name: 'thumb', width: 600 },
      { name: 'card', width: 1100 },
      { name: 'large', width: 2000 },
    ],
  },
}
