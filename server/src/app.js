import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { authPlugin } from './plugins/auth.js'
import { dbPlugin } from './plugins/db.js'
import { authRoutes } from './users/auth-routes.js'
import { usersRoutes } from './users/users-routes.js'
import { transactionsRoutes } from './transactions/transactions-routes.js'
import { config } from './config.js'

export async function createApp() {
  const app = Fastify({ logger: false })

  await app.register(cors, {
    origin: config.clientOrigin,
    credentials: true
  })

  await app.register(cookie)
  await app.register(jwt, {
    secret: config.jwtSecret,
    cookie: {
      cookieName: config.cookieName,
      signed: false
    }
  })

  await app.register(dbPlugin)
  await app.register(authPlugin)

  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(usersRoutes, { prefix: '/users' })
  await app.register(transactionsRoutes, { prefix: '/transactions' })

  app.get('/', async () => ({ ok: true, service: 'budgetflow-api' }))

  return app
}
