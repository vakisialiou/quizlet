import Button, { ButtonSize } from '@components/Button'
import {signIn, signOut} from 'next-auth/react'
import {Session} from 'next-auth'
import Image from 'next/image'

export default function Account({ session }: { session: Session | null }) {
  return (
    <div className="flex gap-4 items-center overflow-hidden">

      {session &&
        <>
          <div
            className="w-10 h-10 min-w-10 border border-gray-500 bg-gray-800 rounded-full flex items-center justify-center"
          >
            {session.user?.image &&
              <Image
                priority
                width={38}
                height={38}
                src={session.user?.image}
                alt={session.user?.name || 'User Avatar'}
                className="rounded-full w-full h-full"
              />
            }
          </div>
          <div className="flex justify-between items-end gap-2 w-full overflow-hidden">
            <div className="flex flex-col text-sm text-gray-400 w-full overflow-hidden">
              <span className="font-bold truncate ...">{session.user?.name}</span>
              <span className="truncate ...">{session.user?.email}</span>
            </div>

            <Button
              className="px-4 min-w-12"
              size={ButtonSize.H06}
              onClick={() => signOut({redirectTo: '/'})}
            >
              Logout
            </Button>
          </div>
        </>
      }

      {!session &&
        <>
          <div
            className="w-10 h-10 min-w-10 border border-gray-500 bg-gray-800 rounded-full flex items-center justify-center"
          >
            <div className="animate-pulse flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-700"/>
            </div>

          </div>
          <div className="flex justify-between items-end gap-2 w-full overflow-hidden">
            <div className="flex flex-col gap-2 text-sm text-gray-400 w-full overflow-hidden">
              <div className="animate-pulse flex items-center">
                <div className="w-1/4 h-2 rounded-full bg-slate-700"/>
              </div>
              <div className="animate-pulse flex items-center">
                <div className="w-1/2 h-2 rounded-full bg-slate-700"/>
              </div>
            </div>

            <Button
              className="px-4 min-w-12"
              size={ButtonSize.H06}
              onClick={() => signIn('google')}
            >
              SignIn
            </Button>
          </div>
        </>
      }

    </div>
  )
}
