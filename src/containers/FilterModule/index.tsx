import Dropdown, { DropdownPlacement } from '@components/Dropdown'
import { actionUpdateSettings } from '@store/action-main'
import { useMainSelector } from '@hooks/useMainSelector'
import SVGOrderDesc from '@public/svg/tria_down.svg'
import { ModuleMarkersEnum } from '@entities/Module'
import SVGOrderAsc from '@public/svg/tria_up.svg'
import { OrderEnum } from '@helper/sort-modules'
import SVGFilter from '@public/svg/filter.svg'
import { useTranslations } from 'next-intl'
import React from 'react'
import clsx from 'clsx'

export default function FilterModule(
  {
    editable,
    className = ''
  }:
  {
    editable: boolean,
    className: string
  }
) {
  const tl = useTranslations('Labels')
  const to = useTranslations('Orders')
  const settings = useMainSelector(({ settings }) => settings)

  return (
    <div
      className={clsx('flex items-center justify-between gap-2 mb-4 mt-2', {
        [className]: className,
      })}
    >
      <Dropdown
        caret
        className="h-8 px-2 gap-1 text-sm"
        placement={DropdownPlacement.bottomStart}
        selected={[settings.modules.filter.marker || 'none']}
        items={[
          {id: 'none', name: tl('all')},
          {id: ModuleMarkersEnum.focus, name: tl('focus')},
          {id: ModuleMarkersEnum.active, name: tl('active')},
          {id: ModuleMarkersEnum.important, name: tl('important')}
        ]}
        onSelect={(id) => {
          const marker = (id !== 'none' ? id: null) as ModuleMarkersEnum
          actionUpdateSettings({
            editable,
            settings: {
              ...settings,
              modules: {
                ...settings.modules,
                filter: { ...settings.modules.filter, marker }
              }
            }
          })
        }}
      >
        <SVGFilter
          width={18}
          height={18}
        />

        {settings.modules.filter.marker === null &&
          tl('all')
        }
        {settings.modules.filter.marker === ModuleMarkersEnum.focus &&
          tl('focus')
        }
        {settings.modules.filter.marker === ModuleMarkersEnum.active &&
          tl('active')
        }
        {settings.modules.filter.marker === ModuleMarkersEnum.important &&
          tl('important')
        }
      </Dropdown>

      <Dropdown
        caret
        selected={[settings.modules.order]}
        className="h-8 px-2 gap-1 text-sm"
        placement={DropdownPlacement.bottomEnd}
        items={[
          {id: OrderEnum.dateAsc, name: to('date'), icon: SVGOrderAsc},
          {id: OrderEnum.dateDesc, name: to('date'), icon: SVGOrderDesc},
          {id: OrderEnum.nameAsc, name: to('name'), icon: SVGOrderAsc},
          {id: OrderEnum.nameDesc, name: to('name'), icon: SVGOrderDesc},
          {id: OrderEnum.customAsc, name: to('custom'), icon: SVGOrderAsc},
          {id: OrderEnum.customDesc, name: to('custom'), icon: SVGOrderDesc},
        ]}
        onSelect={(order) => {
          actionUpdateSettings({
            editable,
            settings: {
              ...settings,
              modules: { ...settings.modules, order: order as OrderEnum }
            }
          })
        }}
      >
        {[OrderEnum.nameDesc, OrderEnum.customDesc, OrderEnum.dateDesc].includes(settings.modules.order) &&
          <SVGOrderDesc
            width={18}
            height={18}
          />
        }

        {[OrderEnum.nameAsc, OrderEnum.customAsc, OrderEnum.dateAsc].includes(settings.modules.order) &&
          <SVGOrderAsc
            width={18}
            height={18}
          />
        }

        {[OrderEnum.nameAsc, OrderEnum.nameDesc].includes(settings.modules.order) &&
          to('name')
        }
        {[OrderEnum.customAsc, OrderEnum.customDesc].includes(settings.modules.order) &&
          to('custom')
        }
        {[OrderEnum.dateAsc, OrderEnum.dateDesc].includes(settings.modules.order) &&
          to('date')
        }
      </Dropdown>

    </div>
  )
}
