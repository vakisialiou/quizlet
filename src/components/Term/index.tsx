import { useCallback, useEffect, useRef } from 'react'
import { ClientTermType } from '@entities/ClientTerm'
import SVGThreeDots from '@public/svg/three_dots.svg'
import Dropdown from '@components/Dropdown'
import Spinner from '@components/Spinner'
import clsx from 'clsx'

export default function Term(
  { data, edit = false, process = false, onEdit, onRemove, onExit, onChange }:
  { data: ClientTermType, edit: boolean, process: boolean, onEdit: () => void, onRemove: () => void, onExit: () => void, onChange: (prop: string, value: string) => void }
) {

  const ref = useRef<HTMLDivElement | null>(null)

  const finishEdit = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLDivElement)) {
      onExit()
    }
  }, [data])

  useEffect(() => {
    if (edit) {
      document.addEventListener('mousedown', finishEdit)
    } else {
      document.removeEventListener('mousedown', finishEdit)
    }
    return () => {
      document.removeEventListener('mousedown', finishEdit)
    }
  }, [edit, data])

  return (
    <div
      ref={ref}
      className={clsx('transition-colors border border-gray-500 rounded w-full bg-gray-900 flex flex-col gap-2 p-4 select-none')}
      onClick={(e) => {
        if (edit) {
          e.preventDefault()
        }
      }}
    >
      <div className="flex justify-between w-full gap-2">
        {!edit &&
          <>
            <div
              className="flex items-center px-1 h-6 transition-colors font-semibold text-sm truncate ..."
            >
              {data.question || <span className="text-gray-500">(Not set)</span>}
            </div>

            <div className="flex gap-2 items-center">

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
            className="transition-colors w-full"
          >
            <input
              autoFocus
              type="text"
              name="question"
              autoComplete="off"
              placeholder="Question"
              defaultValue={data.question}
              className="block w-full bg-gray-800 text-gray-300 px-1 py-0 placeholder:text-gray-500 sm:text-sm sm:leading-6 outline-none outline-1 focus:outline-blue-500 font-semibold text-sm"
              onChange={(e) => {
                onChange('question', e.target.value)
              }}
              onKeyUp={(e) => {
                if ([27, 13].includes(e.keyCode)) {
                  onExit()
                }
              }}
            />
          </div>
        }
      </div>

      <div className="flex justify-between w-full gap-2">
        {!edit &&
          <>
            <div
              className="flex items-center px-1 h-6 transition-colors font-semibold text-sm truncate ..."
            >
              {data.answer || <span className="text-gray-500 text-xs">(Not set)</span>}
            </div>
          </>
        }

        {edit &&
          <div
            className="transition-colors w-full"
          >
            <input
              type="text"
              name="answer"
              autoComplete="off"
              placeholder="Answer"
              defaultValue={data.answer}
              className="block w-full bg-gray-800 text-gray-300 px-1 py-0 placeholder:text-gray-500 sm:text-sm sm:leading-6 outline-none outline-1 focus:outline-blue-500 font-semibold text-sm"
              onChange={(e) => {
                onChange('answer', e.target.value)
              }}
              onKeyUp={(e) => {
                if ([27, 13].includes(e.keyCode)) {
                  onExit()
                }
              }}
            />
          </div>
        }
      </div>

    </div>
  )
}
