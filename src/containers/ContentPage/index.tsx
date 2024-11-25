import SVGCollapseMenu from '@public/svg/collapsemenu.svg'
import ButtonSquare from '@components/ButtonSquare'
import HeaderPage from '@containers/HeaderPage'
import { ReactNode, useState } from 'react'
import NavMenu from '@containers/NavMenu'
import clsx from 'clsx'

export default function ContentPage(
  {
    title,
    footer,
    children,
    leftControls,
    rightControls,
    showHeader = false,
    showFooter = false,
  }:
  {
    title?: ReactNode
    footer?: ReactNode,
    children: ReactNode,
    leftControls?: ReactNode,
    rightControls?: ReactNode,
    showHeader?: boolean,
    showFooter?: boolean,
  }) {
  const [opened, setOpened] = useState(false)
  let contentHeight = 0
  if (showHeader) {
    contentHeight += 4
  }
  if (showFooter) {
    contentHeight += 4
  }

  return (
    <>
      {showHeader &&
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
        className={clsx(`overflow-y-auto`, {
          [`h-[calc(100vh-56px)]`]: (showHeader && !showFooter) || (!showHeader && showFooter),
          [`h-[calc(100vh-112px)]`]: showHeader && showHeader,
          ['h-screen']: contentHeight === 0
        })}
      >
        {children}
      </div>

      {showFooter &&
        <div className="w-full h-14 px-2 flex gap-2 items-center justify-between bg-gray-900/20 relative">
          <div className="w-full h-[1px] bg-gray-700 absolute top-0 left-0"/>
          {footer}
        </div>
      }

      {opened &&
        <NavMenu
          onClose={() => setOpened((prevState) => !prevState)}
        />
      }
    </>
  )
}
