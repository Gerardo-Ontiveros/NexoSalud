import api from './axios'
import type { Usuario } from '../types'

export const login = async (email: string, password: string) => {
  const { data } = await api.post<{ token: string; usuario: Usuario }>('/auth/login', { email, password })
  return data
}

export const getMe = async () => {
  const { data } = await api.get<Usuario>('/auth/me')
  return data
}