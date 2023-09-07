import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/createAnAuthenticateUser'

describe('Search e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Should be able to get a gym by query search', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript gym',
        description: 'Some description',
        phone: '85985785458',
        latitude: -3.8762863,
        longitude: -38.6844492,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Ruby gym',
        description: 'Some description',
        phone: '854548484885',
        latitude: -3.8762889,
        longitude: -38.6844401,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ query: 'Ruby', page: 1 }) // se liga, os parametros por query usa para teste o envio por query
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Ruby gym',
      }),
    ])
  })
})
