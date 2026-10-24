import type { GlobalConfig } from 'payload'

import { isEditor } from '../lib/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: { read: () => true, update: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Home page',
          description:
            'Choose what appears on the home page and where. Anything you leave empty is filled in automatically (newest albums and articles).',
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
              label: 'Top of the page: four photos next to the headline',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Photo', plural: 'Photos' },
              admin: {
                description:
                  'Order: 1 = tall portrait (left), 2 and 3 = small squares (top right), 4 = wide panorama (bottom). Empty slots fall back to album covers.',
              },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
            {
              name: 'featuredAlbums',
              label: 'Travel albums section: which albums, in which order',
              type: 'relationship',
              relationTo: 'trips',
              hasMany: true,
              maxRows: 6,
              admin: {
                description:
                  'Up to 6 albums, shown in this order with their cover photos. Leave empty to show the newest albums. Only published albums are visible to visitors.',
              },
            },
            {
              name: 'featuredArticle',
              label: 'From the journal: the large article',
              type: 'relationship',
              relationTo: 'articles',
              admin: {
                description:
                  'Shown large, with its hero image. Leave empty to use the article marked as Featured (or the newest one).',
              },
            },
            {
              name: 'moreArticles',
              label: 'From the journal: the three smaller articles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
              maxRows: 3,
              admin: {
                description: 'Shown as a list next to the large article, with their hero images. Leave empty to show the newest ones.',
              },
            },
          ],
        },
        {
          label: 'About and contact',
          fields: [
            { name: 'about', type: 'textarea', admin: { description: 'Shown in the About section of the home page.' } },
            { name: 'email', type: 'email' },
            { name: 'instagram', type: 'text', admin: { description: 'Full profile URL.' } },
          ],
        },
      ],
    },
  ],
}
