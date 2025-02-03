import {
  CardSide,
  CardStatus,
  SoundType,
  SelectionType
} from '@containers/Simulator/CardAggregator/types'
import Signature from '@containers/Simulator/CardAggregator/Signature'
import CardError from '@containers/Simulator/CardAggregator/CardError'
import CardText from '@containers/Simulator/CardAggregator/CardText'
import SVGMuteOff from '@public/svg/mute_ipo_off.svg'
import SVGMuteOn from '@public/svg/mute_ipo_on.svg'
import ButtonSquare from '@components/ButtonSquare'
import {TermData} from '@entities/Term'
import clsx from 'clsx'

export default function PickCard(
  {
    term,
    sound,
    onSound,
    onSelect,
    inverted,
    selected,
    signature,
    selections,
    className = '',
  }:
  {
    term: TermData
    inverted: boolean
    className?: string
    selections: TermData[],
    sound: SoundType | null
    signature: string | null,
    selected: SelectionType,
    onSound: (value: SoundType) => void
    onSelect: (value: TermData) => void
  }
) {
  const titleSide = inverted ? CardSide.front : CardSide.back
  const variantSide = inverted ? CardSide.back : CardSide.front
  return (
    <div
      className={clsx('select-none', {
        [className]: className
      })}
    >
      <div
        className={clsx('relative w-full h-full transition-colors rounded border border-gray-500/50 bg-gray-500/10 shadow-inner shadow-gray-500/20')}
      >
        <div className="absolute w-full h-full gap-2 flex flex-col items-center justify-center p-4 rounded">
          <CardText
            term={term}
            className="mt-6"
            inverted={inverted}
          />

          <CardError
            className="py-2"
            status={selected.status}
          />

          <div
            className="w-full h-full flex flex-col justify-end divide-y divide-gray-800 divide-dashed">
            {selections.map((selection) => {
              return (
                <div
                  key={selection.id}
                  className="flex gap-1 items-center h-12"
                >
                  <ButtonSquare
                    onClick={() => onSound({ term: selection, side: titleSide })}
                    icon={(sound?.term?.id === selection.id && sound.side === titleSide) ? SVGMuteOn : SVGMuteOff}
                  />

                  <label
                    className={clsx('h-full flex gap-2 w-full items-center justify-between px-2 hover:bg-gray-500/30 cursor-pointer text-base', {
                      ['bg-green-500/60 hover:bg-green-500/60']: selected.status === CardStatus.error && selection.id === term.id,
                      ['bg-amber-500/50 hover:bg-amber-500/50']: selected.status === CardStatus.error && selection.id === selected.term?.id,
                      ['bg-green-800 hover:bg-green-800']: selected.status === CardStatus.success && selection.id === selected.term?.id,
                      ['pointer-events-none']: selected.status && [CardStatus.success, CardStatus.error].includes(selected.status)
                    })}
                    onClick={() => {
                      if (selected.status === CardStatus.none) {
                        onSelect(selection)
                      }
                    }}
                  >
                    <div className="line-clamp-2 text-sm">
                      {inverted ? selection.question : selection.answer}
                    </div>
                  </label>
                </div>
              )
            })}
          </div>

          <Signature
            signature={signature}
            className="absolute left-0 top-0"
          >
            <ButtonSquare
              onClick={() => onSound({ term, side: variantSide })}
              icon={(sound?.term?.id === term.id && sound.side === variantSide) ? SVGMuteOn : SVGMuteOff}
            />
          </Signature>
        </div>
      </div>
    </div>
  )
}
