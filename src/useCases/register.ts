import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const userAlreadyExists = this.usersRepository.findUserByEmail(email)

    if (userAlreadyExists !== null) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    await this.usersRepository.create({ name, email, password_hash })
  }
}
