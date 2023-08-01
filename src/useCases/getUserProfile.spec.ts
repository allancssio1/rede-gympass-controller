import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './getUserProfile'
import { ResourceNotFoundError } from './errors/resourceNotFoundError'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('Should be able to get user profile', async () => {
    const { id } = await usersRepository.create({
      name: 'Allan Cássio',
      email: 'allan.cassio1@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: id,
    })

    expect(user.name).toEqual('Allan Cássio')
  })

  it('Should be able to get user profile with wrong id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'not-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
