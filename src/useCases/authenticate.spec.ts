import { describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/inMemory/inMemoryUsersRepository";
import { RegisterUseCase } from "./register";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";

describe('Authenticate Use Case', () => {
  it('Should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: "Allan Cássio",
      email: "allan.cassio1@gmail.com",
      password_hash: await hash('123456', 6)
    })

    const {user} = await authenticateUseCase.execute({
      email: 'allan.cassio1@gmail.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await expect( () => authenticateUseCase.execute({
      email: 'allan.cassio11@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: "Allan Cássio",
      email: "allan.cassio1@gmail.com",
      password_hash: await hash('123456', 6)
    })

    await expect(() => authenticateUseCase.execute({
      email: 'allan.cassio1@gmail.com',
      password: "1234567"
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})  