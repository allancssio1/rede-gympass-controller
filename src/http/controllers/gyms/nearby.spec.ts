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

  it('Should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'new Life academia 1',
        description: 'some desciption',
        phone: '8544845484152',
        latitude: -3.8783988,
        longitude: -38.6056951,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'new Life academia 2',
        description: 'some desciption',
        phone: '8544845484152',
        latitude: -3.7410252,
        longitude: -38.5158357,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({ latitude: -3.8783998, longitude: -38.6056961 }) // se liga, os parametros por query usa para teste o envio por query
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'new Life academia 1',
      }),
    ])
  })
})
