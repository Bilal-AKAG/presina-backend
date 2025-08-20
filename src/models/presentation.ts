// models/Presentation.ts
import mongoose from 'mongoose'

// Define Slide Types
type SlideType =
  | 'title'
  | 'bullet'
  | 'image-text'
  | 'quote'
  | 'chart'
  | 'title-content'
  | 'two-column'

// Sub-document: Slide
const slideSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['title', 'bullet', 'image-text', 'quote', 'chart', 'title-content', 'two-column'],
    required: true,
  },
  title: String,
  subtitle: String,
  heading: String,
  text: String,
  bullets: [String],
  image: String, // URL (e.g., from picsum.photos)
  quote: String,
  author: String,
  chart: {
    title: String,
    data: [{ name: String, value: Number }],
  },
  column1: {
    title: String,
    content: String,
  },
  column2: {
    title: String,
    content: String,
  },
}, { _id: false }) // No _id for subdocs

// Main: Presentation
const presentationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  outlineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Outline',
    required: false,
  },
  title: {
    type: String,
    default: 'Untitled Presentation',
  },
  slides: [slideSchema],
  theme: {
    type: String,
    enum: ['light', 'dark', 'modern', 'corporate'],
    default: 'modern',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster queries
presentationSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('Presentation', presentationSchema)