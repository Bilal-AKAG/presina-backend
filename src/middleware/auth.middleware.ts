import type  { MiddlewareHandler } from 'hono'
import { auth } from '@/config/auth.config' 

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session || !session.user) {
    return c.json({ error: 'Unauthorized access' }, 401)
  }

  // Attach user to context for downstream handlers
  c.set('user', session.user)

  await next()
}
