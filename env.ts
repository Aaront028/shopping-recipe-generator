import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export const env = {
  POSTGRES_URL: process.env.POSTGRES_URL || '',
}
