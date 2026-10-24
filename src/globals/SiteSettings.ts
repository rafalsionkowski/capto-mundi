import type { GlobalConfig } from 'payload'

import { isEditor } from '../lib/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: { read: () => true, update: isEditor },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'The world, one frame and one story at a time.' },
    {
      name: 'heroText',
      type: 'textarea',
      defaultValue:
        'Photos from every journey, arranged into albums, with the stories behind them: the routes, the people, and what is worth knowing before you go.',
    },
    {
      name: 'heroPhotos',
      label: 'Home page photos',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: {
        description:
          'The four photos next to the headline on the home page. Order: 1 = tall portrait (left), 2 and 3 = small squares (top right), 4 = wide panorama (bottom). Empty slots fall back to album covers.',
      },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'about', type: 'textarea', admin: { description: 'Shown in the About section of the home page.' } },
    { name: 'email', type: 'email' },
    { name: 'instagram', type: 'text', admin: { description: 'Full profile URL.' } },
  ],
}
