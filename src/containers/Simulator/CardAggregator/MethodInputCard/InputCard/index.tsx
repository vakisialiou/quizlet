import Input, { InputSize, InputVariantFocus } from '@components/Input'
import Signature from '@containers/Simulator/CardAggregator/Signature'
import Button, { ButtonSize, ButtonVariant } from '@components/Button'
import CardError from '@containers/Simulator/CardAggregator/CardError'
import {CardStatus} from '@containers/Simulator/CardAggregator/types'
import CardText from '@containers/Simulator/CardAggregator/CardText'
import {BaseSyntheticEvent, useEffect, useMemo, useRef} from 'react'
import { SimulatorData } from '@entities/Simulator'
import { TermData } from '@entities/Term'
import clsx from 'clsx'

export default function InputCard(
  {
    term,
    value,
    status,
    onSkip,
    onChange,
    inverted,
    onApprove,
    signature,
    simulator,
    className = '',
  }:
  {
    value: string,
    term: TermData
    inverted: boolean
    status: CardStatus
    className?: string
    signature: string | null,
    simulator: SimulatorData,
    onSkip: (e: BaseSyntheticEvent) => void
    onChange: (e: BaseSyntheticEvent) => void
    onApprove: (e: BaseSyntheticEvent) => void
  }
) {
  const ref  = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    const input = ref.current?.querySelector('input')
    if (input) {
      input.focus()
    }
  }, [term.id])

  const amountAvailableTerms = useMemo(() => {
    return simulator.termIds.length - simulator.historyIds.length - simulator.rememberIds.length
  }, [simulator])

  return (
    <div
      className={clsx('group select-none', {
        [className]: className
      })}
    >
      <div
        className={clsx('relative w-full h-full transition-colors rounded border border-gray-500/50 bg-gray-500/10 shadow-inner shadow-gray-500/20')}
      >
        <div className="absolute w-full h-full flex flex-col gap-2 items-center justify-center p-4 rounded">
          <CardText
            term={term}
            className="mt-8"
            inverted={inverted}
          />

          <CardError
            className="pt-4"
            status={status}
          >
            <div
              className="flex w-full items-center justify-center text-white/70 font-bold text-xs mt-2">
              {status === CardStatus.error &&
                <div className="line-clamp-3 text-center">
                  {inverted ? term.question : term.answer}
                </div>
              }
            </div>
          </CardError>

          <div
            className="w-full h-full flex flex-col justify-end divide-y divide-gray-800 divide-dashed"
          >
            <div
              ref={ref}
              className="flex flex-col gap-2"
            >
              <Input
                rounded
                value={value}
                onChange={onChange}
                size={InputSize.h10}
                autoFocus={status === CardStatus.none}
                readOnly={status !== CardStatus.none}
                variantFocus={status === CardStatus.none ? InputVariantFocus.blue : InputVariantFocus.none}
                onKeyUp={(e) => {
                  switch (e.keyCode) {
                    case 13:
                      onApprove(e)
                      break
                  }
                }}
              />

              <div className="flex gap-2">
                <Button
                  className="w-1/2"
                  onClick={onApprove}
                  size={ButtonSize.H10}
                  variant={ButtonVariant.GREEN}
                  disabled={!value || [CardStatus.success, CardStatus.error].includes(status)}
                >
                  Approve
                </Button>

                <Button
                  className="w-1/2"
                  onClick={onSkip}
                  size={ButtonSize.H10}
                  variant={ButtonVariant.WHITE}
                  disabled={CardStatus.none !== status || amountAvailableTerms <= 1}
                >
                  Skip
                </Button>
              </div>
            </div>

          </div>

          <Signature
            signature={signature}
            className="absolute left-0 top-0"
          />

        </div>
      </div>
    </div>
  )
}
