import SVGCollapseMenu from '@public/svg/collapsemenu.svg'
import ButtonSquare from '@components/ButtonSquare'
import HeaderPage from '@containers/HeaderPage'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import SVGBack from '@public/svg/back.svg'
import NavMenu from '@containers/NavMenu'
import clsx from 'clsx'

export default function ContentPage(
  {
    title,
    children,
    leftControls,
    rightControls,
    backURL = null,
    hideHeader = false,
  }:
  {
    children: ReactNode,
    title?: string | null
    leftControls?: ReactNode,
    rightControls?: ReactNode,
    backURL?: string | null,
    hideHeader?: boolean,
  }) {
  const router = useRouter()
  const [opened, setOpened] = useState(false)

  return (
    <>
      {!hideHeader &&
        <HeaderPage
          title={title}
          left={
            <>
              <ButtonSquare
                size={24}
                icon={SVGCollapseMenu}
                onClick={() => setOpened(true)}
              />
              {leftControls}
            </>
          }
          right={(
            <>
              {backURL &&
                <ButtonSquare
                  bordered
                  size={24}
                  icon={SVGBack}
                  onClick={() => router.push(backURL)}
                />
              }

              {rightControls}
            </>
          )}
        />
      }

      <div
        className={clsx('overflow-y-auto', {
          ['h-[calc(100vh-4rem)]']: !hideHeader,
          ['h-screen']: hideHeader
        })}
      >
        {children}
      </div>

      {opened &&
       <NavMenu
        onClose={() => setOpened((prevState) => !prevState)}
       />
      }
    </>
  )
}
