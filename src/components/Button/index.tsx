import React, { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export enum ButtonSkin {
  GRAY = 'gray',
  GREEN = 'green',
  WHITE = 'white',
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
    border = true,
    shadow = true,
    active = false,
    disabled = false,
    size = ButtonSize.H11,
    skin = ButtonSkin.GRAY
  }:
  {
    children: React.ReactNode,
    onClick: (e: BaseSyntheticEvent) => void,
    className?: string,
    border?: boolean,
    shadow?: boolean,
    active?: boolean,
    disabled?: boolean,
    size?: ButtonSize,
    skin?: ButtonSkin
  },
) {

  return (
    <div
      onClick={onClick}
      className={clsx('select-none flex items-center justify-center rounded transition-all', {
        [className || '']: className,
        'pointer-events-none': disabled,
        'cursor-not-allowed': disabled,
        'cursor-pointer': !disabled,

        'border': border,
        'shadow-inner': shadow,
        'border-green-500/50 shadow-white/30 hover:shadow-white/40 text-white bg-green-500/70 hover:bg-green-500/80 active:bg-green-500/90': skin === ButtonSkin.GREEN && !disabled && !active,
        'border-green-100/50 shadow-white/30 hover:shadow-white/40 text-white bg-green-600/50 hover:bg-green-600/60 active:bg-green-600/70': skin === ButtonSkin.GREEN && !disabled && active,

        'border-gray-500/50 shadow-gray-400/50 hover:shadow-gray-400/60 text-white bg-gray-600/70 hover:bg-gray-600/80 active:bg-gray-600/90': skin === ButtonSkin.GRAY && !disabled && !active,
        'border-gray-300/50 shadow-gray-400/50 hover:shadow-gray-400/60 text-white bg-gray-700/50 hover:bg-gray-700/60 active:bg-gray-700/70': skin === ButtonSkin.GRAY && !disabled && active,

        'border-gray-900/50 shadow-gray-700/50 hover:shadow-gray-700/60 text-gray-900 bg-white hover:bg-white/90 active:bg-white/80': skin === ButtonSkin.WHITE && !disabled && !active,
        'border-gray-100/50 shadow-gray-700/50 hover:shadow-gray-700/60 text-gray-900 bg-white hover:bg-white/80 active:bg-white/70': skin === ButtonSkin.WHITE && !disabled && active,

        'border-gray-500/50 shadow-none text-gray-500/50 bg-transparent': disabled,

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
