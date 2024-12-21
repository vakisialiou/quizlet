import Dropdown, { DropdownItemType } from '@components/Dropdown'
import SVGThreeDots from '@public/svg/three_dots.svg'
import { BaseSyntheticEvent, ReactNode } from 'react'
import FolderFrame from '@components/FolderFrame'

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
    dropdown,
    children,
    className = '',
    onClickBody,
    controls
  }:
  {
    hover?: boolean
    title?: ReactNode,
    className?: string,
    labels?: ReactNode,
    children?: ReactNode,
    controls?: ReactNode,
    dropdown?: DropDownProps
    onClickBody?: (e: BaseSyntheticEvent) => void
  }
) {

  return (
    <FolderFrame
      hover={hover}
      className={className}
      onClickBody={onClickBody}
      head={(
        <div className="w-full flex items-center justify-between h-8 min-h-8 relative px-1">
          <div className="absolute left-0 top-0 w-full h-full pointer-events-none bg-white/15"/>
          <div className="flex items-center justify-between w-full h-6 gap-2 text-white/60 text-sm px-1">
            {title}
          </div>

          <div className="flex gap-2 items-center">

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
