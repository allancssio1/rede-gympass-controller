import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/inMemory/inMemoryGymsRepository'
import { FetchNearbyGymsUseCase } from './fetchNearbyGyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch Neatby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
  })
  afterEach(() => {})
  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'new Life academia 1',
      description: null,
      phone: null,
      latitude: -3.8783988,
      longitude: -38.6056951,
    })

    await gymsRepository.create({
      title: 'new Life academia 2',
      description: null,
      phone: null,
      latitude: -3.7410252,
      longitude: -38.5158357,
    })

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -3.8783998,
      userLongitude: -38.6056961,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'new Life academia 1',
      }),
    ])
  })
})
