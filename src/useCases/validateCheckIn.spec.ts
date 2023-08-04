import { InMemoryCheckiInsRepository } from '@/repositories/inMemory/inMemoryCheckInsRepository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validateCheckIn'
import { ResourceNotFoundError } from './errors/resourceNotFoundError'
import { LateCheckInValidationError } from './errors/LateCheckInValidationError'

let checkInsRepository: InMemoryCheckiInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate Check In', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckiInsRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('Should be able validate a check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
      userId: 'user-01',
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })

  it('Should not be able to validate an inexistent checke in', async () => {
    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'inexistent-check-in-id',
        userId: 'user-not-existes',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able to validate the checke-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: checkIn.id,
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
