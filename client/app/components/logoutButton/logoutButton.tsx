'use client'
import { fetchData } from '@/app/functionsAndHooks/fetch'
import Button from '../button/button'
import { useEndpoints } from '@/endpointsAndPaths'
import { useRouter } from 'next/navigation'
import Loading, { useLoading } from '../loading/loading'

export default function LogoutButton() {
  const { hideLoading, showLoading, isShow } = useLoading()
  const { logoutEndpoint } = useEndpoints()
  const router = useRouter()

  async function logout() {
    const url = logoutEndpoint
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }
    const response = await fetchData<any>(url, showLoading, hideLoading, options)

    if (response) {
      router.push('/auth')
    }
  }

  return (
    <>
      <Loading isShow={isShow} />
      <Button variant='rounded' onClick={logout}>Logout</Button>
    </>
  )
}
