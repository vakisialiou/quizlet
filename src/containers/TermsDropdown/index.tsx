import Dropdown, { DropdownPlacement } from '@components/Dropdown'
import TermsDropdownMenu from '@containers/TermsDropdownMenu'
import SVGFileNew from '@public/svg/file_new.svg'
import {TermData} from '@entities/Term'
import {ReactNode, useRef} from 'react'

export default function TermsDropdown(
  {
    onCreate,
    onSelect,
    children,
    moduleId,
    excludeTermIds,
    placement = DropdownPlacement.bottomEnd,
  }:
  {
    moduleId?: string
    onCreate: () => void
    onSelect: (term: TermData) => void
    excludeTermIds: string[]
    children?: ReactNode
    placement?: DropdownPlacement
  }
) {
  const ref = useRef<{ close?: () => void }>({})
  return (
    <Dropdown
      caret
      ref={ref}
      placement={placement}
      className="px-1 min-w-8 h-8 items-center gap-1"
      menu={(
        <TermsDropdownMenu
          className="w-56"
          onClick={onSelect}
          moduleId={moduleId}
          excludeTermIds={excludeTermIds}
          onCreate={() => {
            if (ref.current.close) {
              ref.current.close()
            }
            onCreate()
          }}
        />
      )}
    >
      <SVGFileNew
        width={18}
        height={18}
      />

      {children}
    </Dropdown>
  )
}
