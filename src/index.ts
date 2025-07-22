import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './config/auth.config'
import { connectDB, connectMongoNative } from './config/db.config'
import { ENV } from './config/env.config'

const app = new Hono()

// cors configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)

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
