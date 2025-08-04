import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
// import { Resend } from 'resend'
import { client } from '@/config/db.config'
// import EmailVerification from '../service/email/email-template'
// import PasswordResetEmail from '../service/email/password-reset-template'
import { ENV } from './env.config'

const db = client.db()

// const resend = new Resend(ENV.RESEND_API_KEY)

export const auth = betterAuth({
  trustedOrigins: ['http://localhost:3000'],
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    // sendResetPassword: async ({ user, url }) => {
    //   const urlObj = new URL(url)
    //   urlObj.searchParams.set(
    //     'callbackURL',
    //     'http://localhost:3000/reset-password' // frontend route
    //   )
    //   const customUrl = urlObj.toString()

    //   await resend.emails.send({
    //     from: 'Persina Ai <onboarding@resend.dev>',
    //     to: [user.email],
    //     subject: 'Reset your password',
    //     react: PasswordResetEmail({
    //       userName: user.name,
    //       resetUrl: customUrl,
    //       requestTime: new Date().toLocaleString(),
    //     }),
    //   })
    // },
    // requireEmailVerification: true,
    autoSignIn: false,
  },
  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url }) => {
  //     const urlObj = new URL(url)
  //     urlObj.searchParams.set(
  //       'callbackURL',
  //       'http://localhost:3000/home' // frontend route
  //     )
  //     const customUrl = urlObj.toString()

  //     await resend.emails.send({
  //       from: 'Persina AI <onboarding@resend.dev>',
  //       to: user.email,
  //       subject: 'Verify your email address',
  //       react: EmailVerification({
  //         userName: user.name,
  //         verificationUrl: customUrl,
  //       }),
  //     })
  //   },
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    cookiePrefix: 'ppt-gen-ai',
  },
})
