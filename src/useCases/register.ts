import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const userAlreadyExists = await prisma.user.findUnique({ where: { email } })

    if (userAlreadyExists) throw new Error('User already exists.')

    const password_hash = await hash(password, 6)

    // const prismaUsersRepository = new PrismaUsersRepository()

    await this.usersRepository.create({ name, email, password_hash })
  }
}
