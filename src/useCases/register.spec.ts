import {expect, describe, it} from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it('Should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findUserByEmail(email) {
        return null
      },
      async create(data) {
        return {
          id: "user",
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date() 
        }
      },
    })

    const {user} = await registerUseCase.execute({
      name: "User test",
      email: 'usertest@test.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
 