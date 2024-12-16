import FolderCart, {DropDownProps} from '@components/FolderCart'
import { ClientFolderData } from '@entities/ClientFolder'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import ButtonSquare from '@components/ButtonSquare'
import SVGFileNew from '@public/svg/file_new.svg'
import Divide from '@components/Divide'
import Input from '@components/Input'
import {ReactNode} from 'react'
import clsx from 'clsx'

export default function Folder(
  {
    data,
    title,
    labels,
    achievement,
    dropdown,
    className,
    edit = false,
    process = false,
    collapsed = true,
    onCollapse,
    onSave,
    onExit,
    onOpen,
    onChange,
    children
  }:
  {
    edit?: boolean,
    title: ReactNode,
    process?: boolean,
    collapsed?: boolean,
    className?: string
    labels?: ReactNode,
    achievement?: ReactNode,
    dropdown?: DropDownProps,
    data: ClientFolderData,
    onOpen: () => void,
    onSave: () => void,
    onExit: () => void,
    onChange: (prop: string, value: string) => void,
    onCollapse?: () => void,
    children?: ReactNode,
  }
) {
  return (
    <FolderCart
      hover={false}
      title={title}
      labels={labels}
      process={process}
      dropdown={dropdown}
      className={className}
    >
      {achievement &&
        <div className="w-full px-2 mt-2">
          {achievement}
        </div>
      }
      <div className="w-full font-bold text-gray-400 text-sm overflow-hidden flex items-center min-h-8 mt-3">
        {edit &&
          <Input
            autoFocus
            type="text"
            name="name"
            onBlur={onSave}
            autoComplete="off"
            className="z-10 w-full"
            placeholder="Module name"
            defaultValue={data.name || ''}
            onChange={(e) => {
              onChange('name', e.target.value)
            }}
            onKeyUp={(e) => {
              switch (e.keyCode) {
                case 13:
                  onSave()
                  break
                case 27:
                  onExit()
                  break
              }
            }}
          />
        }

        {!edit &&
          <div className="flex gap-2 items-center justify-between w-full">
            <div className="pt-[1px] mx-[9px] max-w-full truncate ...">
              <span className="max-w-full">
                {data.name || <span className="italic">(No name)</span>}
              </span>
            </div>

            <ButtonSquare
              bordered
              size={20}
              icon={SVGFileNew}
              onClick={onOpen}
            />
          </div>
        }
      </div>

      <div className="relative flex items-center justify-center w-full h-[28px] my-2">
        <Divide
          className="absolute left-0 top-[13px] divide-white/15 w-full"
        />
        <div
          className={clsx('rounded-full px-4 z-10', {
            ['flex gap-1 items-center justify-center']: true,
            ['h-[28px]']: true,
            ['text-white/50 border border-white/25 bg-black']: true,
            ['hover:border-white/35 active:border-white/25 cursor-pointer']: true,
            ['transition-all']: true
          })}
          onClick={onCollapse}
        >
          <SVGArrowDown
            width={20}
            height={20}
            className={clsx('transition-all text-white/50 hover:text-white/50', {
              ['rotate-180']: !collapsed
            })}
          />

          collapse
        </div>
      </div>

      {children}
    </FolderCart>
  )
}
