import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { env } from '../env.js'
import fs from 'fs'
import path from 'path'

const sql = postgres(env.POSTGRES_URL, { max: 1 })
const db = drizzle(sql)

async function main() {
  console.log('Running migrations...')

  // Apply the SQL migration
  const migrationSQL = fs.readFileSync(
    path.join(
      __dirname,
      '../../drizzle/0006_add_user_id_to_shopping_tables.sql'
    ),
    'utf8'
  )
  await sql.unsafe(migrationSQL)

  // Run Drizzle migrations
  await migrate(db, { migrationsFolder: './drizzle' })

  console.log('Migrations complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed!')
  console.error(err)
  process.exit(1)
})
