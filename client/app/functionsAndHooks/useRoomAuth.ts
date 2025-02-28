import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import { auth, checkRoomAuthEndpoint } from '@/endpoints'
import { API_URL } from '@/environments'
import { fetchData } from './fetch'

export function useRoomAuth() {
  const router = useRouter()
  const isChecking = useRef(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const checkAuth = useCallback(async () => {
    if (isChecking.current) return

    isChecking.current = true

    const url = `${API_URL}/${checkRoomAuthEndpoint}`
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }

    const response = await fetchData<ServerResponse>(url, undefined, undefined, options)

    if (!response) {
      setIsAuthenticated(false)
      router.push(auth)
    } else {
      console.log(response.message)
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return isAuthenticated
}
