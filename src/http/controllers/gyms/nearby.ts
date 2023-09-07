import { makeFetchNearbyGymsUseCase } from '@/useCases/factories/makeFetchNearbyGymsUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function fetchNearby(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const nearbyGymsBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const { longitude, latitude } = nearbyGymsBodySchema.parse(request.query)

  const fatchNearbyGymUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fatchNearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
