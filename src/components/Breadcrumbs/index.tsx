import SVGRightArrow from '@public/svg/rightarrow.svg'
import React, { Fragment } from 'react'
import Link from 'next/link'

export type BreadcrumbItem = {
  name?: string | null | undefined,
  href?: string | null | undefined,
  id: number
}

export default function Breadcrumbs({ process = false, items }: { process?: boolean, items: BreadcrumbItem[] }) {
  const lastIndex = items.findLastIndex(() => true)
  return (
    <div className="flex items-center text-gray-400 font-semibold gap-1 w-full overflow-hidden">
      {items.map((item, index) => {
        if (process) {
          return (
            <div
              key={item.id}
              className="animate-pulse flex gap-1"
            >
              <div className="h-4 w-16 bg-slate-700"/>
              {lastIndex !== index &&
                <div className="h-4 w-4 bg-slate-700"/>
              }
            </div>
          )
        }
        if (items[index + 1] === undefined) {
          return (
            <div
              key={item.id}
              title={item.name || 'unknown'}
              className="w-full max-w-full overflow-hidden"
            >
              <div className="flex items-center text-gray-600">
                <span
                  className="truncate ..."
                >
                  {item.name}
                </span>
              </div>
            </div>
          )
        }

        return (
          <Fragment key={item.id}>
            {item.href &&
              <div
                className="max-w-20"
              >
                <Link
                  href={item.href}
                  title={item.name || ''}
                  className="flex items-center text-gray-400 hover:text-gray-500 overflow-hidden"
                >
                  <span className="truncate ...">{item.name}</span>
                </Link>
              </div>
            }

            {!item.href &&
              <div
                className="max-w-20"
              >
                <div className="flex items-center text-gray-600 overflow-hidden">
                  <span
                    title={item.name || ''}
                    className="truncate ..."
                  >
                    {item.name}
                  </span>
                </div>
              </div>
            }

            <SVGRightArrow
              width={24}
              height={24}
              className="text-gray-500 rotate-180 min-w-[24px] min-h-[24px]"
            />
          </Fragment>
        )
      })}
    </div>
  )
}
