import { ReactNode } from 'react'

export default function HeaderPage(
  { left, right, title }:
  { left?: ReactNode, right?: ReactNode, title?: string | null }
) {
  return (
    <div className="w-full flex gap-4 items-center justify-between h-16 p-2 md:px-4">

      <div className="flex gap-2 items-center">
        {left}
      </div>

      {title &&
        <div className="overflow-hidden w-full max-w-full">
          <div className="flex gap-2 items-center justify-start w-full">
            <span className="truncate ...">{title}</span>
          </div>
        </div>
      }


      {right &&
        <div className="flex gap-2 items-center">
          {right}
        </div>
      }
    </div>
  )
}
