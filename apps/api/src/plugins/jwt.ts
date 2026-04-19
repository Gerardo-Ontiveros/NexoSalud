import fp from 'fastify-plugin'
import fjwt from '@fastify/jwt'
import fcookie from '@fastify/cookie'

export default fp(async (app) => {
  const secret = process.env.JWT_SECRET!
  
  if (!secret) {
    throw new Error("Falta la variable de entorno JWT_SECRET")
  }

  await app.register(fcookie)

  await app.register(fjwt, {
    secret: secret,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
    messages: {
      badRequestErrorMessage: 'Formato de token inválido',
      noAuthorizationInHeaderMessage: 'No autenticado',
      authorizationTokenExpiredMessage: 'El token ha expirado',
      authorizationTokenInvalid: 'Token inválido'
    }
  })
})