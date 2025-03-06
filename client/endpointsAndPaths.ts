import { API_URL } from './environments'

export const joinRoomEndpoint = `${API_URL}/rooms/join`
export const createRoomEndpoint = `${API_URL}/rooms/create`
export const checkRoomAuthEndpoint = `${API_URL}/rooms/checkToken`
export const logoutEndpoint = `${API_URL}/rooms/logout`

export const authPath = '/auth'
