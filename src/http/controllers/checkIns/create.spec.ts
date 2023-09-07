import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/createAnAuthenticateUser'
import { prisma } from '@/lib/prisma'

describe('Check-Ins e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const { id } = await prisma.gym.create({
      data: {
        title: 'Javascript gym',
        latitude: -3.8762863,
        longitude: -38.6844492,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${id}/checkins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -3.8762863,
        longitude: -38.6844492,
      })

    expect(response.statusCode).toEqual(201)
  })
})
