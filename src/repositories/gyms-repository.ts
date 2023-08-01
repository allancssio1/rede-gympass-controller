import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  findGymById(id: string): Promise<Gym | null>
  findMany(query: string, page: number): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
