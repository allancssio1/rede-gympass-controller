import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './checkIn'
import { InMemoryGymsRepository } from '@/repositories/inMemory/inMemoryGymsRepository'
import { InMemoryCheckiInsRepository } from '@/repositories/inMemory/inMemoryCheckInsRepository'
import { Decimal } from '@prisma/client/runtime'
import { MaxDistanceError } from './errors/maxDistanceError'
import { MaxNumberOfCheckInsError } from './errors/maxNumberOfCheckInsError'

let checkInRepository: InMemoryCheckiInsRepository
let checkInUseCase: CheckInUseCase
let gymsRepository: InMemoryGymsRepository

describe('Register Check In', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckiInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'New life Gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers() // mokking fake de datas.
  })

  afterEach(() => {
    vi.useFakeTimers() // mokking fake de datas.
  })

  it('Should be able to register new check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in two in the same day', async () => {
    // seta a data falsa para o dia 26/01/1991 às 10h:00m:00s + 3h
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0))
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should  be able to check in twice in different days', async () => {
    // seta a data falsa para o dia 26/01/1991 às 10h:00m:00s + 3h
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0))
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 11, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should to be able to check in on distant gym', async () => {
    gymsRepository.itens.push({
      id: 'gym-02',
      title: 'New life Gym 2',
      description: '',
      phone: '',
      latitude: new Decimal(-3.8588047),
      longitude: new Decimal(-38.5909586),
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -3.8756179,
        userLongitude: -38.6078833,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
