import { prisma } from '@/lib/prisma'
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

  await prisma.user.create({
    data: {
      name,
      password_hash,
      email,
    },
  })
}
