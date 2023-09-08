import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sub: request.user.sub,
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sub: request.user.sub,
      expiresIn: '7d', // o refreshToken expira em 7 dias, ai ele precisa fazer login
    },
  )
  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // so vai aceitar requests de https
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
