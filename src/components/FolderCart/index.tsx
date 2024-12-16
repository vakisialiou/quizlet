import Dropdown, { DropdownItemType } from '@components/Dropdown'
import SVGThreeDots from '@public/svg/three_dots.svg'
import FolderFrame from '@components/FolderFrame'
import Spinner from '@components/Spinner'
import {BaseSyntheticEvent, ReactNode} from 'react'

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
    process = false,
    dropdown,
    children,
    className = '',
    onClickBody
  }:
  {
    hover?: boolean
    title?: ReactNode,
    process?: boolean,
    className?: string,
    labels?: ReactNode,
    children?: ReactNode,
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
            {process &&
              <div className="flex items-center justify-center w-6 h-6">
                <Spinner size={3}/>
              </div>
            }

            {labels}

            {dropdown?.hidden !== true &&
              <Dropdown
                onClick={(e) => {
                  e.preventDefault()
                }}
                items={dropdown?.items || []}
                onSelect={(id) => {
                  if (dropdown?.onSelect) {
                    dropdown?.onSelect(id)
                  }
                }}
              >
                <SVGThreeDots
                  width={24}
                  height={24}
                  className="text-gray-500"
                />
              </Dropdown>
            }
          </div>
        </div>
      )}
    >
      {children}
    </FolderFrame>
  )
}
