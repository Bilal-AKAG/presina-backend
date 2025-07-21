import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'
import { ENV } from './env.config'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI)
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  }
}

// native mongo db client for better auth
export const client = new MongoClient(ENV.MONGO_URI)

export const connectMongoNative = async () => {
  try {
    await client.connect()
    console.log('✅ Native MongoClient connected (BetterAuth)')
  } catch (err) {
    console.error('❌ Failed to connect MongoClient:', err)
    process.exit(1)
  }
}
