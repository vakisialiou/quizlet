import React, { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export enum Skin {
  GRAY_500 = 'gray-500',
  WHITE_100 = 'white-100',
}

export default function Button(
  { children, onClick, className, disabled = false, skin = Skin.GRAY_500 }:
  { children: React.ReactNode, onClick: (e: BaseSyntheticEvent) => void, className?: string, disabled?: boolean, skin?: Skin },
) {

  return (
    <div
      onClick={onClick}
      className={clsx('border select-none transition-colors flex items-center justify-center h-8 min-w-8', {
        [className || '']: className,
        'pointer-events-none': disabled,
        'cursor-not-allowed': disabled,
        'cursor-pointer': !disabled,

        'border-gray-700 text-gray-500 bg-gray-950': skin === Skin.GRAY_500 && disabled,
        'border-gray-500 text-gray-300 bg-gray-800 hover:bg-gray-700 active:bg-gray-600': skin === Skin.GRAY_500 && !disabled,

        'border-gray-300 text-gray-500 bg-gray-300': skin === Skin.WHITE_100 && disabled,
        'border-gray-200 text-gray-800 bg-gray-50 hover:bg-gray-200 active:bg-gray-300': skin === Skin.WHITE_100 && !disabled
      })}
    >
      {children}
    </div>
  )
}
