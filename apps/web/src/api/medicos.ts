import api from './axios'
import type { Medico } from '../types'

export const getMedicos = async () => {
  const { data } = await api.get<Medico[]>('/doctors')
  return data
}
export const getMedico = async (id: number) => {
  const { data } = await api.get<Medico>(`/doctors/${id}`)
  return data
}
export const createMedico = async (body: Partial<Medico>) => {
  const { data } = await api.post<Medico>('/doctors', body)
  return data
}
export const updateMedico = async (id: number, body: Partial<Medico>) => {
  const { data } = await api.put<Medico>(`/doctors/${id}`, body)
  return data
}
export const deleteMedico = async (id: number) => {
  await api.delete(`/doctors/${id}`)
}