import { ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

export default function Folder(
  { name, edit = false, label, href, onEdit, onExit, onChange }:
  { name: string, edit: boolean, label: ReactNode, href: string, onEdit: () => void, onExit: () => void, onChange: (value: string) => void }
) {

  return (
    <Link
      href={href}
      data-attr="1"
      className={clsx('transition-colors group border border-gray-500 rounded w-full bg-gray-900 flex justify-between gap-2 p-4 select-none', {
        ['active:border-gray-700']: !edit,
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
            {name}
          </div>

          <div className="flex gap-2 items-center">
            {label &&
              <div className="flex gap-2">
                {label}
              </div>
            }

            <div className="flex gap-2">
              <div
                data-attr="2"
                className="border border-gray-400 bg-gray-500 w-5 h-5 rounded-full hover:bg-gray-600 active:bg-gray-700 transition-colors hover:cursor-pointer flex items-center justify-center select-none"
                onClick={(e) => {
                  e.preventDefault()
                  onEdit()
                }}
              >

              </div>
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
            id="name"
            name="name"
            type="text"
            defaultValue={name}
            autoComplete="off"
            placeholder="Folder name"
            className="block w-full bg-gray-800 text-gray-300 px-1 py-0 placeholder:text-gray-500 sm:text-sm sm:leading-6 outline outline-1 focus:outline-blue-500 font-semibold text-sm"
            onBlur={onExit}
            onChange={(e) => {
              onChange(e.target.value)
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
