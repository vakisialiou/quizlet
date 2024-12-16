import {BaseSyntheticEvent, ReactNode} from 'react'
import clsx from 'clsx'

export default function FolderFrame(
  {
    head,
    children,
    hover = true,
    className = '',
    onClickBody
  }:
  {
    hover?: boolean
    head?: ReactNode,
    children?: ReactNode,
    className?: string,
    onClickBody?: (e: BaseSyntheticEvent) => void
  }
) {
  return (
    <div
      className={clsx('w-full border border-white/15 bg-black rounded-md select-none flex flex-col overflow-hidden', {
        [className]: className,
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
