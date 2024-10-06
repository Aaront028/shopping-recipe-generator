import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = postgres(process.env.POSTGRES_URL!, { max: 1 })
const db = drizzle(sql)

async function main() {
  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrations complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed!')
  console.error(err)
  process.exit(1)
})
