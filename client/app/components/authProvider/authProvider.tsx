'use client'

import { useRoomAuth } from '@/app/functionsAndHooks/useRoomAuth'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useRoomAuth()
  return children
}
