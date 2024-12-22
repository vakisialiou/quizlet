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
    className = '',
    onClickBody,
    variant = FolderFrameVariant.default,
  }:
  {
    hover?: boolean
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
        ['border-white/15']: variant === FolderFrameVariant.default,
        ['border-blue-300/40']: variant === FolderFrameVariant.blue,
        ['border-green-300/50']: variant === FolderFrameVariant.green,
        ['border-yellow-500/40']: variant === FolderFrameVariant.yellow
      })}
    >
      {head}

      <div
        onClick={onClickBody}
        className={clsx('h-full flex flex-col text-sm relative p-2', {
          ['group cursor-pointer']: hover
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
