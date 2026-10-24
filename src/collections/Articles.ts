import type { CollectionConfig, Field } from 'payload'

import { isEditor, publishedOrEditor } from '../lib/access'
import { slugFromTitle } from '../lib/slug'

const textList = (name: string, label: string): Field => ({
  name,
  label,
  type: 'array',
  labels: { singular: 'Item', plural: 'Items' },
  fields: [{ name: 'text', type: 'text', required: true }],
})

export const articleCategories = [
  { label: 'Travelogue', value: 'travelogue' },
  { label: 'Guide', value: 'guide' },
  { label: 'Route', value: 'route' },
  { label: 'Reflection', value: 'reflection' },
] as const

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
  },
  access: {
    read: publishedOrEditor,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  versions: { drafts: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Article',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'excerpt', type: 'textarea', required: true, admin: { description: 'Two or three sentences shown on cards and as the article intro.' } },
            { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
            { name: 'heroCaption', type: 'text' },
            { name: 'content', type: 'richText', required: true },
          ],
        },
        {
          name: 'practical',
          label: 'Practical info',
          description: 'Optional. Leave a field empty and it will not be shown.',
          fields: [
            {
              name: 'quick',
              label: 'At a glance',
              type: 'group',
              fields: [
                { name: 'bestSeason', type: 'text' },
                { name: 'timeNeeded', type: 'text' },
                { name: 'budgetPerDay', type: 'text' },
                { name: 'language', type: 'text' },
                { name: 'currency', type: 'text' },
              ],
            },
            {
              name: 'before',
              label: 'Before you go',
              type: 'group',
              fields: [
                { name: 'whenToGo', type: 'textarea' },
                { name: 'visa', label: 'Visa and documents', type: 'textarea' },
                { name: 'health', type: 'textarea' },
                { name: 'money', type: 'textarea' },
                { name: 'connectivity', type: 'textarea' },
              ],
            },
            {
              name: 'around',
              label: 'Getting there and around',
              type: 'group',
              fields: [
                { name: 'gettingThere', type: 'textarea' },
                { name: 'localTransport', type: 'textarea' },
                { name: 'carOrBike', type: 'textarea' },
                { name: 'onFoot', type: 'textarea' },
              ],
            },
            {
              name: 'stay',
              label: 'Where to stay and eat',
              type: 'group',
              fields: [
                { name: 'bestBase', type: 'textarea' },
                { name: 'whereIStayed', type: 'textarea' },
                { name: 'whereToEat', type: 'textarea' },
                { name: 'tryThis', type: 'textarea' },
              ],
            },
            {
              name: 'budget',
              label: 'Daily budget',
              type: 'group',
              fields: [
                { name: 'budget', type: 'textarea' },
                { name: 'midRange', type: 'textarea' },
                { name: 'comfortable', type: 'textarea' },
                { name: 'biggestCosts', type: 'textarea' },
              ],
            },
            textList('packing', 'What to pack'),
            textList('goodToKnow', 'Good to know'),
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Part of the URL. Leave empty to generate it from the title.' },
      hooks: { beforeValidate: [slugFromTitle] },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'travelogue',
      options: [...articleCategories],
      admin: { position: 'sidebar' },
    },
    { name: 'trip', type: 'relationship', relationTo: 'trips', admin: { position: 'sidebar', description: 'Links the article to its photo album.' } },
    { name: 'author', type: 'text', defaultValue: 'Rafal Sionkowski', admin: { position: 'sidebar' } },
    { name: 'place', type: 'text', admin: { position: 'sidebar', description: 'e.g. Porto, Portugal' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'readingMinutes', type: 'number', min: 1, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show on the home page as the main article.' } },
  ],
}
