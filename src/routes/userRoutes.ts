import { authenticate } from '@/http/controllers/authenticate'
import { profile } from '@/http/controllers/profile'
import { register } from '@/http/controllers/register'
import { FastifyInstance } from 'fastify'

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.get('/profile', profile)
}
