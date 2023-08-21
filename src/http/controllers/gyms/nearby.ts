import { makeFetchNearbyGymsUseCase } from '@/useCases/factories/makeFetchNearbyGymsUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function fetchNearby(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { longitude, latitude } = createBodySchema.parse(request.body)

  const fatchNearbyGymUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fatchNearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
