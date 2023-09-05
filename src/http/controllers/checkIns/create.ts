import { makeCheckInsUseCase } from '@/useCases/factories/makeCheckInUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { longitude, latitude } = createCheckInBodySchema.parse(request.body)
  const { gymId } = createCheckInParamsSchema.parse(request.params)

  const checkInUseCase = makeCheckInsUseCase()

  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
