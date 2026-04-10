import bcrypt from 'bcryptjs'
import { UserModel } from '../models/user-model.js'
import { config } from '../config.js'

function toUserResponse(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    monthlyBudget: user.monthlyBudget
  }
}

export async function authRoutes(fastify) {
  fastify.post('/register', async (request, reply) => {
    const { username, email, password } = request.body || {}

    if (!username || !email || !password) {
      return reply.code(400).send({ message: 'username, email and password are required' })
    }

    if (password.length < 8) {
      return reply.code(400).send({ message: 'password must have at least 8 characters' })
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return reply.code(409).send({ message: 'email already used' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await UserModel.create({
      username,
      email,
      passwordHash
    })

    return reply.code(201).send({ user: toUserResponse(user) })
  })

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body || {}

    if (!email || !password) {
      return reply.code(400).send({ message: 'email and password are required' })
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() })
    if (!user) {
      return reply.code(401).send({ message: 'invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return reply.code(401).send({ message: 'invalid credentials' })
    }

    const token = await reply.jwtSign({ sub: user._id.toString(), email: user.email })

    reply.setCookie(config.cookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.cookieSecure,
      path: '/'
    })

    return reply.send({ user: toUserResponse(user) })
  })

  fastify.post('/logout', async (_, reply) => {
    reply.clearCookie(config.cookieName, { path: '/' })
    return reply.send({ message: 'logged out' })
  })
}
