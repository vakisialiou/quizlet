import {BaseSyntheticEvent, ReactNode} from 'react'
import clsx from 'clsx'

export enum FolderFrameVariant {
  default = 'default',
  yellow = 'yellow',
  green = 'green',
  blue = 'blue',
}

export default function FolderFrame(
  {
    head,
    children,
    hover = true,
    disabled = false,
    className = '',
    onClickBody,
    variant = FolderFrameVariant.default,
  }:
  {
    hover?: boolean
    disabled?: boolean
    head?: ReactNode,
    children?: ReactNode,
    className?: string,
    onClickBody?: (e: BaseSyntheticEvent) => void
    variant?: FolderFrameVariant
  }
) {
  return (
    <div
      className={clsx('w-full border bg-black rounded-md select-none flex flex-col overflow-hidden', {
        [className]: className,
        ['border-white/15']: !disabled && variant === FolderFrameVariant.default,
        ['border-white/10']: disabled && variant === FolderFrameVariant.default,

        ['border-blue-300/50']: !disabled && variant === FolderFrameVariant.blue,
        ['border-blue-300/20']: disabled && variant === FolderFrameVariant.blue,

        ['border-green-300/50']: !disabled && variant === FolderFrameVariant.green,
        ['border-green-300/25']: disabled && variant === FolderFrameVariant.green,

        ['border-yellow-500/50']: !disabled && variant === FolderFrameVariant.yellow,
        ['border-yellow-500/20']: disabled && variant === FolderFrameVariant.yellow,
      })}
    >
      {head}

      <div
        onClick={(e) => {
          if (onClickBody && !disabled) {
            onClickBody(e)
          }
        }}
        className={clsx('h-full flex flex-col text-sm relative p-2', {
          ['group cursor-pointer']: hover,
          ['pointer-events-none bg-black/90']: disabled
        })}
      >
        <div
          className={clsx('absolute left-0 top-0 w-full h-full bg-white/5 transition-all pointer-events-none', {
            ['group-hover:bg-white/10 group-active:bg-white/15']: hover
          })}
        />

        {children}
      </div>
    </div>
  )
}
