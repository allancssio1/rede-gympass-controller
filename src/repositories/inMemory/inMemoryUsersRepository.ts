import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users-repository'
import { Prisma, User } from '@prisma/client'

export class InMemoryUsersRepository implements UsersRepository {
  public itens: User[] = []

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.itens.find((user) => user.email === email)
    return user || null
  }

  async findUserByUserId(userId: string): Promise<User | null> {
    const user = this.itens.find((user) => user.id === userId)
    return user || null
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.itens.push(user)

    return user
  }
}
