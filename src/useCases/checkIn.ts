import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resourceNotFoundError";
import { getDistanceBetweenCoordinates } from "./utils/getDistanceBetweenCoordinate";

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor (
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ){}

  async execute({gymId, userId, userLatitude, userLongitude}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findGymById(gymId)

    if(!gym) {
      throw new ResourceNotFoundError()
    }

    const maxDistanceInKilometers = 0.1
    const distanceCalculate = getDistanceBetweenCoordinates(
      {latitude: userLatitude, longitude: userLongitude},
      {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
    )

    if(distanceCalculate > maxDistanceInKilometers) {
      throw new Error()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if(checkInOnSameDay) {
      throw new Error()
    }
    
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })
    
    return {checkIn}

  }
}