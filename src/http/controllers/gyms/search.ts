import { makeSearchGymsUseCase } from '@/useCases/factories/makeSearchGymsUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchBodySchema.parse(request.body)

  const searchGymUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymUseCase.execute({ query, page })

  return reply.status(200).send({
    gyms,
  })
}
