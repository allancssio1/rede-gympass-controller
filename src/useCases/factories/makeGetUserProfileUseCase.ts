import { PrismaUsersRepository } from '@/repositories/prisma/prisma-use-repository'
import { GetUserProfileUseCase } from '../getUserProfile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(usersRepository)
  return useCase
}
