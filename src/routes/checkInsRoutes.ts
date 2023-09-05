import { create } from '@/http/controllers/checkIns/create'
import { history } from '@/http/controllers/checkIns/history'
import { metrics } from '@/http/controllers/checkIns/metrics'
import { validate } from '@/http/controllers/checkIns/validate'
import { verifyJWT } from '@/http/middlewares/verifyJWT'
import { FastifyInstance } from 'fastify'

export const checkInsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT) // dqui para baixo todos precisam estar autenticados.

  app.get('/checkind/history', history)
  app.get('/checkind/metrics', metrics)

  app.post('/gyms/:gymId/checkins', create)
  app.patch('/gyms/:checkInId/validate', validate)
}
