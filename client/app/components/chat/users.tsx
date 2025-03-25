import { useEndpoints } from '@/endpointsAndPaths'
import HamburgerMenu from '../hamburgerMenu/hamburgerMenu'
import { useAtom } from 'jotai'
import { nicknameAtom } from '@/store/nickname'
import { roomNameAtom } from '@/store/roomName'
import { useEffect, useState } from 'react'
import { fetchData } from '@/app/functionsAndHooks/fetch'

interface User {
  nickname: string
  afk: boolean
}

export default function Users() {
  const [nickname, _] = useAtom(nicknameAtom)
  const [roomName, __] = useAtom(roomNameAtom)
  const { getAllUsersEndpoint } = useEndpoints({ roomName })
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const getUsers = async () => {
      await getAllUsers()
    }

    getUsers()

    const intervalId = setInterval(getUsers, 5000)

    return () => clearInterval(intervalId)
  }, [])
  async function getAllUsers() {
    const options = {
      method: 'GET',
      credentials: 'include',
    }

    const url = `${getAllUsersEndpoint}/${nickname}`
    console.log('URL', url)
    const response = await fetchData<any>(url, undefined, undefined, options)

    if (JSON.stringify(response.users) !== JSON.stringify(users)) {
      setUsers(response.users)
    }
  }
  return (
    <div className="absolute top-4 right-left h-8 w-10">
      <HamburgerMenu iconName="Group">
        <div className="flex flex-col gap-2 overflow-auto custom-scroll max-h-96">
          <h3 className="text-center">Users</h3>
          {users.length > 0 && (
            <div>
              {users.map((user, index) => (
                <p key={index} className="">
                  {user.nickname === nickname ? `${user.nickname} (You)` : user.nickname}

                  {user.afk ? ' (AFK)' : ''}
                </p>
              ))}
            </div>
          )}
        </div>
      </HamburgerMenu>
    </div>
  )
}
