import { create } from '@/http/controllers/checkIns/create'
import { history } from '@/http/controllers/checkIns/history'
import { metrics } from '@/http/controllers/checkIns/metrics'
import { validate } from '@/http/controllers/checkIns/validate'
import { verifyJWT } from '@/http/middlewares/verifyJWT'
import { verifyUserRole } from '@/http/middlewares/verifyUserRole'
import { FastifyInstance } from 'fastify'

export const checkInsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT) // dqui para baixo todos precisam estar autenticados.

  app.get('/checkins/history', history)
  app.get('/checkins/metrics', metrics)

  app.post('/gyms/:gymId/checkins', create)
  app.patch(
    '/gyms/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}
