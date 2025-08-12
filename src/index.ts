import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/serve-static'
import { auth } from './config/auth.config'
import { connectDB, connectMongoNative } from './config/db.config'
import { ENV } from './config/env.config'
import { outlineRoutes } from './routes/outline'
import  slidesRoutes  from './routes/slides'

const app = new Hono()

// CORS configuration
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

// ✅ Serve generated PPTX files
app.use('/generated/*', serveStatic({
  root: './public',
  async getContent(path) {
    const file = Bun.file(path)
    return (await file.exists()) ? file : null
  },
}))

// Connect to MongoDB
await connectDB()
await connectMongoNative()

// Auth routes
app.on(['POST', 'GET', 'OPTIONS'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

// Mount API routes
app.route('/api', outlineRoutes)
app.route('/api', slidesRoutes)

// Base route
app.get('/', (c) => {
  return c.text('Greeting from Team 2!')
})

// Export for Bun
export default {
  port: ENV.PORT,
  fetch: app.fetch,
}