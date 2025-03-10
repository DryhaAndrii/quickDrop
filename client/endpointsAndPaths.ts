import { useAtomValue } from 'jotai'
import { apiAtom } from './store/apiUrl'

export function useEndpoints() {
  const apiUrl = useAtomValue(apiAtom)
  return {
    joinRoomEndpoint: `${apiUrl}/rooms/join`,
    createRoomEndpoint: `${apiUrl}/rooms/create`,
    checkRoomAuthEndpoint: `${apiUrl}/rooms/checkToken`,
    logoutEndpoint: `${apiUrl}/rooms/logout`,
    saveFileEndpoint: `${apiUrl}/rooms/saveFiles`,
  }
}

export function usePaths() {
  return {
    authPath: `/auth`,
  }
}
