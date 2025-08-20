import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './config/auth.config'
import { connectDB, connectMongoNative } from './config/db.config'
import { ENV } from './config/env.config'
import { outlineRoutes } from './routes/outline'
import slidesRoutes from './routes/slides'
import templateRoutes from './routes/templates'
import exportRoutes from './routes/export'

const app = new Hono()

async function startServer() {
  // CORS configuration
  app.use(
    cors({
      origin: 'http://localhost:3000',
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    })
  )

  // Connect to MongoDB
  await connectDB()
  await connectMongoNative()

  // Auth routes
app.all('/api/auth/*', async (c) => {

  try {
    const res = await auth.handler(c.req.raw)
    console.log(res)
    return res
    
  } catch (err) {
    console.error('💥 [Auth] Handler error:', err)
    return c.text('Internal Error', 500)
  }
})

  // Mount API routes
  app.route('/api', outlineRoutes)
  app.route('/api/slide', slidesRoutes)
  app.route('/api/templates', templateRoutes)
  app.route('/api/export', exportRoutes)


  // Base route
  app.get('/', (c) => c.text('Greeting from Team 2!'))

  // Start server
  return {
    port: ENV.PORT,
    fetch: app.fetch,
  }
}

// Export server for Bun
export default await startServer()
