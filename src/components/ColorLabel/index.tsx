import { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export enum ColorEnum {
  white5 = 1005,
  white15 = 1015,
  white45 = 1045,
  white75 = 1075,
  white95 = 1095,
  red600 = 6600,
  blue600 = 2600,
  amber600 = 3600,
  green600 = 4600,
  fuchsia600 = 5600,
}

export const COLOR_DEFAULT = ColorEnum.white15

export default function ColorLabel(
  {
    size,
    rounded,
    hover,
    active,
    color,
    onClick,
    className = ''
  }:
  {
    size?: number
    hover?: boolean
    active?: boolean
    rounded?: boolean
    className?: string
    color: ColorEnum
    onClick?: (e: BaseSyntheticEvent) => void
  }
) {
  return (
    <div
      onClick={onClick}
      className={clsx('', {
        [className]: className,
        ['w-4 h-4']: size === 4,
        ['w-5 h-5']: size === 5,
        ['w-6 h-6']: size === 6,
        ['rounded-full']: rounded,
        ['border border-white/20']: active,
        ['cursor-pointer hover:opacity-80']: hover,
        [`bg-fuchsia-600`]: color === ColorEnum.fuchsia600,
        [`bg-amber-600`]: color === ColorEnum.amber600,
        [`bg-green-600`]: color === ColorEnum.green600,
        [`bg-blue-600`]: color === ColorEnum.blue600,
        [`bg-red-600`]: color === ColorEnum.red600,
        [`bg-white/5`]: color === ColorEnum.white5,
        [`bg-white/15`]: color === ColorEnum.white15,
        [`bg-white/45`]: color === ColorEnum.white45,
        [`bg-white/75`]: color === ColorEnum.white75,
        [`bg-white/95`]: color === ColorEnum.white95,
      })}
    />
  )
}
