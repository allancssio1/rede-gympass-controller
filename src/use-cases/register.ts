import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-use-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCases({
  email,
  name,
  password,
}: RegisterUseCaseRequest) {
  const userAlreadyExists = await prisma.user.findUnique({ where: { email } })

  if (userAlreadyExists) throw new Error('User already exists.')

  const password_hash = await hash(password, 6)

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({ name, email, password_hash })
}
