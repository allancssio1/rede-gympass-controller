import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleVerify: 'ADMIN' | 'MEMBER') {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { role } = req.user

    if (role !== roleVerify)
      return reply.status(401).send({ message: 'Unauthorired.' })
  }
}
