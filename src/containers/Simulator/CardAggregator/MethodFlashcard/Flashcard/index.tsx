import {CardSide, SoundType} from '@containers/Simulator/CardAggregator/types'
import Signature from '@containers/Simulator/CardAggregator/Signature'
import CardText from '@containers/Simulator/CardAggregator/CardText'
import SVGMuteOff from '@public/svg/mute_ipo_off.svg'
import SVGMuteOn from '@public/svg/mute_ipo_on.svg'
import ButtonSquare from '@components/ButtonSquare'
import {BaseSyntheticEvent} from 'react'
import {TermData} from '@entities/Term'
import clsx from 'clsx'

export default function Flashcard(
  {
    term,
    sound,
    onSound,
    onClick,
    inverted,
    signature,
    isBackSide,
    className = '',
  }:
  {
    term: TermData
    inverted: boolean
    isBackSide: boolean
    className?: string,
    sound: SoundType
    signature: string | null,
    onSound?: (value: SoundType) => void,
    onClick?: (e: BaseSyntheticEvent) => void,
  }
) {
  const frontSide = inverted ? CardSide.back : CardSide.front
  const backSide = inverted ? CardSide.front : CardSide.back
  return (
    <div
      onClick={onClick}
      className={clsx('card cursor-pointer select-none', {
        [className]: className
      })}
    >
      <div
        className={clsx('card__inner relative w-full h-full transition-colors rounded border border-gray-500/50 bg-gray-500/10 shadow-inner shadow-gray-500/20', {
          ['card__inner_back']: isBackSide
        })}
      >
        <div
          className="card__front absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 rounded"
        >
          <CardText
            term={term}
            className="mt-2"
            inverted={inverted}
          />

          <Signature
            signature={signature}
            className="absolute right-0 top-0"
          >
            <div className="flex gap-2 items-center">
              <span>front</span>

              <ButtonSquare
                shadow
                rounded
                iconSize={20}
                onClick={(e) => {
                  e.stopPropagation()
                  if (onSound) {
                    onSound({ term, side: frontSide })
                  }
                }}
                icon={(sound.term?.id && sound.side === frontSide) ? SVGMuteOn : SVGMuteOff}
              />
            </div>
          </Signature>

        </div>
        <div
          className="card__back absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 bg-white/5 rounded"
        >
          <CardText
            term={term}
            className="mt-2"
            inverted={!inverted}
          />

          <Signature
            signature={signature}
            className="absolute right-0 top-0"
          >
            <div className="flex gap-2 items-center">
              <span>back</span>

              <ButtonSquare
                shadow
                rounded
                iconSize={20}
                onClick={(e) => {
                  e.stopPropagation()
                  if (onSound) {
                    onSound({ term, side: backSide })
                  }
                }}
                icon={(sound.term?.id && sound.side === backSide) ? SVGMuteOn : SVGMuteOff}
              />
            </div>
          </Signature>
        </div>
      </div>
    </div>
  )
}
