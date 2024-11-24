import SVGCollapseMenu from '@public/svg/collapsemenu.svg'
import ButtonSquare from '@components/ButtonSquare'
import HeaderPage from '@containers/HeaderPage'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import SVGBack from '@public/svg/back.svg'
import NavMenu from '@containers/NavMenu'

export default function ContentPage(
  {
    title,
    children,
    leftControls,
    rightControls,
    backURL = null,
  }:
  {
    children: ReactNode,
    title?: string | null
    leftControls?: ReactNode,
    rightControls?: ReactNode,
    backURL?: string | null,
  }) {
  const router = useRouter()
  const [opened, setOpened] = useState(false)

  return (
    <>
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

      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
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
