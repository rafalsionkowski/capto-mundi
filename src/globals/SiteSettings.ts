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
    { name: 'about', type: 'textarea', admin: { description: 'Shown in the About section of the home page.' } },
    { name: 'email', type: 'email' },
    { name: 'instagram', type: 'text', admin: { description: 'Full profile URL.' } },
  ],
}
