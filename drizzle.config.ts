import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/drizzle/schema.ts',
  out: './lib/drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
