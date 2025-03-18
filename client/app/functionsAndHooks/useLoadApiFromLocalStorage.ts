import { SMALL_API_URL } from '@/environments'
import { apiAtom } from '@/store/apiUrl'
import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

export function useLoadApiFromLocalStorage() {
  const [apiUrl, setApiUrl] = useAtom(apiAtom)

  const loadApi = useCallback(() => {
    const savedApiUrl = localStorage.getItem('currentApiUrl')
    if (savedApiUrl) {
      return setApiUrl(savedApiUrl)
    }
    if (SMALL_API_URL) {
      setApiUrl(SMALL_API_URL)
    }
  }, [setApiUrl])

  useEffect(() => {
    loadApi()
  }, [loadApi])
}
