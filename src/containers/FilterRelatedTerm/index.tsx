import SVGOrderDesc from '@public/svg/tria_down.svg'
import { colors } from '@components/ColorDropdown'
import SVGOrderAsc from '@public/svg/tria_up.svg'
import ColorLabel from '@components/ColorLabel'
import { useTranslations } from 'next-intl'
import { OrderEnum } from '@helper/sort'
import Filter from '@components/Filter'
import React from 'react'

export default function FilterRelatedTerm(
  {
    className = '',
    onOrderSelect,
    onFilterSelect,
    selectedOrderId,
    selectedFilterId
  }:
    {
      className?: string
      selectedOrderId: string | number
      selectedFilterId?: string | number
      onOrderSelect: (id: string | number) => void
      onFilterSelect: (id: string | number) => void
    }
) {
  const tl = useTranslations('Labels')
  const to = useTranslations('Orders')

  return (
    <Filter
      className={className}
      selectedFilterId={selectedFilterId || -1}
      filters={[
        {id: -1, name: tl('all')},
        ...colors.map((color) => {
          return {
            id: color,
            name: (
              <ColorLabel
                key={color}
                color={color}
                className="w-20 h-3.5"
              />
            )
          }
        })
      ]}
      onFilterSelect={onFilterSelect}
      selectedOrderId={selectedOrderId}
      orders={[
        {id: OrderEnum.customAsc, name: to('custom'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.customDesc, name: to('custom'), icon: SVGOrderDesc, asc: false},
        {id: OrderEnum.colorAsc, name: to('color'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.colorDesc, name: to('color'), icon: SVGOrderDesc, asc: false},
        {id: OrderEnum.questionAsc, name: to('question'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.questionDesc, name: to('question'), icon: SVGOrderDesc, asc: false},
        {id: OrderEnum.answerAsc, name: to('answer'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.answerDesc, name: to('answer'), icon: SVGOrderDesc, asc: false},
      ]}
      onOrderSelect={onOrderSelect}
    />
  )

}
