import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { CheckInsRepository } from "../check-ins-repository";
import { GetResult } from "@prisma/client/runtime";

export class InMemoryCheckiInsRepository implements CheckInsRepository {
  public itens: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date() 
    }

    this.itens.push(checkIn)

    return checkIn
  }
  
  async findByUserIdOnDate(userId: string, date: Date) {
    const checkInByUserId = this.itens.find(userFound => userFound.user_id === userId)

    if(!checkInByUserId) {
      return null
    }

    return checkInByUserId
  }

}