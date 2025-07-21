import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client } from '@/config/db.config'

const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db),
})
