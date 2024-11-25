import React, { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export enum ButtonSkin {
  GRAY_500 = 'gray-500',
  GREEN_500 = 'green-500',
  WHITE_100 = 'white-100',
}

export enum ButtonSize {
  H12 = 12,
  H11 = 11,
  H10 = 10,
  H06 = 6
}

export default function Button(
  {
    children,
    onClick,
    className,
    active = false,
    disabled = false,
    size = ButtonSize.H11,
    skin = ButtonSkin.GRAY_500
  }:
  {
    children: React.ReactNode,
    onClick: (e: BaseSyntheticEvent) => void,
    className?: string,
    active?: boolean,
    disabled?: boolean,
    size?: ButtonSize,
    skin?: ButtonSkin
  },
) {

  return (
    <div
      onClick={onClick}
      className={clsx('border select-none flex items-center justify-center', {
        [className || '']: className,
        'pointer-events-none': disabled,
        'cursor-not-allowed': disabled,
        'cursor-pointer': !disabled,

        'border-green-900 text-gray-100 bg-green-700 hover:bg-green-800 active:bg-green-900': skin === ButtonSkin.GREEN_500 && !disabled && !active,
        'border-green-600 text-gray-100 bg-green-700 hover:bg-green-800 active:bg-green-900': skin === ButtonSkin.GREEN_500 && !disabled && active,
        'border-gray-700 text-gray-500 bg-green-950': skin === ButtonSkin.GREEN_500 && disabled,

        'border-gray-500 text-gray-300 bg-gray-800 hover:bg-gray-700 active:bg-gray-600': skin === ButtonSkin.GRAY_500 && !disabled && !active,
        'border-gray-300 text-gray-300 bg-gray-800 hover:bg-gray-700 active:bg-gray-600': skin === ButtonSkin.GRAY_500 && !disabled && active,
        'border-gray-700 text-gray-500 bg-gray-950': skin === ButtonSkin.GRAY_500 && disabled,

        'border-gray-900/10 text-gray-900 bg-white hover:bg-gray-200 active:bg-gray-300': skin === ButtonSkin.WHITE_100 && !disabled && !active,
        'border-gray-400 text-gray-800 bg-white hover:bg-gray-200 active:bg-gray-300': skin === ButtonSkin.WHITE_100 && !disabled && active,
        'border-gray-300 text-gray-600 bg-gray-300': skin === ButtonSkin.WHITE_100 && disabled,

        'h-12 min-w-12 text-lg': size === ButtonSize.H12,
        'h-11 min-w-11 text-lg': size === ButtonSize.H11,
        'h-10 min-w-10 text-base': size === ButtonSize.H10,
        'h-6 min-w-6 text-xs': size === ButtonSize.H06,
      })}
    >
      {children}
    </div>
  )
}
