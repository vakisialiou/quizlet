import {CardStatus} from '@containers/Simulator/CardAggregator/types'
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
  id: string | null
  status: CardStatus
}

export default function PickCard(
  {
    className = '',
    onSelect,
    cardSide,
    value,
  }:
  {
    className?: string
    cardSide: CardSideInfo
    value: CardSelectedValue,
    onSelect: (selection: CardSelection) => void
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

          <div className="flex items-center text-base font-bold">
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
            className="w-full h-full flex flex-col justify-end divide-y divide-gray-800 divide-dashed">
            {cardSide.selections.map((selection) => {
              return (
                <label
                  key={selection.id}
                  className={clsx('h-12 flex gap-2 w-full items-center justify-between py-2 px-4 hover:bg-gray-500/30 cursor-pointer text-xs', {
                    ['bg-green-500/60 hover:bg-green-500/60']: value.status === CardStatus.error && selection.id === cardSide.answer.id,
                    ['bg-amber-500/50 hover:bg-amber-500/50']: value.status === CardStatus.error && selection.id === value.id,
                    ['bg-green-800 hover:bg-green-800']: value.status === CardStatus.success && selection.id === value.id,
                    ['pointer-events-none']: [CardStatus.success, CardStatus.error].includes(value.status)
                  })}
                >
                  <div className="line-clamp-2">
                    {selection.text}
                  </div>

                  <input
                    type="radio"
                    name="method"
                    className="h-4 w-4 min-w-4"
                    checked={value.id === selection.id}
                    onChange={() => {
                      if (value.status === CardStatus.none) {
                        onSelect(selection)
                      }
                    }}
                  />
                </label>
              )
            })}
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
