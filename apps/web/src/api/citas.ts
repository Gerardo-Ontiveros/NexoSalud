import api from './axios'
import type { Cita } from '../types'

export const getCitas = async (params?: Record<string, string>) => {
  const { data } = await api.get<Cita[]>('/appointments', { params })
  return data
}
export const createCita = async (body: Partial<Cita>) => {
  const { data } = await api.post<Cita>('/appointments', body)
  return data
}
export const updateEstadoCita = async (id: number, estado: Cita['estado']) => {
  const { data } = await api.patch<Cita>(`/appointments/${id}/estado`, { estado })
  return data
}
export const deleteCita = async (id: number) => {
  await api.delete(`/appointments/${id}`)
}