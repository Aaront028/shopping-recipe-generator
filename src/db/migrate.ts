import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

console.log('POSTGRES_URL:', process.env.POSTGRES_URL)

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not set')
  }

  console.log('Connecting to database...')
  const connection = postgres(process.env.POSTGRES_URL, { max: 1 })

  console.log('Creating drizzle instance...')
  const db = drizzle(connection)

  console.log('Running migrations...')
  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('Migrations complete!')
  } catch (error) {
    console.error('Migration failed:', error)
  }

  await connection.end()
  process.exit(0)
}

runMigrate().catch((err) => {
  console.error('Migration failed!')
  console.error(err)
  process.exit(1)
})
