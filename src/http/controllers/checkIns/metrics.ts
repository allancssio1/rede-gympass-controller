import { makeGetUserMetricsUseCase } from '@/useCases/factories/makeGetUserMetricsUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const fatchCheckInsHistoryUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await fatchCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
