import { ClientFolderType } from '@entities/ClientFolder'
import SVGThreeDots from '@public/svg/three_dots.svg'
import Dropdown from '@components/Dropdown'
import Spinner from '@components/Spinner'
import { ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

export default function Folder(
  { data, edit = false, process = false, label, href, onEdit, onRemove, onExit, onChange }:
  { data: ClientFolderType, edit: boolean, process: boolean, label: ReactNode, href: string, onEdit: () => void, onRemove: () => void, onExit: () => void, onChange: (prop: string, value: string) => void }
) {
  return (
    <Link
      href={href}
      className={clsx('transition-colors group border border-gray-500 rounded w-full bg-gray-900 flex justify-between gap-2 p-4 select-none', {
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
          <div
            className="flex items-center px-1 transition-colors group group-hover:text-gray-400 group-active:text-gray-400 font-semibold text-sm truncate ..."
          >
            {data.name}
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
                items={[
                  {id: 1, name: 'Edit'},
                  {id: 2, name: 'Remove'},
                ]}
                onSelect={(id) => {
                  switch (id) {
                    case 1:
                      onEdit()
                      break
                    case 2:
                      onRemove()
                      break
                  }
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
          className="transition-colors group group-hover:text-gray-400 group-active:text-gray-400 w-full"
        >
          <input
            autoFocus
            type="text"
            name="name"
            autoComplete="off"
            defaultValue={data.name}
            placeholder="Folder name"
            className="block w-full bg-gray-800 text-gray-300 px-1 py-0 placeholder:text-gray-500 sm:text-sm sm:leading-6 outline outline-1 focus:outline-blue-500 font-semibold text-sm"
            onBlur={onExit}
            onChange={(e) => {
              onChange('name', e.target.value)
            }}
            onKeyUp={(e) => {
              if ([27, 13].includes(e.keyCode)) {
                onExit()
              }
            }}
          />
        </div>
      }

    </Link>
  )
}
