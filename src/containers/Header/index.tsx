'use client'

import SVGGoogle from '@public/svg/painted/google.svg'
import ButtonAccount from '@containers/ButtonAccount'
import Button, { ButtonSkin } from '@components/Button'
import { signIn } from 'next-auth/react'
import { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'

type MenuItemType = {
  id: string,
  href: string,
  name: string,
}

type MenuItemsType = MenuItemType[]

export default function Header({ menuItems = [], session = null }: { menuItems: MenuItemsType, session: Session | null }) {
  return (
    <header>
      <nav className="mx-auto flex items-center justify-between p-2 md:p-4">
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

        <div className="flex gap-x-12">
          {menuItems.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-300"
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
              className="px-4 gap-2 text-nowrap"
              skin={ButtonSkin.WHITE_100}
              onClick={() => signIn('google')}
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
