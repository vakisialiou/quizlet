import Dropdown, { DropdownItemType } from '@components/Dropdown'
import { ClientFolderData } from '@entities/ClientFolder'
import SVGThreeDots from '@public/svg/three_dots.svg'
import SVGFolder from '@public/svg/file_folder.svg'
import SVGPlay from '@public/svg/play.svg'
import Spinner from '@components/Spinner'
import Input from '@components/Input'
import { Link } from '@i18n/routing'
import { ReactNode } from 'react'
import clsx from 'clsx'

export default function Folder(
  {
    data,
    edit = false,
    process = false,
    number,
    labels,
    info,
    hrefPlay,
    hrefEdit,
    disablePlay = false,
    disableEdit = false,
    onSave,
    onExit,
    onChange,
    dropdownItems,
    onDropdownSelect
  }:
  {
    data: ClientFolderData,
    edit: boolean,
    process: boolean,
    labels?: ReactNode,
    info?: ReactNode,
    number: number,
    hrefPlay: string,
    hrefEdit: string,
    disablePlay?: boolean,
    disableEdit?: boolean,
    onSave: () => void,
    onExit: () => void,
    onChange: (prop: string, value: string) => void,
    dropdownItems: DropdownItemType[],
    onDropdownSelect: (id: string | number) => void,
  }
) {
  return (
    <div
      className={clsx('group border w-full rounded flex justify-between bg-black/50 select-none overflow-hidden transition-all', {
        ['border-gray-500 shadow-inner shadow-gray-500/50']: true,
        ['hover:border-gray-600']: !edit && !disableEdit,
      })}
    >
      <div
        className="flex"
      >
        <div
          className="w-20 min-w-20 h-full flex flex-col gap-2 p-2"
          onClick={(e) => {
            if (edit) {
              e.preventDefault()
            }
          }}
        >
          <div
            className="flex gap-1 items-center h-6 min-h-6 w-full text-sm font-bold text-gray-400 pointer-events-none"
          >
            <SVGFolder
              width={16}
              height={16}
              className="text-gray-400"
            />
            #{number}
          </div>

          <div className="flex items-center justify-center w-full h-full">
            <Link
              href={hrefPlay}
              className={clsx('flex gap-1 items-center justify-center h-6 w-full rounded-sm transition-all text-xs', {
                ['shadow-inner shadow-gray-300 bg-green-900 hover:shadow-gray-400/80 active:shadow-gray-400/50']: !edit && !disablePlay,
                ['pointer-events-none bg-gray-500/10']: edit || disablePlay,
              })}
            >
              <SVGPlay
                width={16}
                height={16}
                className={clsx('text-gray-200', {
                  ['text-gray-500/50']: edit || disablePlay,
                })}
              />
              Play
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-500 group-hover:divide-gray-600 h-full transition-all">
        <div className="w-[1px] h-full transition-all"/>
        <div className="w-[1px] h-full transition-all"/>
      </div>

      <Link
        href={hrefEdit}
        className={clsx('relative w-full min-w-0 flex flex-col justify-between gap-2 p-2', {

        })}
        onClick={(e) => {
          if (edit || disableEdit) {
            e.preventDefault()
          }
        }}
      >
        {(edit || disableEdit) &&
          <div className="absolute left-0 top-0 w-full h-full cursor-default"></div>
        }

        <div className="flex items-center justify-between min-w-0 w-full">
          <div
            title={data.name || ''}
            className="content-center transition-colors text-gray-400 font-semibold text-sm truncate ..."
          >
            {data.name}
          </div>

          <Dropdown
            onClick={(e) => {
              e.preventDefault()
            }}
            items={dropdownItems}
            onSelect={(id) => {
              onDropdownSelect(id)
            }}
          >
            {!process &&
              <SVGThreeDots
                width={24}
                height={24}
                className="text-gray-700"
              />
            }

            {process &&
              <div className="flex items-center justify-center w-6 h-6">
                <Spinner size={3} />
              </div>
            }
          </Dropdown>
        </div>

        {edit &&
          <Input
            autoFocus
            type="text"
            name="name"
            onBlur={onSave}
            className="z-10"
            autoComplete="off"
            placeholder="Folder name"
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
          <div className="w-full flex justify-between gap-1 overflow-hidden py-1">
            <div className="flex gap-2 items-center">
              {info}
            </div>
            <div className="flex gap-2 items-center">
              {labels}
            </div>
          </div>
        }
      </Link>
    </div>
)
}
