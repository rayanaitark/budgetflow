import { UserModel } from '../models/user-model.js'

function toUserResponse(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    monthlyBudget: user.monthlyBudget
  }
}

export async function usersRoutes(fastify) {
  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const user = await UserModel.findById(request.currentUser?.sub)

    if (!user) {
      return reply.code(404).send({ message: 'user not found' })
    }

    return reply.send({ user: toUserResponse(user) })
  })

  fastify.patch('/me/budget', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { monthlyBudget } = request.body || {}

    if (typeof monthlyBudget !== 'number' || monthlyBudget < 0) {
      return reply.code(400).send({ message: 'monthlyBudget must be a positive number' })
    }

    const user = await UserModel.findByIdAndUpdate(
      request.currentUser?.sub,
      { monthlyBudget },
      { new: true }
    )

    if (!user) {
      return reply.code(404).send({ message: 'user not found' })
    }

    return reply.send({ user: toUserResponse(user) })
  })
}
