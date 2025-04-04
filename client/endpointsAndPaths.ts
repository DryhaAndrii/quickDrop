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
    downloadFileEndpoint: `${apiUrl}/rooms/${roomName}/download/`,
    deleteFileEndpoint: `${apiUrl}/rooms/deleteFile`,
    getRoomMemoryLimitsEndpoint: `${apiUrl}/rooms/getRoomMemoryLimits`,
    createInviteEndpoint: `${apiUrl}/rooms/createInvite`,
    exchangeInviteIdEndpoint: `${apiUrl}/rooms/exchangeInviteId`,
    addMessagesEndpoint: `${apiUrl}/rooms/addMessage`,
    getRoomInfoEndpoint: `${apiUrl}/rooms/${roomName}/roomInfo`,
  }
}
export function usePaths() {
  return {
    authPath: `/auth`,
    invitePath: `invite`,
  }
}
