import api from './axios'
import type { Paciente } from '../types'

export const getPacientes = async () => {
  const { data } = await api.get<Paciente[]>('/patients')
  return data
}
export const getPaciente = async (id: number) => {
  const { data } = await api.get<Paciente>(`/patients/${id}`)
  return data
}
export const createPaciente = async (body: Partial<Paciente>) => {
  const { data } = await api.post<Paciente>('/patients', body)
  return data
}
export const updatePaciente = async (id: number, body: Partial<Paciente>) => {
  const { data } = await api.put<Paciente>(`/patients/${id}`, body)
  return data
}
export const deletePaciente = async (id: number) => {
  await api.delete(`/patients/${id}`)
}