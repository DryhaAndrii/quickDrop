import toast from 'react-hot-toast'

export async function fetchData<T>(
  endpoint: string,
  showLoading?: () => void,
  hideLoading?: () => void,
  options?: object,
  handleErrors: boolean = true,
): Promise<T | null> {
  showLoading?.()
  try {
    const response = await fetch(endpoint, { ...options })

    if (!handleErrors) {
      return await response.json()
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.log('Error:', errorData)
      toast.error(`Error: ${errorData.message}`)
      return null
    }

    return await response.json()
  } catch (error) {
    if (handleErrors) {
      console.error('Fetch error:', error)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Network error: Server is not available or you are offline.')
      } else {
        toast.error(`Error: ${error}`)
      }
    }
    return null
  } finally {
    hideLoading?.()
  }
}
