export interface CreatePacienteBody {
  nombre: string
  apellido: string
  fechaNacimiento: string
  genero?: string
  email?: string
  telefono?: string
  direccion?: string
  tipoSangre?: string
}

export interface CreateMedicoBody {
  nombre: string
  apellido: string
  especialidad: string
  email: string
  telefono?: string
}

export interface CreateCitaBody {
  pacienteId: number
  medicoId: number
  fechaHora: string
  motivo?: string
  notas?: string
}

export interface CreateHistorialBody {
  pacienteId: number
  citaId?: number
  medicoId: number
  diagnostico: string
  tratamiento?: string
  medicamentos?: string
  fecha?: string
}

export interface UpdateCitaEstadoBody {
  estado: 'PROGRAMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA'
}

// --- Auth ---
export interface RegisterBody {
  email: string
  password: string
  nombre: string
  rol?: 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA'
}

export interface LoginBody {
  email: string
  password: string
}

export interface JwtPayload {
  id: number
  email: string
  rol: string
  nombre: string
}

