import { Hono } from 'hono'
import { generateSlideFromOutline } from '../services/gemini'
import Presentation from '../models/presentation'
import { requireAuth } from '@/middleware/auth.middleware'

const slidesRoutes = new Hono()

slidesRoutes.post('/', requireAuth, async (c) => {
  try {
    const { outline, numSlides,outlineId } = await c.req.json()
    // ✅ Validate input
    if (!outline) {
      return c.json({ error: 'Outline is required' }, 400)
    }

    // ✅ Get authenticated user from context
    const user = c.get('user')
    const userId = user?.id || user?._id 
    if (!userId) {
      return c.json({ error: 'User ID not found in session' }, 401)
    }

    // ✅ Generate slides
    const { slides } = await generateSlideFromOutline(outline, numSlides)

    // ✅ Save to DB
    const presentation = new Presentation({
      userId,
      outlineId,
      slides,
      title: 'Generated Presentation',
    })
    await presentation.save()

    // ✅ Return both slides AND the _id
    return c.json({
      slides,
      _id: presentation._id.toString(),
    }, 200)
  } catch (err: any) {
    console.error('Error in /api/slide:', err)
    return c.json(
      { error: 'Failed to generate slides', details: err.message },
      500
    )
  }
})

slidesRoutes.get('/', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const userId = user?.id || user?._id

    if (!userId) {
      return c.json({ error: 'User ID not found in session' }, 401)
    }

    const presentations = await Presentation.find({ userId })

    return c.json({ presentations }, 200)
  } catch (err: any) {
    console.error('Error fetching user presentations:', err)
    return c.json(
      { error: 'Failed to fetch presentations', details: err.message },
      500
    )
  }
})

export default slidesRoutes
