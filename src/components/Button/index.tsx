import React, { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export default function Button(
  { children, onClick, className }:
  { children: React.ReactNode, onClick: (e: BaseSyntheticEvent) => void, className?: string }
) {

  return (
    <div
      onClick={onClick}
      className={clsx('border bg-blue-700 hover:bg-blue-800 active:bg-blue-900 px-3.5 py-1 cursor-pointer select-none rounded-md transition-colors', {
        [className || '']: className
      })}
    >
      {children}
    </div>
  )
}
