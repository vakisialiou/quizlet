'use client'

import { signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'

export default function Test({ session }: { session: Session | null }) {
  return (
    <div>
      {!session &&
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      }

      {session &&
        <>
          <p>Welcome, {session.user?.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      }
    </div>
  )
}
