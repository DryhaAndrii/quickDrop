import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useEndpoints, usePaths } from '@/endpointsAndPaths'
import { fetchData } from './fetch'
import { useAtom } from 'jotai'
import { roomNameAtom } from '@/store/roomName'
import { apiAtom } from '@/store/apiUrl'
import { nicknameAtom } from '@/store/nickname'

export function useRoomAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { checkRoomAuthEndpoint } = useEndpoints()
  const { authPath, invitePath } = usePaths()
  const [__, setRoomName] = useAtom(roomNameAtom)
  const [___, setNickname] = useAtom(nicknameAtom)
  const [apiUrl, _] = useAtom(apiAtom)
  const isChecking = useRef(false)

  const checkAuth = useCallback(async () => {
    if (isChecking.current) return
    isChecking.current = true

    const response = await fetchData<any>(checkRoomAuthEndpoint, undefined, undefined, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response) {
      if (pathname !== authPath) {
        if (pathname === `/${invitePath}`) return
        router.push(authPath)
      }
      return
    }

    setRoomName(response.user.roomName)
    setNickname(response.user.nickname)
    if (pathname === authPath || pathname === `/${invitePath}`) {
      router.push('/')
    }
  }, [router, checkRoomAuthEndpoint, pathname, authPath, invitePath, setRoomName])

  useEffect(() => {
    if (apiUrl !== '') {
      checkAuth()
    }
  }, [checkAuth])
}
