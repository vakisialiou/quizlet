import NavMenuItem, { NavMenuItemProp } from '@containers/NavMenu/NavMenuItem'
import SVGPanelClose from '@public/svg/panel_close.svg'
import { findModuleFolders } from '@helper/folders'
import ButtonSquare from '@components/ButtonSquare'
import { sortFolders } from '@helper/sort-folders'
import { FoldersType } from '@store/initial-state'
import { usePathname } from '@i18n/routing'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import Account from '@containers/Account'
import { Session } from 'next-auth'
import { useMemo } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

export default function NavMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const t = useTranslations('Folders')
  const session = useSelector(({ session }: { session: Session | null }) => session)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const collectionChildren = useMemo(() => {

    return sortFolders(findModuleFolders([...folders.items]))
      .map((item) => {
        return {
          id: item.id,
          name: item.name,
          private: true,
          href: `/private/folder/${item.id}`
        } as NavMenuItemProp
      })
  }, [folders.items])

  const menuItems = [
    {
      id: 1,
      name: 'Home',
      href: `/`,
      private: false,
      children: []
    },
    {
      id: 2,
      name: t('headTitle'),
      href: `/private/collection`,
      private: true,
      children: collectionChildren
    },
  ] as NavMenuItemProp[]

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
              className="right-4 top-4"
              onClick={onClose}
            />
          </div>
        </div>

        <div
          className="flex flex-col w-full h-[calc(100%-64px)] justify-between"
        >

          <div
            className={clsx('h-full flex flex-col bg-gray-900/50', {
              ['overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500/50 scrollbar-track-gray-900/80 active:scrollbar-thumb-gray-400']: true
            })}
          >
            {menuItems.map((item) => {
              if (item.private && !session) {
                return
              }

              return (
                <div
                  className="flex flex-col w-full"
                  key={item.id}
                >
                  <NavMenuItem
                    item={item}
                    currentPathname={pathname}
                  />

                  {item.children.map((child) => {
                    return (
                      <NavMenuItem
                        item={child}
                        key={child.id}
                        className="relative pl-8"
                        currentPathname={pathname}
                      >
                        <div
                          className="absolute w-1 h-10 left-3 top-[3px] border-l border-dashed border-white/25"
                        />
                        <div
                          className="absolute w-3 h-6 left-4 top-[-0px] border-b border-dashed border-white/25"
                        />
                        {child.name || <span className="text-gray-500">{t('folderNoName')}</span>}
                      </NavMenuItem>
                    )
                  })}
                </div>
              )
            })}
          </div>

          <div className="flex flex-col px-4 py-4 bg-gray-900/70">
            <Account session={session}/>
          </div>
        </div>

      </div>
    </div>
  )
}
