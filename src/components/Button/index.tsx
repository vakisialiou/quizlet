import React, { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export enum ButtonVariant {
  GRAY = 'gray',
  GREEN = 'green',
  WHITE = 'white',
}

export enum ButtonSize {
  H12 = 12,
  H11 = 11,
  H10 = 10,
  H08 = 8,
  H06 = 6
}

export default function Button(
  {
    id,
    children,
    onClick,
    className,
    border = true,
    shadow = true,
    active = false,
    rounded = true,
    disabled = false,
    size = ButtonSize.H10,
    variant = ButtonVariant.GRAY
  }:
  {
    id?: string
    children: React.ReactNode,
    onClick?: (e: BaseSyntheticEvent) => void,
    className?: string,
    border?: boolean,
    shadow?: boolean,
    active?: boolean,
    rounded?: boolean,
    disabled?: boolean,
    size?: ButtonSize,
    variant?: ButtonVariant
  },
) {

  return (
    <div
      id={id}
      onClick={onClick}
      className={clsx('select-none flex items-center justify-center transition-all', {
        [className || '']: className,
        'pointer-events-none': disabled,
        'cursor-not-allowed': disabled,
        'cursor-pointer': !disabled,

        'border': border,
        'rounded': rounded,
        'shadow-inner': shadow,
        'border-green-700/50 shadow-white/50 hover:shadow-white/40 text-white bg-green-700 hover:bg-green-700/80 active:bg-green-700/90': variant === ButtonVariant.GREEN && !disabled && !active,
        'border-green-200/50 shadow-white/30 hover:shadow-white/40 text-white bg-green-800/50 hover:bg-green-800/60 active:bg-green-800/70': variant === ButtonVariant.GREEN && !disabled && active,

        'border-gray-500/50 shadow-gray-400/50 hover:shadow-gray-400/60 text-white/80 bg-gray-600/70 hover:bg-gray-600/80 active:bg-gray-600/90': variant === ButtonVariant.GRAY && !disabled && !active,
        'border-gray-300/50 shadow-gray-400/50 hover:shadow-gray-400/60 text-white/80 bg-gray-700/50 hover:bg-gray-700/60 active:bg-gray-700/70': variant === ButtonVariant.GRAY && !disabled && active,

        'border-gray-900/50 shadow-gray-700/50 hover:shadow-gray-700/60 text-gray-900 bg-white hover:bg-white/90 active:bg-white/80': variant === ButtonVariant.WHITE && !disabled && !active,
        'border-gray-100/50 shadow-gray-700/50 hover:shadow-gray-700/60 text-gray-900 bg-white hover:bg-white/80 active:bg-white/70': variant === ButtonVariant.WHITE && !disabled && active,

        'border-gray-500/50 shadow-none text-gray-500/50 bg-transparent': disabled,

        'h-12 min-w-12 text-lg': size === ButtonSize.H12,
        'h-11 min-w-11 text-lg': size === ButtonSize.H11,
        'h-10 min-w-10 text-base': size === ButtonSize.H10,
        'h-8 min-w-8 text-sm': size === ButtonSize.H08,
        'h-6 min-w-6 text-xs': size === ButtonSize.H06,
      })}
    >
      {children}
    </div>
  )
}
