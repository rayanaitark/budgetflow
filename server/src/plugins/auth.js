export async function authPlugin(fastify) {
  fastify.decorate('authenticate', async function authenticate(request, reply) {
    try {
      await request.jwtVerify({ onlyCookie: true })
      request.currentUser = request.user
    } catch {
      reply.code(401).send({ message: 'Unauthorized' })
    }
  })
}
