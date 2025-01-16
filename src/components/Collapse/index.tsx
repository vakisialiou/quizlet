import SVGArrow from '@public/svg/downarrow_hlt.svg'
import ButtonSquare from '@components/ButtonSquare'
import React, {ReactNode, useState} from 'react'
import clsx from 'clsx'

export default function Collapse(
  {
    title,
    controls,
    children,
    collapsed = false,
    className = '',
  }:
  {
    collapsed?: boolean
    title: ReactNode
    children: ReactNode
    controls?: ReactNode
    className?: string
  }
) {
  const [ value, setCollapsed ] = useState(collapsed)
  return (
    <div
      className={clsx('flex flex-col', {
        [className]: className
      })}
    >
      <div className={clsx('flex justify-between items-center gap-2 w-full text-white/50 font-bold', {
        ['border-b border-white/15 mb-2 pb-2']: !value
      })}>
        <div className="flex">
          {title}
        </div>
        <div className="flex items-center gap-1">
          {controls}

          <ButtonSquare
            size={24}
            icon={SVGArrow}
            classNameIcon={clsx('', {
              ['rotate-180']: !value
            })}
            onClick={() => {
              setCollapsed(!value)
            }}
          />
        </div>
      </div>

      {!value && children}
    </div>
  )
}
