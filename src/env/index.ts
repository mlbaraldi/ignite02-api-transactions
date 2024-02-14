import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  DB_URL: z.string(),
  DB_CLIENT: z.enum(['pg', 'sqlite']),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
