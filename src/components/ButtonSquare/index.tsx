import { ComponentType, SVGProps } from 'react'

export default function ButtonSquare(
  { onClick, icon }:
  { onClick?: () => void, icon: ComponentType<SVGProps<SVGSVGElement>> }
) {
  const IconComponent = icon
  return (
    <div
      onClick={onClick}
      className="transition-colors border border-gray-400 hover:border-gray-500 w-8 h-8 hover:cursor-pointer flex items-center justify-center select-none group"
    >
      <IconComponent
        width={32}
        height={32}
        className="transition-colors text-gray-400 group-hover:text-gray-500 group-active:text-gray-600"
      />
    </div>
  )
}
