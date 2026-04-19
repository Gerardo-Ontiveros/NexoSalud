import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

// 1. Configuramos el pool de conexión de pg y el adaptador para Prisma 7
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// 2. Le pasamos el adaptador al cliente
const prisma = new PrismaClient({ adapter })

async function main() {
  const medico1 = await prisma.medico.create({
    data: { nombre: 'Carlos', apellido: 'Ramírez', especialidad: 'Cardiología', email: 'c.ramirez@hospital.com', telefono: '6181000001' },
  })
  const medico2 = await prisma.medico.create({
    data: { nombre: 'Ana', apellido: 'López', especialidad: 'Pediatría', email: 'a.lopez@hospital.com', telefono: '6181000002' },
  })

  const paciente1 = await prisma.paciente.create({
    data: { nombre: 'María', apellido: 'González', fechaNacimiento: new Date('1985-03-15'), genero: 'femenino', email: 'maria.g@email.com', tipoSangre: 'O+' },
  })

  await prisma.cita.create({
    data: { pacienteId: paciente1.id, medicoId: medico1.id, fechaHora: new Date('2025-05-10T10:00:00'), motivo: 'Revisión general' },
  })

  await prisma.usuario.create({
    data: {
      email: 'admin@hospital.com',
      password: await bcrypt.hash('Admin123!', 12),
      nombre: 'Administrador',
      rol: 'ADMIN',
    },
  })

  console.log('✅ Seed completado')
}

main().catch(console.error).finally(() => prisma.$disconnect())