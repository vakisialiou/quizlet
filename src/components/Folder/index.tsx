import Dropdown, { DropdownItemType } from '@components/Dropdown'
import { ClientFolderData } from '@entities/ClientFolder'
import SVGThreeDots from '@public/svg/three_dots.svg'
import SVGPlay from '@public/svg/play.svg'
import Spinner from '@components/Spinner'
import { ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

export default function Folder(
  {
    data,
    edit = false,
    process = false,
    label,
    playHref,
    editHref,
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
    label: ReactNode,
    playHref: string,
    editHref: string,
    onSave: () => void,
    onExit: () => void,
    onChange: (prop: string, value: string) => void,
    dropdownItems: DropdownItemType[],
    onDropdownSelect: (id: string | number) => void,
  }
) {
  return (
    <div
      className={clsx('border border-gray-500 w-full bg-gray-900 flex justify-between select-none overflow-hidden')}
    >
      {!edit &&
        <>
          <Link
            href={playHref}
            className={clsx('h-full w-14 min-w-14 md:w-16 md:min-w-16 flex justify-center items-center group', {
              ['hover:border-gray-600']: !edit,
              ['hover:cursor-pointer']: !edit,
            })}
            onClick={(e) => {
              if (edit) {
                e.preventDefault()
              }
            }}
          >
            <SVGPlay
              width={24}
              height={24}
              className="text-gray-100 group-hover:text-gray-400"
            />
          </Link>
          <div className="divide-x divide-gray-500 h-full flex">
            <div className="h-full"></div>
            <div className="h-full"></div>
          </div>
        </>
      }
      <Link
        href={editHref}
        className={clsx('group w-full flex justify-between gap-1 p-3 md:p-4 overflow-hidden', {
          ['hover:border-gray-600']: !edit,
          ['hover:cursor-pointer']: !edit,
        })}
        onClick={(e) => {
          if (edit) {
            e.preventDefault()
          }
        }}
      >
        {!edit &&
          <>
            <div className="flex items-center w-full max-w-full overflow-hidden">
              <div
                title={data.name || ''}
                className="px-1 content-center group-hover:text-gray-400 group-active:text-gray-400 font-semibold text-sm truncate ..."
              >
                {data.name}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              {label &&
                <div className="flex gap-2">
                  {label}
                </div>
              }

              <div className="flex gap-2">
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
                      <Spinner/>
                    </div>
                  }
                </Dropdown>

              </div>
            </div>
          </>
        }

        {edit &&
          <div
            className="group group-hover:text-gray-400 group-active:text-gray-400 w-full"
          >
            <input
              autoFocus
              type="text"
              name="name"
              autoComplete="off"
              placeholder="Folder name"
              defaultValue={data.name || ''}
              className="block w-full bg-gray-800 text-gray-300 h-6 px-1 py-0 placeholder:text-gray-500 sm:text-sm sm:leading-6 outline outline-1 focus:outline-blue-500 font-semibold text-sm"
              onBlur={onSave}
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
      </Link>
    </div>
  )
}
