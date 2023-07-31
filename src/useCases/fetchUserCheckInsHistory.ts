import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryRequest {
  userId: string
  page?: number
}
interface FetchUserCheckInsHistoryResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: FetchUserCheckInsHistoryRequest): Promise<FetchUserCheckInsHistoryResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId)

    return { checkIns }
  }
}
