import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'

let inMemoryUsersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(inMemoryUsersRepository)
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'User test',
      email: 'usertest@test.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should do not possible register with email already exists', async () => {
    await registerUseCase.execute({
      name: 'User test',
      email: 'usertest@test.com',
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'User test',
        email: 'usertest@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'User test',
      email: 'usertest@test.com',
      password: '123456',
    })

    // esperar que user.id seja igual a qualquer possibilidade de string.
    expect(user.id).toEqual(expect.any(String))
  })
})
