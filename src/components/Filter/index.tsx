import React, { ComponentType, SVGProps, useMemo, ReactNode } from 'react'
import Dropdown, { DropdownPlacement } from '@components/Dropdown'
import SVGOrderDesc from '@public/svg/tria_down.svg'
import SVGOrderAsc from '@public/svg/tria_up.svg'
import SVGFilter from '@public/svg/filter.svg'
import clsx from 'clsx'

export type TypeFilterItem = {
  id: string | number
  name?: ReactNode | string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export type TypeOrderItem = {
  id: string | number
  asc: boolean
  name: ReactNode | string,
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export default function Filter(
  {
    className = '',
    filters = [],
    onFilterSelect,
    selectedFilterId,

    orders = [],
    onOrderSelect,
    selectedOrderId
  }:
  {
    className: string
    selectedFilterId?: string | number
    filters?: TypeFilterItem[],
    onFilterSelect?: (id: string | number) => void

    selectedOrderId?: string | number
    orders?: TypeOrderItem[],
    onOrderSelect?: (id: string | number) => void
  }
) {
  const selectedFilter = useMemo(() => {
    return filters.find(({ id }) => id === selectedFilterId)
  }, [filters, selectedFilterId])

  const selectedOrder = useMemo(() => {
    return orders.find(({ id }) => id === selectedOrderId)
  }, [orders, selectedOrderId])

  return (
    <div
      className={clsx('flex items-center justify-between gap-2 mb-4 mt-2', {
        [className]: className,
      })}
    >
      {filters.length === 0 &&
        <div></div>
      }

      {filters.length > 0 &&
        <Dropdown
          caret
          items={filters}
          onSelect={onFilterSelect}
          className="h-8 px-2 gap-1 text-sm"
          placement={DropdownPlacement.bottomStart}
          selected={selectedFilterId ? [selectedFilterId] : []}
        >
          <div className="flex gap-2 items-center">
            <SVGFilter
              width={18}
              height={18}
            />

            {selectedFilter?.name}
          </div>
        </Dropdown>
      }

      {orders.length === 0 &&
        <div></div>
      }

      {orders.length > 0 &&
        <Dropdown
          caret
          items={orders}
          onSelect={onOrderSelect}
          placement={DropdownPlacement.bottomEnd}
          selected={selectedOrderId ? [selectedOrderId] : []}
          className="h-8 px-2 gap-1 text-sm"
        >
          <div className="flex gap-2 items-center">
            {!selectedOrder?.asc &&
              <SVGOrderDesc
                width={18}
                height={18}
              />
            }

            {selectedOrder?.asc &&
              <SVGOrderAsc
                width={18}
                height={18}
              />
            }

            {selectedOrder?.name}
          </div>
        </Dropdown>
      }
    </div>
)
}
