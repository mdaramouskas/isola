import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    // Use the pooled DATABASE_URL by default (recommended)
    url: env('DATABASE_URL'),
    // Keep directUrl available if you need to target the direct DB host
    directUrl: env('DIRECT_URL'),
    // Shadow DB for migrations/introspection
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
})
