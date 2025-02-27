export async function fetchData<T>(
  endpoint: string,
  showLoading: () => void,
  hideLoading: () => void,
  options?: object,
): Promise<T> {
  showLoading()
  try {
    const response = await fetch(endpoint, {
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  } finally {
    hideLoading()
  }
}
