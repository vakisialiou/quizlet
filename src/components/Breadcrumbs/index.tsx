import SVGRightArrow from '@public/svg/rightarrow.svg'
import React, { Fragment } from 'react'
import { Link } from '@i18n/routing'

export type BreadcrumbItem = {
  name?: string | null | undefined,
  href?: string | null | undefined,
  id: number
}

export default function Breadcrumbs({ process = false, items }: { process?: boolean, items: BreadcrumbItem[] }) {
  const lastIndex = items.findLastIndex(() => true)
  return (
    <div className="flex items-center h-12 text-white/50 font-medium text-sm gap-1 w-full overflow-hidden px-2">
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

        return (
          <Fragment key={item.id}>
            {item.href &&
              <div
                className="max-w-28"
              >
                <Link
                  href={item.href}
                  title={item.name || ''}
                  className="flex items-center hover:text-white/60 overflow-hidden"
                >
                  <span className="truncate ...">{item.name}</span>
                </Link>
              </div>
            }

            {!item.href &&
              <div
                className="max-w-28"
              >
                <div className="flex items-center text-white/25 overflow-hidden">
                  <span
                    title={item.name || ''}
                    className="truncate ..."
                  >
                    {item.name}
                  </span>
                </div>
              </div>
            }

            {lastIndex !== index &&
              <SVGRightArrow
                width={24}
                height={24}
                className="text-white/25 rotate-180 min-w-[24px] min-h-[24px]"
              />
            }
          </Fragment>
        )
      })}
    </div>
  )
}
