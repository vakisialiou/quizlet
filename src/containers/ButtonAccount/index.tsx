import Dropdown from '@components/Dropdown'
import {signOut} from 'next-auth/react'
import {Session} from 'next-auth'

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
          <img
            src={session.user?.image}
            alt={session.user?.name || ''}
            className="rounded-full w-full h-full"
          />
        }
      </div>
    </Dropdown>
  )
}
