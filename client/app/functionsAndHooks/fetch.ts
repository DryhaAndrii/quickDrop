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
      console.log(errorData);
      toast.error(`Error: ${errorData.message}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      toast.error('Network error: Check your internet connection.')
    } else {
      toast.error(`Error: ${error}`)
    }
    return null
  } finally {
    hideLoading?.()
  }
}
