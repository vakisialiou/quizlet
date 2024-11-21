import Breadcrumbs, { BreadcrumbItem } from '@components/Breadcrumbs'
import { ReactNode } from 'react'

export default function HeaderPage({ process = false, breadcrumbs, children }: { process?: boolean, breadcrumbs: BreadcrumbItem[], children?: ReactNode }) {
  return (
    <div className="w-full flex gap-2 items-center justify-between h-8 px-2 md:px-4">
      <Breadcrumbs process={process} items={breadcrumbs} />

      {children &&
        <div className="flex gap-2 items-center">
          {children}
        </div>
      }
    </div>
  )
}
