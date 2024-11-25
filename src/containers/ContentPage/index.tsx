import SVGCollapseMenu from '@public/svg/collapsemenu.svg'
import ButtonSquare from '@components/ButtonSquare'
import HeaderPage from '@containers/HeaderPage'
import { ReactNode, useState } from 'react'
import NavMenu from '@containers/NavMenu'
import clsx from 'clsx'

export default function ContentPage(
  {
    title,
    children,
    leftControls,
    rightControls,
    hideHeader = false,
  }:
  {
    children: ReactNode,
    title?: string | null
    leftControls?: ReactNode,
    rightControls?: ReactNode,
    hideHeader?: boolean,
  }) {
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
          right={rightControls}
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
