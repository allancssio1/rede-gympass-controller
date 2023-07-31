import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetchUserCheckInsHistory'
import { InMemoryCheckiInsRepository } from '@/repositories/inMemory/inMemoryCheckInsRepository'

let checkInsRepository: InMemoryCheckiInsRepository
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckiInsRepository()
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInsRepository,
    )
  })
  afterEach(() => {})
  it('Should be find many check-ins on user id', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2) // o length do array tem esse tamanho.
    // objectContaining é para aassegurar que o retorno tem um objeto que contenha esse dado passado.
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-01',
      }),
      expect.objectContaining({
        gym_id: 'gym-02',
      }),
    ])
  })

  it('Should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
