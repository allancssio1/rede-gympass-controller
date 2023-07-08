import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/inMemory/inMemoryUsersRepository";
import { RegisterUseCase } from "./register";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";

let usersRepository : InMemoryUsersRepository
let authenticateUseCase : AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('Should be able to authenticate', async () => {
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
    await expect( () => authenticateUseCase.execute({
      email: 'allan.cassio11@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should be able to authenticate with wrong password', async () => {
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