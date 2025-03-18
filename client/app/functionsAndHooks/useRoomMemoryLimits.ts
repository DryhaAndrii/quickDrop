import { useEffect, useCallback } from 'react'
import { useEndpoints } from '@/endpointsAndPaths'
import { fetchData } from './fetch'
import { useAtom } from 'jotai'
import { roomMemoryAtom } from '@/store/apiMemory'
import { apiAtom } from '@/store/apiUrl'

export function useRoomMemoryLimits() {
  const [_, setRoomMemoryLimits] = useAtom(roomMemoryAtom)
  const [apiUrl, __] = useAtom(apiAtom)
  const { getRoomMemoryLimitsEndpoint } = useEndpoints()

  const getRoomMemoryLimits = useCallback(async () => {
    const response = await fetchData<any>(getRoomMemoryLimitsEndpoint, undefined, undefined, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    setRoomMemoryLimits({ maxFilesSize: response.maxFilesSize, maxRoomSize: response.maxRoomSize })
  }, [getRoomMemoryLimitsEndpoint, setRoomMemoryLimits])

  useEffect(() => {
    if (apiUrl !== '') getRoomMemoryLimits()
  }, [getRoomMemoryLimits, apiUrl])
}
