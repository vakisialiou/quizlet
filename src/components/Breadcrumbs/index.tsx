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
    <div className="flex items-center text-gray-400 font-semibold gap-1">
      {items.map((item, index) => {
        if (items[index + 1] === undefined) {
          return (
            <span
              key={item.id}
              className="text-gray-600"
            >
              {item.name || 'unknown'}
            </span>
          )
        }

        return (
          <Fragment key={item.id}>
            {item.href &&
              <Link href={item.href} className="flex items-center text-gray-400 hover:text-gray-500">
                <span>{item.name || 'unknown'}</span>
              </Link>
            }

            {!item.href &&
              <span>{item.name || 'unknown'}</span>
            }

            <SVGRightArrow
              width={24}
              height={24}
              className="text-gray-600 rotate-180"
            />
          </Fragment>
        )
      })}
    </div>
  )
}
