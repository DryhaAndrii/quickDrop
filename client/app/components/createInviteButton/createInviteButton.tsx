'use client'
import { fetchData } from '@/app/functionsAndHooks/fetch'
import Button from '../button/button'
import { useEndpoints, usePaths } from '@/endpointsAndPaths'
import Loading, { useLoading } from '../loading/loading'
import toast from 'react-hot-toast'

export default function CreateInviteButton() {
  const { hideLoading, showLoading, isShow } = useLoading()
  const { createInviteEndpoint } = useEndpoints()
  const { invitePath } = usePaths()
  async function createInvite() {
    const url = createInviteEndpoint
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }
    const response = await fetchData<any>(url, showLoading, hideLoading, options)
    const currentUrl = window.location.href
    await navigator.clipboard.writeText(`${currentUrl}${invitePath}?inviteId=${response.inviteId}`)
    toast.success('Invite ID saved to clipboard')
  }

  return (
    <>
      <Loading isShow={isShow} />
      <Button onClick={createInvite}>Create invite</Button>
    </>
  )
}
