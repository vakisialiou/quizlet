import { actionUpdateSettings } from '@store/action-main'
import { useMainSelector } from '@hooks/useMainSelector'
import SVGOrderDesc from '@public/svg/tria_down.svg'
import SVGOrderAsc from '@public/svg/tria_up.svg'
import { MarkersEnum } from '@entities/Marker'
import { useTranslations } from 'next-intl'
import { OrderEnum } from '@helper/sort'
import Filter from '@components/Filter'
import React from 'react'

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
    <Filter
      className={className}
      selectedFilterId={settings.modules.filter.marker || 'none'}
      filters={[
        {id: 'none', name: tl('all')},
        {id: MarkersEnum.focus, name: tl('focus')},
        {id: MarkersEnum.active, name: tl('active')},
        {id: MarkersEnum.important, name: tl('important')}
      ]}
      onFilterSelect={(id) => {
        const marker = (id !== 'none' ? id: null) as MarkersEnum
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
      selectedOrderId={settings.modules.order}
      orders={[
        {id: OrderEnum.dateAsc, name: to('date'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.dateDesc, name: to('date'), icon: SVGOrderDesc, asc: false},
        {id: OrderEnum.nameAsc, name: to('name'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.nameDesc, name: to('name'), icon: SVGOrderDesc, asc: false},
        {id: OrderEnum.customAsc, name: to('custom'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.customDesc, name: to('custom'), icon: SVGOrderDesc, asc: false},
      ]}
      onOrderSelect={(order) => {
        actionUpdateSettings({
          editable,
          settings: {
            ...settings,
            modules: { ...settings.modules, order: order as OrderEnum }
          }
        })
      }}
    />
  )
}
