export interface Usuario {
  id: number
  email: string
  nombre: string
  rol: 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA'
}

export interface Paciente {
  id: number
  nombre: string
  apellido: string
  fechaNacimiento: string
  genero?: string
  email?: string
  telefono?: string
  direccion?: string
  tipoSangre?: string
  createdAt: string
}

export interface Medico {
  id: number
  nombre: string
  apellido: string
  especialidad: string
  email: string
  telefono?: string
  activo: boolean
}

export interface Cita {
  id: number
  pacienteId: number
  medicoId: number
  fechaHora: string
  motivo?: string
  estado: 'PROGRAMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA'
  notas?: string
  paciente?: Paciente
  medico?: Medico
}

export interface DashboardStats {
  totalPacientes: number
  totalMedicos: number
  citasHoy: number
  citasPendientes: number
  citasPorEstado: { estado: string; cantidad: number }[]
  citasUltimos7Dias: { fecha: string; cantidad: number }[]
}