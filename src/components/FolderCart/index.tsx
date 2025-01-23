import FolderFrame, { FolderFrameVariant } from '@components/FolderFrame'
import Dropdown, { DropdownItemType } from '@components/Dropdown'
import SVGThreeDots from '@public/svg/three_dots.svg'
import { BaseSyntheticEvent, ReactNode } from 'react'
import clsx from 'clsx'

export type DropDownProps = {
  hidden?: boolean
  items?: DropdownItemType[]
  onSelect?: (id: string | number) => void
}

export default function FolderCart(
  {
    title,
    labels,
    hover = true,
    disabled = false,
    dropdown,
    children,
    className = '',
    onClickBody,
    controls,
    variant,
  }:
  {
    hover?: boolean
    disabled?: boolean
    title?: ReactNode,
    className?: string,
    labels?: ReactNode,
    children?: ReactNode,
    controls?: ReactNode,
    dropdown?: DropDownProps
    onClickBody?: (e: BaseSyntheticEvent) => void
    variant?: FolderFrameVariant
  }
) {

  return (
    <FolderFrame
      hover={hover}
      variant={variant}
      disabled={disabled}
      className={className}
      onClickBody={onClickBody}
      head={(
        <div
          className={clsx('w-full flex items-center justify-between h-8 min-h-8 relative z-0 px-1 border-b', {
            ['border-white/15']: !disabled,
            ['border-white/10']: disabled,
          })}
        >
          <div
            className={clsx('z-0 absolute left-0 top-0 w-full h-full pointer-events-none', {
              ['bg-white/10']: !disabled,
              ['bg-white/5']: disabled,
            })}
          />
          <div className="flex items-center justify-between w-full h-6 gap-2 text-white/60 text-sm px-1 z-10">
            {title}
          </div>

          <div className="flex gap-1 items-center z-10">

            {labels}

            <div className="flex items-center">
              {dropdown?.hidden !== true &&
                <Dropdown
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                  items={dropdown?.items || []}
                  className="w-8 min-w-8 h-8 items-center"
                  onSelect={(id) => {
                    if (dropdown?.onSelect) {
                      dropdown?.onSelect(id)
                    }
                  }}
                >
                  <SVGThreeDots
                    width={24}
                    height={24}
                  />
                </Dropdown>
              }

              {controls}
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </FolderFrame>
  )
}
