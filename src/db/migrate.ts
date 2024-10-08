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

  try {
    // Apply the SQL migration for user preferences
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../../drizzle/0008_add_user_preferences_table.sql'),
      'utf8'
    )
    console.log('Executing SQL:', migrationSQL)
    await sql.unsafe(migrationSQL)
    console.log(
      'Custom SQL migration for user preferences applied successfully'
    )

    // Run Drizzle migrations
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('Drizzle migrations completed successfully')

    // Ensure proper date format for existing records
    await sql`
      UPDATE shopping_list_inventory_item
      SET expiration_date = TO_DATE(expiration_date, 'YYYY-MM-DD')
      WHERE expiration_date IS NOT NULL AND expiration_date != '';
    `
    console.log('Updated existing expiration dates to proper format')

    console.log('All migrations completed successfully!')
  } catch (error) {
    console.error('Migration error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  } finally {
    await sql.end()
  }
}

main().catch((err) => {
  console.error('Unhandled error during migration:', err)
  process.exit(1)
})
