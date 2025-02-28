import toast from 'react-hot-toast'

export async function fetchData<T>(
  endpoint: string,
  showLoading?: () => void,
  hideLoading?: () => void,
  options?: object,
): Promise<T | null> {
  showLoading?.()
  try {
    const response = await fetch(endpoint, { ...options })

    if (!response.ok) {
      const errorData = await response.json()
      toast.error(`Error: ${errorData.message}`)
      return null
    }

    return await response.json()
  } catch (error) {
    toast.error(`Error: ${error}`)
    return null
  } finally {
    hideLoading?.()
  }
}
