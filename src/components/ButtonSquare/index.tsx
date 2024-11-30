import { ComponentType, SVGProps } from 'react'
import clsx from 'clsx'

export default function ButtonSquare(
  { onClick, icon, bordered = false, size = 32, className = '' }:
  { onClick?: () => void, icon: ComponentType<SVGProps<SVGSVGElement>>, bordered?: boolean, size?: number, className?: string }
) {
  const IconComponent = icon
  return (
    <div
      onClick={onClick}
      className={clsx('transition-colors w-8 h-8 hover:cursor-pointer flex items-center justify-center select-none group', {
        ['border border-gray-400 hover:border-gray-500']: bordered,
        [className]: className
      })}
    >
      <IconComponent
        width={size}
        height={size}
        className="transition-colors text-gray-400 group-hover:text-gray-500 group-active:text-gray-600"
      />
    </div>
  )
}
