import mongoose from 'mongoose'
import { config } from '../config.js'

export async function dbPlugin(fastify) {
  await mongoose.connect(config.mongoUri)

  fastify.addHook('onClose', async () => {
    await mongoose.disconnect()
  })
}
