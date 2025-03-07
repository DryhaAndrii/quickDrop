import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useEndpoints, usePaths } from '@/endpointsAndPaths'
import { fetchData } from './fetch'
import { useAtom } from 'jotai'
import { roomNameAtom } from '@/store/roomName'
import { apiAtom } from '@/store/apiUrl'

export function useRoomAuth() {
  const router = useRouter()
  const isChecking = useRef(false)
  const { checkRoomAuthEndpoint } = useEndpoints()
  const { authPath } = usePaths()
  const pathname = usePathname()
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  const [apiUrl, setApiUrl] = useAtom(apiAtom)
  const [isApiUrlLoaded, setIsApiUrlLoaded] = useState(false)

  const checkAuth = useCallback(async () => {
    if (isChecking.current) return
    isChecking.current = true

    const url = checkRoomAuthEndpoint
    console.log('Checking token url:', url)
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }

    const response = await fetchData<any>(url, undefined, undefined, options)

    if (!response) {
      if (pathname !== authPath) {
        router.push(authPath)
      }
      return
    }

    setRoomName(response.user.roomName)
    if (pathname === authPath) {
      router.push('/')
    }
  }, [router, checkRoomAuthEndpoint, pathname, authPath, setRoomName])

  // this effect is used to load the apiUrl from localStorage when the component mounts
  useEffect(() => {
    const savedApiUrl = localStorage.getItem('currentApiUrl')
    if (savedApiUrl && apiUrl !== savedApiUrl) {
      setApiUrl(savedApiUrl)
    }
    setIsApiUrlLoaded(true)
  }, [apiUrl, setApiUrl])

  useEffect(() => {
    if (isApiUrlLoaded) {
      checkAuth()
    }
  }, [isApiUrlLoaded, checkAuth])
}
