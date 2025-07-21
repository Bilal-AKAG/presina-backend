import { Hono } from 'hono'
import { connectDB, connectMongoNative } from './config/db.config'
import { ENV } from './config/env.config'
import { auth } from './config/auth.config'

const app = new Hono()

// connect to MongoDB using Mongoose
await connectDB()

// native mongo client for better auth
await connectMongoNative()

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

app.get('/', (c) => {
  return c.text('Greeting from Team 2!')
})

export default {
  port: ENV.PORT,
  fetch: app.fetch,
}
