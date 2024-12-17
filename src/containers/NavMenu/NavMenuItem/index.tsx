import { BaseSyntheticEvent, ReactNode } from 'react'
import { Link } from '@i18n/routing'
import clsx from 'clsx'

export type NavMenuItemProp = {
  id: string | number,
  name: string,
  href: string,
  private: boolean,
  children: NavMenuItemProp[]
}

export default function NavMenuItem(
  {
    item,
    onClick,
    children,
    className = '',
    currentPathname
  }:
  {
    children?: ReactNode
    className?: string
    item: NavMenuItemProp
    currentPathname: string
    onClick?: (e: BaseSyntheticEvent) => void,
  }
) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={clsx('text-sm font-semibold leading-6 px-3 py-3 min-h-12 select-none', {
        ['pointer-events-none bg-gray-800 text-gray-400']: item.href === currentPathname,
        ['cursor-pointer hover:bg-gray-900 hover:text-gray-400 active:text-gray-400/70 text-gray-300']: item.href !== currentPathname,
        ['truncate']: true,
        [className]: className
      })}
    >
      {children || item.name}
    </Link>
  )
}
