import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'turso',
  dialect: 'sqlite', // Add this line
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./shopping_list.db',
  },
  verbose: true,
  strict: true,
} satisfies Config
