import { Gym } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  public itens: Gym[] = []

  async findGymById(id: string): Promise<Gym | null> {
    const user = this.itens.find(gym => gym.id === id)
    return user ? user : null
  }
}