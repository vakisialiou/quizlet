import Dropdown, { DropdownItemType } from '@components/Dropdown'
import { ClientFolderData } from '@entities/ClientFolder'
import SVGThreeDots from '@public/svg/three_dots.svg'
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
    achievements,
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
    achievements?: ReactNode,
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
      className={clsx('border w-full rounded flex justify-between border-gray-500 bg-gray-900/50 select-none overflow-hidden', {
        ['border-gray-500 shadow-inner shadow-gray-500/50']: true,
      })}
    >
      <div className="flex">
        <div
          className="w-20 min-w-20 h-full flex flex-col p-2"
          onClick={(e) => {
            if (edit) {
              e.preventDefault()
            }
          }}
        >
          <div
            className="flex items-center h-6 min-h-6 w-full text-xs text-gray-500/90 pointer-events-none">
            #{number}
          </div>

          <div className="flex items-center justify-center w-full h-full">
            <Link
              href={hrefPlay}
              className={clsx('flex items-center justify-center w-12 h-12 rounded-full transition-all', {
                ['shadow-inner shadow-gray-300 bg-green-900 hover:shadow-gray-400/80 active:shadow-gray-400/50']: !edit && !disablePlay,
                ['pointer-events-none bg-gray-500/10']: edit || disablePlay,
              })}
            >
              <SVGPlay
                width={24}
                height={24}
                className={clsx('text-gray-200', {
                  ['text-gray-500/50']: edit || disablePlay,
                })}
              />
            </Link>
          </div>
        </div>
      </div>

      <Link
        href={hrefEdit}
        className={clsx('relative group w-full min-w-0 flex flex-col justify-between gap-2 p-2', {
          ['hover:border-gray-600']: !edit && !disableEdit,
          ['hover:cursor-pointer']: !edit && !disableEdit,
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

        <div className="flex items-center justify-between w-full">
          {achievements}

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

        <div className="w-full flex justify-between gap-1 overflow-hidden z-10">
          {!edit &&
            <div className="flex items-center w-full max-w-full overflow-hidden">
              <div
                title={data.name || ''}
                className="content-center transition-colors text-gray-400 group-hover:text-gray-500 group-active:text-gray-600 font-semibold text-sm truncate ..."
              >
                {data.name}
              </div>
            </div>
          }

          {edit &&
            <div
              className="group group-hover:text-gray-400 group-active:text-gray-400 w-full flex flex-col"
            >
              <label className="font-semibold text-sm text-gray-600">Enter folder name: </label>
              <Input
                autoFocus
                type="text"
                name="name"
                onBlur={onSave}
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
            </div>
          }
        </div>

        {!edit &&
          <div className="w-full flex justify-between gap-1 overflow-hidden">
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
