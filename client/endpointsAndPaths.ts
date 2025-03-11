import { useAtomValue } from 'jotai'
import { apiAtom } from './store/apiUrl'

interface useEndpointsProps {
  roomName?: string
}

export function useEndpoints({ roomName = '' }: useEndpointsProps = {}) {
  const apiUrl = useAtomValue(apiAtom)
  return {
    joinRoomEndpoint: `${apiUrl}/rooms/join`,
    createRoomEndpoint: `${apiUrl}/rooms/create`,
    checkRoomAuthEndpoint: `${apiUrl}/rooms/checkToken`,
    logoutEndpoint: `${apiUrl}/rooms/logout`,
    saveFileEndpoint: `${apiUrl}/rooms/saveFiles`,
    getRoomFilesEndpoint: `${apiUrl}/rooms/${roomName}/files`,
    downloadFileEndpoint: `${apiUrl}/rooms/${roomName}/download/`,
  }
}

export function usePaths() {
  return {
    authPath: `/auth`,
  }
}
