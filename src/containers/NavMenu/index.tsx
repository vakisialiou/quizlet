import { Link, useRouter, usePathname } from '@i18n/routing'
import SVGPanelClose from '@public/svg/panel_close.svg'
import ButtonSquare from '@components/ButtonSquare'
import { useSelector } from 'react-redux'
import Account from '@containers/Account'
import { Session } from 'next-auth'
import Image from 'next/image'
import clsx from 'clsx'

export default function NavMenu({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const pathname = usePathname()

  const session = useSelector(({ session }: { session: Session | null }) => session)

  const menuItems = [
    { id: 1, name: 'Home', href: `/` },
    { id: 2, name: 'Collections', href: `/private/collection`, private: true },
  ]

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10">
      <div
        className="absolute w-full h-full bg-black/60"
        onClick={onClose}
      />
      <div
        className="absolute w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:1/5 h-full bg-black border-r border-gray-700 flex flex-col">

        <div className="flex h-16 px-4 flex-col border-b border-gray-700 p-4 bg-gray-900/70">
          <div className="flex h-8 justify-between">
            <div className="flex gap-4 items-center">
              <Image
                priority
                alt="Logo"
                height={20}
                width={23.5}
                src="/svg/logo.svg"
              />

              <span className="text-xl font-bold">
                QuizerPlay
              </span>
            </div>

            <ButtonSquare
              icon={SVGPanelClose}
              className="right-4 top-4 md:hidden"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="flex flex-col px-4 py-4 bg-gray-900/70">
          <Account session={session}/>
        </div>

        <div className="h-full flex flex-col bg-gray-900/50">
          {menuItems.map((item) => {
            if (item.private && !session) {
              return
            }

            if (item.private) {
              return (
                <div
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={clsx('cursor-pointer text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-900 hover:text-gray-400 active:text-gray-400/70 px-3 py-3', {
                    ['pointer-events-none bg-gray-800 text-gray-400']: item.href === pathname,
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
                className={clsx('cursor-pointer text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-900 hover:text-gray-400 active:text-gray-400/70 px-3 py-3', {
                  ['pointer-events-none bg-gray-800 text-gray-400']: item.href === pathname,
                })}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
