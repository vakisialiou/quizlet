import { ComponentType, SVGProps, BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export enum ButtonSquareSize {
  h8 = 8,
  h10 = 10,
  h12 = 12,
}

export enum ButtonSquareVariant {
  gray = 'gray',
  white = 'white',
  transparent = 'transparent'
}

export default function ButtonSquare(
  {
    icon,
    onClick,
    size = 8,
    iconSize = 32,
    className = '',
    classNameIcon = '',
    bordered = false,
    disabled = false,
    rounded = false,
    shadow = false,
    variant = ButtonSquareVariant.transparent,
  }:
  {
    onClick?: (e: BaseSyntheticEvent) => void
    icon: ComponentType<SVGProps<SVGSVGElement>>
    variant?: ButtonSquareVariant
    bordered?: boolean
    rounded?: boolean
    iconSize?: number
    size?: number
    className?: string
    classNameIcon?: string
    disabled?: boolean
    shadow?: boolean
  }
) {
  const IconComponent = icon
  return (
    <div
      onClick={onClick}
      className={clsx('transition-all flex items-center justify-center select-none group', {
        ['border']: bordered,

        ['rounded-full']: rounded,
        ['hover:cursor-pointer']: !disabled,
        ['pointer-events-none opacity-15']: disabled,

        ['w-8 min-w-8 h-8']: size === ButtonSquareSize.h8,
        ['w-10 min-w-10 h-10']: size === ButtonSquareSize.h10,
        ['w-12 min-w-12 h-12']: size === ButtonSquareSize.h12,

        ['shadow-inner']: shadow,
        ['shadow-gray-500 hover:shadow-gray-500/80 active:shadow-gray-500/60']: shadow,

        ['hover:bg-white/15']: variant === ButtonSquareVariant.transparent,
        ['border-gray-400 hover:border-gray-300 active:border-gray-400']: variant === ButtonSquareVariant.transparent && bordered,

        ['bg-gray-800 hover:bg-gray-800/50 active:bg-gray-800/55']: variant === ButtonSquareVariant.gray,
        ['border-gray-500 hover:border-gray-400 active:border-gray-500']: variant === ButtonSquareVariant.gray && bordered,

        ['bg-white hover:bg-gray-50/90 active:bg-gray-50/95']: variant === ButtonSquareVariant.white,
        ['border-gray-700 hover:border-gray-500 active:border-gray-700']: variant === ButtonSquareVariant.white && bordered,


        [className]: className
      })}
    >
      <IconComponent
        width={iconSize}
        height={iconSize}
        className={clsx('transition-colors', {
          [classNameIcon]: classNameIcon,
          ['text-gray-400 group-hover:text-gray-300 group-active:text-gray-400']: variant === ButtonSquareVariant.transparent,
          ['text-gray-500 group-hover:text-gray-400 group-active:text-gray-500']: variant === ButtonSquareVariant.gray,
          ['text-gray-700 group-hover:text-gray-900 group-active:text-gray-700']: variant === ButtonSquareVariant.white
        })}
      />
    </div>
  )
}
