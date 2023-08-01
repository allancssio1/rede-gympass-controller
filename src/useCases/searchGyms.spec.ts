import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './searchGyms'
import { InMemoryGymsRepository } from '@/repositories/inMemory/inMemoryGymsRepository'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })
  afterEach(() => {})
  it('Should be find many gyms on title gym', async () => {
    await gymsRepository.create({
      title: 'new Life academia 1',
      description: null,
      phone: null,
      latitude: -3.8762863,
      longitude: -38.6844492,
    })
    await gymsRepository.create({
      title: 'new Life academia 2',
      description: null,
      phone: null,
      latitude: -3.8782863,
      longitude: -38.6848492,
    })

    const { gyms } = await searchGymsUseCase.execute({
      query: 'new Life academia 1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'new Life academia 1',
      }),
    ])
  })

  it('Should be able to get many by paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `new Life academia ${i}`,
        description: null,
        phone: null,
        latitude: -3.8782863,
        longitude: -38.6848492,
      })
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: `new Life`,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: `new Life academia 21` }),
      expect.objectContaining({ title: `new Life academia 22` }),
    ])
  })
})
