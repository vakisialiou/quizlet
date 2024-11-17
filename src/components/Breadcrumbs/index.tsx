import SVGRightArrow from '@public/svg/rightarrow.svg'
import { Fragment } from 'react'
import Link from 'next/link'

export type BreadcrumbItem = {
  name?: string | null | undefined,
  href?: string
  id: number
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex items-center text-gray-400 font-semibold gap-1 w-full overflow-hidden">
      {items.map((item, index) => {
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
                  {item.name || 'unknown'}
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
                  title={item.name || 'unknown'}
                  className="flex items-center text-gray-400 hover:text-gray-500 overflow-hidden"
                >
                  <span className="truncate ...">{item.name || 'unknown'}</span>
                </Link>
              </div>
            }

            {!item.href &&
              <div
                className="max-w-20"
              >
                <div className="flex items-center text-gray-600 overflow-hidden">
                  <span
                    title={item.name || 'unknown'}
                    className="truncate ..."
                  >
                    {item.name || 'unknown'}
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
