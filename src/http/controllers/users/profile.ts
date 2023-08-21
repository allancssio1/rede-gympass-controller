import { makeGetUserProfileUseCase } from '@/useCases/factories/makeGetUserProfileUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()
  const getUserProfile = makeGetUserProfileUseCase()
  const { user } = await getUserProfile.execute({ userId: request.user.sub })

  return reply.status(201).send({ ...user, password_hash: undefined })
}
