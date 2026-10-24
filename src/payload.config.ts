import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { Media } from './collections/Media'
import { Trips } from './collections/Trips'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — Capto Mundi' },
  },
  collections: [Trips, Articles, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || undefined,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Photos go to an S3-compatible bucket (Railway Storage Bucket). Without BUCKET_NAME
    // (local development) files are stored on the local disk instead.
    s3Storage({
      enabled: Boolean(process.env.BUCKET_NAME),
      collections: { media: true },
      bucket: process.env.BUCKET_NAME || '',
      config: {
        credentials: {
          accessKeyId: process.env.BUCKET_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY || '',
        },
        region: process.env.BUCKET_REGION || 'auto',
        endpoint: process.env.BUCKET_ENDPOINT || undefined,
        forcePathStyle: process.env.BUCKET_FORCE_PATH_STYLE === 'true',
      },
    }),
  ],
})
