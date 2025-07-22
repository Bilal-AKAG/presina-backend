import 'dotenv/config' 
export const ENV = {
  PORT:process.env.PORT ||5000,
  MONGO_URI:process.env.MONGO_URI as string,
  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET as string
}

