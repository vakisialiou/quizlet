import { ReactNode } from 'react'

export default function HeaderPage(
  { left, right, title }:
  { left?: ReactNode, right?: ReactNode, title?: string | null }
) {
  return (
    <div className="w-full flex gap-4 items-center justify-between p-2 md:px-4 border-b border-gray-800 bg-gray-900/20">

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
    </div>
  )
}
