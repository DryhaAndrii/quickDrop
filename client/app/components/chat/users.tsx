import HamburgerMenu from '../hamburgerMenu/hamburgerMenu'
import { useAtom } from 'jotai'
import { nicknameAtom } from '@/store/nickname'
import { roomNameAtom } from '@/store/roomName'
import { UserType } from '@/types/user'

interface Props {
  users: UserType[]
}
export default function Users({ users }: Props) {
  const [nickname, _] = useAtom(nicknameAtom)

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
