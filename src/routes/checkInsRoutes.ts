import { create } from '@/http/controllers/checkIns/create'
import { validate } from '@/http/controllers/checkIns/validate'
import { verifyJWT } from '@/http/middlewares/verifyJWT'
import { FastifyInstance } from 'fastify'

export const checkInsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT) // dqui para baixo todos precisam estar autenticados.

  app.get('/')

  app.post('/gyms/:gymId/checkins', create)
  app.patch('/gyms/:checkInId/valite', validate)
}
