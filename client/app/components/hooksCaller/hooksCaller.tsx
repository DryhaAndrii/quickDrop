'use client'

import { useLoadApiFromLocalStorage } from '@/app/functionsAndHooks/useLoadApiFromLocalStorage'
import { useRoomAuth } from '@/app/functionsAndHooks/useRoomAuth'

export default function HooksCaller() {
  useLoadApiFromLocalStorage()
  useRoomAuth()
  return null
}
