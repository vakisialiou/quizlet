'use client'

import Button, { ButtonSkin, ButtonSize } from '@components/Button'
import { usePathname, useRouter } from 'next/navigation'
import SVGGoogle from '@public/svg/painted/google.svg'
import ButtonAccount from '@containers/ButtonAccount'
import { signIn } from 'next-auth/react'
import { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

type MenuItemType = {
  id: string | number,
  href: string,
  name: string,
  private?: boolean
}

type MenuItemsType = MenuItemType[]

export default function Header({ menuItems = [], session = null }: { menuItems: MenuItemsType, session: Session | null }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <header>
      <nav className="mx-auto flex items-center justify-between p-2 md:p-4 gap-4">
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
                  className={clsx('text-sm font-semibold leading-6 text-gray-300 hover:text-gray-100 active:text-gray-100/70 px-3 py-2', {
                    ['underline underline-offset-4 pointer-events-none']: item.href === pathname,
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
                className={clsx('text-sm font-semibold leading-6 text-gray-300 hover:text-gray-100 active:text-gray-100/70 px-3 py-2', {
                  ['underline underline-offset-4 pointer-events-none']: item.href === pathname,
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
