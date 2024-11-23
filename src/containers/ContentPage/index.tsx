import ButtonSquare from '@components/ButtonSquare'
import HeaderPage from '@containers/HeaderPage'
import SVGBack from '@public/svg/back.svg'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

export default function ContentPage(
  {
    title,
    children,
    leftControls,
    rightControls,
    backURL = null
  }:
  {
    children: ReactNode,
    title?: string | null
    leftControls?: ReactNode,
    rightControls?: ReactNode,
    backURL?: string | null
  }) {
  const router = useRouter()

  return (
    <>
      <HeaderPage
        title={title}
        left={
          <>
            {backURL &&
              <ButtonSquare
                icon={SVGBack}
                onClick={() => router.push(backURL)}
              />
            }
            {leftControls}
          </>
        }
        right={rightControls}
      />

      <div className="h-[calc(100vh-7rem)] overflow-y-auto">
        {children}
      </div>
    </>
  )
}
