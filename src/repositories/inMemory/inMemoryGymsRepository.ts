import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinate'

export class InMemoryGymsRepository implements GymsRepository {
  public itens: Gym[] = []

  async findGymById(id: string): Promise<Gym | null> {
    const gym = this.itens.find((gym) => gym.id === id)
    return gym || null
  }

  async findMany(query: string, page: number): Promise<Gym[]> {
    return this.itens
      .filter((item) => item.title.includes(query))
      .splice((page - 1) * 20, page * 20)
  }

  async findManyNearby(userLatitude: number, userLongitude: number) {
    return this.itens.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: userLatitude,
          longitude: userLongitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )
      return distance < 10
    })
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      longitude: new Prisma.Decimal(data.longitude.toString()),
      latitude: new Prisma.Decimal(data.latitude.toString()),
    }

    this.itens.push(gym)

    return gym
  }
}
