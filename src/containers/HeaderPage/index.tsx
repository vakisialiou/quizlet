import React, { ReactNode } from 'react'

export default function HeaderPage(
  { left, right, title }:
  { left?: ReactNode, right?: ReactNode, title?: ReactNode }
) {
  return (
    <div className="w-full h-16 px-4 flex gap-2 items-center justify-between bg-gray-900/20 relative">

      <div className="flex gap-2 items-center">
        {left}
      </div>

      {title}

      {right &&
        <div className="flex gap-2 items-center">
          {right}
        </div>
      }

      <div className="w-full h-[1px] bg-white/20 absolute bottom-0 left-0" />
    </div>
  )
}
