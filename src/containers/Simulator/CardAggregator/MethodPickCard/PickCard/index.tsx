import {
  CardSide,
  CardStatus,
  SelectionType,
  SoundType
} from '@containers/Simulator/CardAggregator/types'
import Signature from '@containers/Simulator/CardAggregator/Signature'
import CardError from '@containers/Simulator/CardAggregator/CardError'
import Button, { ButtonSize, ButtonVariant } from '@components/Button'
import CardText from '@containers/Simulator/CardAggregator/CardText'
import SVGMuteOff from '@public/svg/mute_ipo_off.svg'
import SVGMuteOn from '@public/svg/mute_ipo_on.svg'
import ButtonSquare, {ButtonSquareSize} from '@components/ButtonSquare'
import { TermData } from '@entities/Term'
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
        <div className="absolute w-full h-full gap-1 flex flex-col items-center justify-center p-4 rounded">
          <CardText
            term={term}
            className="mt-6"
            inverted={inverted}
          />

          <CardError
            term={term}
            className="mt-2"
            inverted={inverted}
            status={selected.status}
          />

          <div
            className="w-full h-full flex flex-col justify-end divide-y divide-gray-800 divide-dashed">
            {selections.map((selection) => {
              return (
                <div
                  key={selection.id}
                  className="flex gap-2 items-center h-12"
                >
                  <ButtonSquare
                    shadow
                    // rounded
                    iconSize={20}
                    size={ButtonSquareSize.h10}
                    onClick={() => onSound({ term: selection, side: titleSide })}
                    icon={(sound?.term?.id === selection.id && sound.side === titleSide) ? SVGMuteOn : SVGMuteOff}
                  />

                  <Button
                    border={false}
                    rounded={false}
                    className="w-full"
                    size={ButtonSize.H10}
                    variant={ButtonVariant.transparent}
                    disabled={[CardStatus.success, CardStatus.error].includes(selected.status)}
                    onClick={() => {
                      if (selected.status === CardStatus.none) {
                        onSelect(selection)
                      }
                    }}
                  >
                    <div className="line-clamp-2 text-sm">
                      {inverted ? selection.question : selection.answer}
                    </div>
                  </Button>
                </div>
              )
            })}
          </div>

          <Signature
            signature={signature}
            className="absolute left-0 top-0"
          >
            <ButtonSquare
              shadow
              rounded
              iconSize={20}
              onClick={() => onSound({ term, side: variantSide })}
              icon={(sound?.term?.id === term.id && sound.side === variantSide) ? SVGMuteOn : SVGMuteOff}
            />
          </Signature>
        </div>
      </div>
    </div>
  )
}
