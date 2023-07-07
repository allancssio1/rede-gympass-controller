import {expect, describe, it} from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'
import { register } from '@/http/controllers/register'

describe('Register Use Case', () => {
  it('Should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const {user} = await registerUseCase.execute({
      name: "User test",
      email: 'usertest@test.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should do not possible register with email already exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    await registerUseCase.execute({
      name: "User test",
      email: 'usertest@test.com',
      password: '123456'
    })

    await expect(() => registerUseCase.execute({
      name: "User test",
      email: 'usertest@test.com',
      password: '123456'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const {user} = await registerUseCase.execute({
      name: "User test",
      email: 'usertest@test.com',
      password: '123456'
    })

    //esperar que user.id seja igual a qualquer possibilidade de string.
    expect(user.id).toEqual(expect.any(String))
    
  })
})
 