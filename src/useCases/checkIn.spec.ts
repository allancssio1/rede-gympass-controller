import { InMemoryCheckiInsRepository } from "@/repositories/inMemory/inMemoruCheckInsRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { CheckInUseCase } from "./checkIn";

let checkInRepository: InMemoryCheckiInsRepository
let checkInUseCase: CheckInUseCase

describe('Register Check In', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckiInsRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository)
  })

  it("Should be able to register new check in", async () => {
    const {checkIn} = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})