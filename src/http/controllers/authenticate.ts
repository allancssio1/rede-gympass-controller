import { PrismaUsersRepository } from "@/repositories/prisma/prisma-use-repository";
import { AuthenticateUseCase } from "@/useCases/authenticate";
import { InvalidCredentialsError } from "@/useCases/errors/invalidCredentialsError";
import { makeAuthenticateUseCase } from "@/useCases/factoies/makeAuthenticateUseCase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
  const authenticateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })

  const {email,password} = authenticateSchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({email, password})
  } catch (error) {
    if(error instanceof InvalidCredentialsError) {
      return reply.status(400).send({message: error.message})
    }

    throw error
  }

  return reply.status(200).send()

}