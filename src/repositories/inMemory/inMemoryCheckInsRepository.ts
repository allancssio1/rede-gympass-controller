import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckiInsRepository implements CheckInsRepository {
  public itens: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.itens.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    // instalada lib dayjs para trabalhar com datas
    const startOfTheDay = dayjs(date).startOf('date') // startof retorna data YYYY-MM-DDT00:00:00
    const endOfTheDay = dayjs(date).endOf('date') // endOf retorna data YYYY-MM-DDT23:59:59

    const checkInByUserId = this.itens.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInByUserId) {
      return null
    }

    return checkInByUserId
  }

  async findManyByUserId(userId: string, page: number) {
    return await this.itens
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }
}
