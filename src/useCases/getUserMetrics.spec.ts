import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './getUserMetrics'
import { InMemoryCheckiInsRepository } from '@/repositories/inMemory/inMemoryCheckInsRepository'

let checkInsRepository: InMemoryCheckiInsRepository
let getUserMetricsUseCase: GetUserMetricsUseCase

describe('Get User Metrics History Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckiInsRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)
  })
  afterEach(() => {})
  it('Should be able to get user metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
