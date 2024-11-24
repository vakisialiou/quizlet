'use client'

import Button, { ButtonSkin, ButtonSize } from '@components/Button'
import SVGGoogle from '@public/svg/painted/google.svg'
import ContentPage from '@containers/ContentPage'
import { useSelector } from 'react-redux'
import { signIn } from 'next-auth/react'
import { Session } from 'next-auth'
import Link from 'next/link'
import { memo } from 'react'

function Landing() {
  const session = useSelector(({ session }: { session: Session | null }) => session)

  return (
    <ContentPage>
     {!session &&
       <div className="flex flex-col gap-8 h-96 w-full items-center justify-center" >
         <Button
           size={ButtonSize.H10}
           skin={ButtonSkin.WHITE_100}
           onClick={() => signIn('google')}
           className="px-4 gap-2 text-nowrap"
         >
           <SVGGoogle
             width={16}
             height={16}
           />
           Sign in with Google
         </Button>
       </div>
     }

      {session &&
        <div className="flex flex-col gap-8 h-96 justify-center items-center text-center">
          <div className="text-xl font-bold">Create folder to start <br/>learn new terms!</div>

          <Link
            href="/private"
            className="text-gray-400 underline hover:text-gray-500"
          >
            Go to folders 👉🏼
          </Link>
        </div>
      }
    </ContentPage>
  )
}

export default memo(Landing)
