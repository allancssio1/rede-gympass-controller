import { authenticate } from '@/http/controllers/users/authenticate'
import { profile } from '@/http/controllers/users/profile'
import { refresh } from '@/http/controllers/users/refresh'
import { register } from '@/http/controllers/users/register'
import { verifyJWT } from '@/http/middlewares/verifyJWT'
import { FastifyInstance } from 'fastify'

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)
  app.get('/profile', { onRequest: [verifyJWT] }, profile)
}
