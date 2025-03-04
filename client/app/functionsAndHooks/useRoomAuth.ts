'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import { authPath, checkRoomAuthEndpoint } from '@/endpointsAndPaths'
import { API_URL } from '@/environments'
import { fetchData } from './fetch'
import { useAtom } from 'jotai'
import { roomNameAtom } from '@/store/roomName'

export function useRoomAuth() {
  const router = useRouter()
  const isChecking = useRef(false)
  const pathname = usePathname()
  const [roomName, setRoomName] = useAtom(roomNameAtom)

  const checkAuth = useCallback(async () => {
    if (isChecking.current) return

    isChecking.current = true

    const url = `${API_URL}/${checkRoomAuthEndpoint}`
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

    setRoomName(response.user.roomId)
    if (pathname === authPath) {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])
}
