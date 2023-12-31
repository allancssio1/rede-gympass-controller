import { UserAlreadyExistsError } from '@/useCases/errors/userAlreadyExistsError'
import { makeRegisterUseCase } from '@/useCases/factories/makeRegisterUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const { email, name, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError)
      return reply.status(409).send({ message: error.message })

    return reply.status(500).send() // TODO: to fix
  }

  return reply.status(201).send()
}
