import {CardStatus} from '@containers/Simulator/CardAggregator/types'
import Button, { ButtonSkin } from '@components/Button'
import Input, { InputSize } from '@components/Input'
import { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'

export type CardSelection = {
  id: string,
  lang: string,
  text: string
}

export type CardSideInfo = {
  answer: CardSelection,
  question: CardSelection
  signature: string | null,
  selections: CardSelection[]
}

export type CardSelectedValue = {
  text: string
  status: CardStatus
}

export default function InputCard(
  {
    className = '',
    onSubmit,
    onChange,
    cardSide,
    value,
  }:
  {
    className?: string
    cardSide: CardSideInfo
    value: CardSelectedValue,
    onChange: (e: BaseSyntheticEvent) => void
    onSubmit: (e: BaseSyntheticEvent) => void
  }
) {
  return (
    <div
      className={clsx('group select-none', {
        [className]: className
      })}
    >
      <div
        className={clsx('relative w-full h-full transition-colors rounded border border-gray-500/50 bg-gray-500/10 shadow-inner shadow-gray-500/20')}
      >
        <div className="absolute w-full h-full flex flex-col gap-2 items-center justify-center p-6 rounded">
          <div className="flex items-center h-12 min-h-12 mt-4">
            <div
              className="text-gray-500 text-lg text-center font-bold line-clamp-2"
            >
              {cardSide.question.text}
            </div>
          </div>

          <div className="flex items-center h-8 min-h-8 text-base font-bold">
            {value.status === CardStatus.success &&
              <div className="text-green-800">
                Success
              </div>
            }

            {value.status === CardStatus.error &&
              <div className="text-amber-600">
                Error
              </div>
            }
          </div>

          <div
            className="w-full h-full flex flex-col justify-center divide-y divide-gray-800 divide-dashed"
          >

            <div className="flex flex-col gap-4">
              <Input
                rounded
                autoFocus={true}
                value={value.text}
                onChange={onChange}
                size={InputSize.h10}
              />
              <Button
                onClick={onSubmit}
                skin={ButtonSkin.WHITE}
                disabled={!value.text || [CardStatus.success, CardStatus.error].includes(value.status)}
              >
                Approve
              </Button>
            </div>

          </div>

          {cardSide.signature &&
            <div className="absolute left-3 top-3 text-gray-700/50 uppercase font-bold text-[10px]">
              {cardSide.signature}
            </div>
          }
        </div>
      </div>
    </div>
  )
}
