import { makeFetchCheckInsHistoryUseCase } from '@/useCases/factories/makeFetchCheckInsHistoryUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInsHistoryQuerySchema.parse(request.query)

  const fatchCheckInsHistoryUseCase = makeFetchCheckInsHistoryUseCase()

  const { checkIns } = await fatchCheckInsHistoryUseCase.execute({
    page,
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkIns,
  })
}
