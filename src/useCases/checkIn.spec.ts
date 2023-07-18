import { InMemoryCheckiInsRepository } from "@/repositories/inMemory/inMemoruCheckInsRepository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./checkIn";
import { string } from "zod";

let checkInRepository: InMemoryCheckiInsRepository
let checkInUseCase: CheckInUseCase

describe('Register Check In', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckiInsRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository)

    // mokking fake de datas.
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useFakeTimers()
  }) 

  it("Should be able to register new check in", async () => {
    const {checkIn} = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("Should not be able to check in two in the same day",async () => {
    //seta a data falsa para o dia 26/01/1991 às 10h:00m:00s + 3h
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0))
    await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01"
    })

    await expect(() => checkInUseCase.execute({
        gymId: "gym-01",
        userId: "user-01"
    })
    ).rejects.toBeInstanceOf(Error)
  })

  it("Should  be able to check in twice in different days",async () => {
    //seta a data falsa para o dia 26/01/1991 às 10h:00m:00s + 3h
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0))
    await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01"
    })

    vi.setSystemTime(new Date(2022, 0, 11, 8, 0, 0))

    const {checkIn} = await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01"
    })

    expect(checkIn.id).toEqual(expect.any(String))


  })
})