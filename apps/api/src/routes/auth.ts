import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import {prisma} from '@nexosalud/db'
import type { LoginBody, RegisterBody } from '../types/index.ts'

export default async function authRoutes(fastify: FastifyInstance) {

  // POST /api/auth/register
  fastify.post<{ Body: RegisterBody }>('/register', async (req, reply) => {
    const { email, password, nombre, rol } = req.body

    // Verificar si ya existe
    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) {
      return reply.code(409).send({ error: 'El email ya está registrado' })
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    const usuario = await prisma.usuario.create({
      data: { email, password: hashedPassword, nombre, rol },
      select: { id: true, email: true, nombre: true, rol: true, createdAt: true },
    })

    const token = fastify.jwt.sign({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    })

    return reply.code(201).send({ usuario, token })
  })

  // POST /api/auth/login
  fastify.post<{ Body: LoginBody }>('/login', async (req, reply) => {
    const { email, password } = req.body

    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !usuario.activo) {
      return reply.code(401).send({ error: 'Credenciales inválidas' })
    }

    const passwordValido = await bcrypt.compare(password, usuario.password)
    if (!passwordValido) {
      return reply.code(401).send({ error: 'Credenciales inválidas' })
    }

    const token = fastify.jwt.sign({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    })

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    }
  })

  // GET /api/auth/me  (ruta protegida)

  fastify.get(
    '/me',
    { 
      // Usamos jwtVerify directamente aquí
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          return reply.send(err)
        }
      } 
    },
    async (req) => {
      const usuario = await prisma.usuario.findUnique({
        where: { id: (req.user as any).id },
        select: { id: true, email: true, nombre: true, rol: true, createdAt: true },
      })
      return usuario
    }
  )

  // PATCH /api/auth/change-password
  fastify.patch<{ Body: { passwordActual: string; passwordNuevo: string } }>(
    '/change-password',
    { preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          return reply.send(err)
        }
      } 
    },
    async (req, reply) => {
      const { passwordActual, passwordNuevo } = req.body
      const userId = (req.user as any).id

      const usuario = await prisma.usuario.findUnique({ where: { id: userId } })
      if (!usuario) return reply.code(404).send({ error: 'Usuario no encontrado' })

      const valido = await bcrypt.compare(passwordActual, usuario.password)
      if (!valido) return reply.code(401).send({ error: 'Contraseña actual incorrecta' })

      const nuevoHash = await bcrypt.hash(passwordNuevo, 12)
      await prisma.usuario.update({
        where: { id: userId },
        data: { password: nuevoHash },
      })

      return { message: 'Contraseña actualizada correctamente' }
    }
  )
}