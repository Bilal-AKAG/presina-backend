import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client } from '@/config/db.config'
import { ENV } from './env.config'

const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    cookiePrefix: 'ppt-gen-ai',
  },
})
