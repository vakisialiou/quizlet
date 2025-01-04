'use client'

import { CardSelection } from '@containers/Simulator/CardAggregator/MethodPickCard/PickCard'
import CardAggregator, { OnChangeParamsType } from '@containers/Simulator/CardAggregator'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CardStatus } from '@containers/Simulator/CardAggregator/types'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import {SimulatorMethod} from '@entities/SimulatorSettings'
import {ensureFolderTerms, getFolderById} from '@helper/folders'
import PanelControls from '@containers/Simulator/PanelControls'
import TextToSpeech, { TextToSpeechEvents } from '@lib/speech'
import { SimulatorStatus } from '@entities/Simulator'
import { ClientFolderData } from '@entities/Folder'
import Button, {ButtonVariant} from '@components/Button'
import CardEmpty from '@containers/Simulator/CardEmpty'
import CardStart from '@containers/Simulator/CardStart'
import PanelInfo from '@containers/Simulator/PanelInfo'
import { useTranslations } from 'next-intl'
import {useSelector} from 'react-redux'
import {
  actionContinueSimulators,
  actionRememberSimulators,
  actionBackSimulators,
  actionUpdateTracker,
} from '@store/index'

export default function SimulatorBody(
  {
    folderId,
    editable,
    disableDeactivate,
    onDeactivateAction
  }:
  {
    folderId: string,
    editable: boolean
    disableDeactivate?: boolean
    onDeactivateAction: (folder: ClientFolderData) => void
  }
) {
  const folders = useSelector(({ folders }: { folders: ClientFolderData[] }) => folders)

  const folder = useMemo(() => {
    return ensureFolderTerms(folders, getFolderById(folders, folderId))
  }, [folders, folderId])

  const simulators = useMemo(() => {
    return folder?.simulators || []
  }, [folder?.simulators])

  const simulator = useMemo(() => {
    return simulators.find(({ active }) => active)
  }, [simulators])

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
    <div className="flex flex-col">
      <PanelInfo
        className="mb-6"
        simulator={simulator}
      />

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-72">

          {!simulator &&
            <CardStart
              folder={folder}
              editable={editable}
            />
          }

          <div className="relative">
            {(folder && simulator) &&
              <CardAggregator
                folder={folder}
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
                      if (folder) {
                        actionUpdateTracker({
                          editable,
                          folderId: folder.id,
                          trackerAction: ProgressTrackerAction.success
                        }, () => {
                          actionRememberSimulators({ folderId: folder.id, editable })
                        })
                      }
                    }}
                  >
                    {t('buttonRemember')}
                  </Button>

                  <Button
                    className="w-1/2"
                    variant={ButtonVariant.WHITE}
                    onClick={() => {
                      if (folder) {
                        actionUpdateTracker({
                          editable,
                          folderId: folder.id,
                          trackerAction: ProgressTrackerAction.error
                        }, () => {
                          actionContinueSimulators({ folderId: folder.id, editable })
                        })
                      }
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
                    if (folder) {
                      const trackerActionMap = {
                        [SimulatorMethod.PICK]: {
                          [CardStatus.error]: ProgressTrackerAction.error,
                          [CardStatus.success]: ProgressTrackerAction.success
                        },
                        [SimulatorMethod.INPUT]: {
                          [CardStatus.error]: ProgressTrackerAction.error,
                          [CardStatus.success]: ProgressTrackerAction.success
                        }
                      } as Record<SimulatorMethod, Record<CardStatus, ProgressTrackerAction>>

                      const trackerAction = trackerActionMap[simulator.settings.method]?.[cardStatus]
                      actionUpdateTracker({ folderId: folder.id, trackerAction, editable }, () => {
                        if (cardStatus === CardStatus.success) {
                          actionRememberSimulators({ folderId: folder.id, editable })
                        } else {
                          actionContinueSimulators({ folderId: folder.id, editable })
                        }
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

        <div className="w-full">
          <PanelControls
            simulator={simulator}
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
              if (!folder) {
                return
              }

              switch (controlName) {
                case 'deactivate':
                  onDeactivateAction(folder)
                  break
                case 'back':
                  actionBackSimulators({ folderId: folder.id, editable })
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
        </div>
      </div>
    </div>
  )
}
