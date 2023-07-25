import { InMemoryGymsRepository } from "@/repositories/inMemory/inMemoryGymsRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./createGym";

let gymsRepository: InMemoryGymsRepository
let gymsUseCase: CreateGymUseCase

describe("Registre Gym", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    gymsUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('Should be to create gyms', async () => {
    const {gym} = await gymsUseCase.execute({
      title: 'new Life academia',
      description: null,
      phone: null,
      latitude: -3.8762863,
      longitude: -38.6844492
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})