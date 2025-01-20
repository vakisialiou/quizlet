'use client'

import { actionTracker, actionRemember, actionContinue, actionBack } from '@helper/simulators/actions'
import { CardSelection } from '@containers/Simulator/CardAggregator/MethodPickCard/PickCard'
import CardAggregator, { OnChangeParamsType } from '@containers/Simulator/CardAggregator'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CardStatus } from '@containers/Simulator/CardAggregator/types'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import { findActiveSimulators } from '@helper/simulators/general'
import PanelControls from '@containers/Simulator/PanelControls'
import TextToSpeech, { TextToSpeechEvents } from '@lib/speech'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import {SimulatorMethod} from '@entities/SimulatorSettings'
import Button, {ButtonVariant} from '@components/Button'
import CardEmpty from '@containers/Simulator/CardEmpty'
import CardStart from '@containers/Simulator/CardStart'
import PanelInfo from '@containers/Simulator/PanelInfo'
import { SimulatorStatus } from '@entities/Simulator'
import { actionUpdateSimulator } from '@store/index'
import { RelationProps } from '@helper/relation'
import { useTranslations } from 'next-intl'

export default function SimulatorBody(
  {
    relation,
    editable,
    disableDeactivate,
    onDeactivateAction
  }:
  {
    editable: boolean
    relation: RelationProps,
    disableDeactivate?: boolean
    onDeactivateAction: (simulatorId: string) => void
  }
) {
  const { relationSimulators, simulators } = useSimulatorSelect()

  const simulator = useMemo(() => {
    const activeSimulators = findActiveSimulators(relationSimulators, simulators, relation)
    return activeSimulators.length > 0 ? activeSimulators[0] : null
  }, [relationSimulators, simulators, relation])

  const speech = useMemo(() => {
    return typeof(window) === 'object' ? new TextToSpeech() : null
  }, [])

  const [ soundSelection, setSoundSelection ] = useState<{ type: string, data: CardSelection | null }>({ type: '', data: null })

  useEffect(() => {
    if (speech) {
      const onEndCallback = () => setSoundSelection({ type: '', data: null })
      speech.addEventListener(TextToSpeechEvents.end, onEndCallback)
      return () => {
        speech.removeEventListener(TextToSpeechEvents.end, onEndCallback)
      }
    }
  }, [speech, setSoundSelection])

  const [showHelp, setShowHelp] = useState(false)

  const showHelpRef = useRef(showHelp)
  useEffect(() => {
    showHelpRef.current = showHelp
  }, [showHelp])

  // Сбросить активную подсказку если изменился термин.
  useEffect(() => {
    if (showHelpRef.current) {
      setShowHelp(false)
    }
  }, [simulator?.termId])

  const [cardData, setCardData] = useState<OnChangeParamsType | null>(null)

  useEffect(() => {
    if (cardData && (!simulator || simulator.status !== SimulatorStatus.PROCESSING)) {
      setCardData(null)
    }
  }, [simulator, cardData])

  const onChangeCardDataCallback = useCallback((params: OnChangeParamsType) => {
    setCardData(params)
  }, [])

  const extra = cardData?.helpData?.extra
  const cardStatus = extra?.status as CardStatus

  const t = useTranslations('Simulators')

  return (
    <div className="flex flex-col items-center">
      <PanelInfo
        className="mb-4"
        relation={relation}
        simulator={simulator}
      />

      <div className="flex flex-col gap-2">
        <PanelControls
          simulator={simulator}
          className="w-72"
          options={{
            sound: {
              active: soundSelection.type === 'sound',
              disabled: !speech || showHelp || !cardData?.helpData?.text || !cardData?.helpData?.lang
            },
            deactivate: {
              disabled: disableDeactivate
            },
            help: {
              disabled: !cardData?.helpData?.association,
              active: showHelp
            }
          }}
          onClick={(controlName) => {
            if (!simulator) {
              return
            }

            switch (controlName) {
              case 'deactivate':
                onDeactivateAction(simulator.id)
                break
              case 'back':
                actionUpdateSimulator({
                  simulator: actionBack(simulator),
                  editable
                })
                break
              case 'help':
                setShowHelp((prevState) => !prevState)
                break
              case 'sound':
                if (simulator && cardData && speech) {
                  if (soundSelection.type === 'sound') {
                    speech.stop()
                    return
                  }

                  const text = cardData?.helpData?.text
                  const lang = cardData?.helpData?.lang

                  if (lang && text) {
                    speech
                      .stop()
                      .setLang(lang)
                      .setVoice(speech.selectVoice(lang))
                      .speak(text)
                    setSoundSelection({
                      type: 'sound',
                      data: {id: '', lang, text} as CardSelection
                    })
                  }
                }
                break
            }
          }}
        />

        <div className="flex flex-col gap-2 w-72">

          {!simulator &&
            <CardStart
              relation={relation}
              editable={editable}
            />
          }

          <div className="relative">
            {simulator &&
              <CardAggregator
                relation={relation}
                editable={editable}
                simulator={simulator}
                onChange={onChangeCardDataCallback}
                soundSelection={soundSelection.type === 'selection' ? soundSelection.data : null}
                onSound={(selection) => {
                  if (!speech) {
                    return
                  }

                  if (!selection) {
                    speech.stop()
                    return
                  }

                  speech
                    .stop()
                    .setLang(selection.lang)
                    .setVoice(speech.selectVoice(selection.lang))
                    .speak(selection.text)
                  setSoundSelection({type: 'selection', data: selection})
                }}
              />
            }

            {showHelp &&
              <CardEmpty
                active
                className="absolute left-0 top-0"
                classNameContent="cursor-pointer p-4"
                onClick={() => {
                  setShowHelp(false)
                }}
              >
                <div className="text-gray-600 font-semibold text-lg">
                  {cardData?.helpData?.association}
                </div>
              </CardEmpty>
            }
          </div>

          {(SimulatorStatus.PROCESSING !== simulator?.status) &&
            <div className="w-full h-12" />
          }

          {simulator?.status === SimulatorStatus.PROCESSING &&
            <div className="flex gap-2 w-full">
              {SimulatorMethod.FLASHCARD === simulator.settings.method &&
                <>
                  <Button
                    className="w-1/2"
                    variant={ButtonVariant.GREEN}
                    onClick={() => {
                      actionUpdateSimulator({
                        simulator: actionRemember(actionTracker(simulator, ProgressTrackerAction.success)),
                        editable
                      })
                    }}
                  >
                    {t('buttonRemember')}
                  </Button>

                  <Button
                    className="w-1/2"
                    variant={ButtonVariant.WHITE}
                    onClick={() => {
                      actionUpdateSimulator({
                        simulator: actionContinue(actionTracker(simulator, ProgressTrackerAction.error)),
                        editable
                      })
                    }}
                  >
                    {t('buttonContinue')}
                  </Button>
                </>
              }

              {[SimulatorMethod.PICK, SimulatorMethod.INPUT].includes(simulator.settings.method) &&
                <Button
                  className="w-full"
                  variant={ButtonVariant.WHITE}
                  disabled={!cardStatus || cardStatus === CardStatus.none}
                  onClick={() => {
                    if (cardStatus === CardStatus.success) {
                      actionUpdateSimulator({
                        simulator: actionRemember(actionTracker(simulator, ProgressTrackerAction.success)),
                        editable
                      })
                    } else {
                      actionUpdateSimulator({
                        simulator: actionContinue(actionTracker(simulator, ProgressTrackerAction.error)),
                        editable
                      })
                    }
                  }}
                >
                  {t('buttonContinue')}
                </Button>
              }
            </div>
          }

        </div>
      </div>
    </div>
  )
}
