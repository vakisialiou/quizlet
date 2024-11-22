import Dropdown from '@components/Dropdown'
import {signOut} from 'next-auth/react'
import {Session} from 'next-auth'
import Image from 'next/image'

export default function ButtonAccount({ session }: { session: Session }) {
  return (
    <Dropdown
      className="p-2"
      classNameMenu="min-w-40"
      items={[
        { id: 1, name: 'Log Out' }
      ]}
      onSelect={async (id) => {
        switch (id) {
          case 1:
            await signOut({ redirectTo: '/' })
            break
        }
      }}
    >
      <div
        className="w-6 h-6 border border-gray-500 bg-gray-800 rounded-full flex items-center justify-center"
      >
        {session.user?.image &&
          <Image
            priority
            width={24}
            height={24}
            src={session.user?.image}
            alt={session.user?.name || 'User Avatar'}
            className="rounded-full w-full h-full"
          />
        }
      </div>
    </Dropdown>
  )
}
