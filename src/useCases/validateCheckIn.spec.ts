import { InMemoryCheckiInsRepository } from '@/repositories/inMemory/inMemoryCheckInsRepository'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ValidateCheckInUseCase } from './validateCheckIn'
import { ResourceNotFoundError } from './errors/resourceNotFoundError'

let checkInsRepository: InMemoryCheckiInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate Check In', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckiInsRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)
  })
  afterEach(() => {})
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

  it('Should not be able to validate an inexistent checke in', () => {
    expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'inexistent-check-in-id',
        userId: 'user-not-existes',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
