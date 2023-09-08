import { create } from '@/http/controllers/gyms/create'
import { fetchNearby } from '@/http/controllers/gyms/nearby'
import { search } from '@/http/controllers/gyms/search'
import { verifyJWT } from '@/http/middlewares/verifyJWT'
import { verifyUserRole } from '@/http/middlewares/verifyUserRole'
import { FastifyInstance } from 'fastify'

export const gymRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT) // daqui para baixo todos precisam estar autenticados.

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', fetchNearby)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
