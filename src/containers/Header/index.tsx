'use client'

import Button, { ButtonSkin, ButtonSize } from '@components/Button'
import { usePathname, useRouter } from 'next/navigation'
import SVGGoogle from '@public/svg/painted/google.svg'
import ButtonAccount from '@containers/ButtonAccount'
import { signIn } from 'next-auth/react'
import { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import clsx from 'clsx'

function Header(
  { session = null, className = '' }:
  { session: Session | null, className?: string }
) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    {id: 1, name: 'Home', href: '/'},
    {id: 2, name: 'Folders', href: `/private`, private: true},
  ]

  return (
    <header className={className}>
      <nav className="mx-auto flex items-center justify-between h-14 px-2 md:h-16 md:p-4 gap-4 bg-gray-900/50">
        <Link href="/" className="-m-1.5 p-2.5">
          <span className="sr-only">Quizlet</span>
          <Image
            priority
            alt="Logo"
            height={20}
            width={23.5}
            src="/svg/logo.svg"
          />
        </Link>

        <div className="flex">
          {menuItems.map((item) => {
            if (item.private && !session) {
              return
            }

            if (item.private) {
              return (
                <div
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={clsx('cursor-pointer text-sm font-semibold leading-6 text-gray-300 hover:text-gray-400 active:text-gray-400/70 px-3 py-2', {
                    ['underline underline-offset-4 pointer-events-none text-gray-400']: item.href === pathname,
                  })}
                >
                  {item.name}
                </div>
              )
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={clsx('cursor-pointer text-sm font-semibold leading-6 text-gray-300 hover:text-gray-400 active:text-gray-400/70 px-3 py-2', {
                  ['underline underline-offset-4 pointer-events-none text-gray-400']: item.href === pathname,
                })}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
        <div className="flex flex-1 justify-end">
          {session &&
            <ButtonAccount
              session={session}
            />
          }

          {!session &&
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
          }
        </div>
      </nav>
    </header>
  )
}

export default memo(Header)
