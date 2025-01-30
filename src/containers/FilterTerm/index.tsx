import SVGOrderDesc from '@public/svg/tria_down.svg'
import SVGOrderAsc from '@public/svg/tria_up.svg'
import { useTranslations } from 'next-intl'
import { OrderEnum } from '@helper/sort'
import Filter from '@components/Filter'
import React from 'react'

export default function FilterTerm(
  {
    className = '',
    onOrderSelect,
    selectedOrderId,
  }:
  {
    className?: string
    selectedOrderId: string | number
    onOrderSelect: (id: string | number) => void
  }
) {
  const to = useTranslations('Orders')

  return (
    <Filter
      className={className}
      selectedOrderId={selectedOrderId}
      orders={[
        {id: OrderEnum.customAsc, name: to('custom'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.customDesc, name: to('custom'), icon: SVGOrderDesc, asc: false},
        {id: OrderEnum.questionAsc, name: to('question'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.questionDesc, name: to('question'), icon: SVGOrderDesc, asc: false},
        {id: OrderEnum.answerAsc, name: to('answer'), icon: SVGOrderAsc, asc: true},
        {id: OrderEnum.answerDesc, name: to('answer'), icon: SVGOrderDesc, asc: false},
      ]}
      onOrderSelect={onOrderSelect}
    />
  )

}
