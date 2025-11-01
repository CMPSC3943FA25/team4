import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export interface StateData {
  stateCode: string
  visited: boolean
  notes: string
}

export interface StatsData {
  visited: number
  percentage: number
  badges: string[]
}

export const register = (username: string, password: string) =>
  api.post('/auth/register', { username, password })

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password })

export const getStates = (userId: number): Promise<{ data: StateData[] }> =>
  api.get(`/states/${userId}`)

export const updateState = (userId: number, stateCode: string, data: Partial<StateData>) =>
  api.put(`/states/${userId}/${stateCode}`, data)

export const getStats = (userId: number): Promise<{ data: StatsData }> =>
  api.get(`/stats/${userId}`)