import { ReactNode } from 'react'

export default function HeaderPage(
  { left, right, title }:
  { left?: ReactNode, right?: ReactNode, title?: ReactNode }
) {
  return (
    <div className="w-full h-16 px-4 flex gap-2 items-center justify-between bg-gray-900/20 relative">

      <div className="flex gap-2 items-center">
        {left}
      </div>

      {title &&
        <div className="overflow-hidden w-full max-w-full">
          <div className="flex gap-2 items-center justify-start w-full pr-2">
            <span className="text-gray-500 font-bold truncate ...">{title}</span>
          </div>
        </div>
      }

      {right &&
        <div className="flex gap-2 items-center">
          {right}
        </div>
      }

      <div className="w-full h-[1px] bg-gray-700 absolute bottom-0 left-0" />
    </div>
  )
}
