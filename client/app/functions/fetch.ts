import toast from 'react-hot-toast'

export async function fetchData<T>(
  endpoint: string,
  showLoading: () => void,
  hideLoading: () => void,
  options?: RequestInit,
): Promise<T> {
  showLoading()
  try {
    const response = await fetch(endpoint, {
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  } finally {
    hideLoading()
  }
}
