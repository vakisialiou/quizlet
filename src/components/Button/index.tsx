import React, { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export default function Button(
  { children, onClick, className, disabled = false }:
  { children: React.ReactNode, onClick: (e: BaseSyntheticEvent) => void, className?: string, disabled?: boolean }
) {

  return (
    <div
      onClick={onClick}
      className={clsx('border select-none rounded-md transition-colors flex items-center justify-center h-8 min-w-8', {
        [className || '']: className,
        'pointer-events-none': disabled,
        'border-gray-700 text-gray-500 bg-gray-950 cursor-not-allowed': disabled,
        'border-gray-500 text-gray-300 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 cursor-pointer': !disabled
      })}
    >
      {children}
    </div>
  )
}
