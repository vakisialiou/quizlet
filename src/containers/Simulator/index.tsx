'use client'

import { CardSelection } from '@containers/Simulator/CardAggregator/MethodPickCard/PickCard'
import CardAggregator, { OnChangeParamsType } from '@containers/Simulator/CardAggregator'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { CardStatus } from '@containers/Simulator/CardAggregator/types'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import {SimulatorMethod} from '@entities/ClientSettingsSimulator'
import TextToSpeech, { TextToSpeechEvents } from '@lib/speech'
import {SimulatorStatus} from '@entities/ClientSimulator'
import CardEmpty from '@containers/Simulator/CardEmpty'
import CardStart from '@containers/Simulator/CardStart'
import PanelInfo from '@containers/Simulator/PanelInfo'
import Button, {ButtonSkin} from '@components/Button'
import Dialog, {DialogType} from '@components/Dialog'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import ContentPage from '@containers/ContentPage'
import {FoldersType} from '@store/initial-state'
import { useTranslations } from 'next-intl'
import PanelControls from './PanelControls'
import SVGBack from '@public/svg/back.svg'
import {useSelector} from 'react-redux'
import {useRouter} from '@i18n/routing'
import {
  actionBackSimulators,
  actionContinueSimulators,
  actionDeactivateSimulators,
  actionFetchSimulators,
  actionRememberSimulators,
  actionUpdateTracker,
} from '@store/index'

export default function Simulator({ folderId }: { folderId: string }) {
  const router = useRouter()

  useEffect(() => actionFetchSimulators({ folderId }), [folderId])

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)
  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders.items, folderId])

  const simulators = useMemo(() => {
    return folder?.simulators || []
  }, [folder?.simulators])

  const simulator = useMemo(() => {
    return simulators.find(({ active }) => active)
  }, [simulators])

  const [cardData, setCardData] = useState<OnChangeParamsType | null>(null)

  const onChangeCardDataCallback = useCallback((params: OnChangeParamsType) => {
    setCardData(params)
  }, [])

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

  const [stopFolderId, setStopFolderId] = useState<string | null>(null)

  const [showUserHelp, setShowUserHelp] = useState(false)

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

  const extra = cardData?.helpData?.extra
  const cardStatus = extra?.status as CardStatus
  const cardMethod = extra?.method as SimulatorMethod

  const t = useTranslations('Simulators')

  return (
    <ContentPage
      showHeader
      showFooter
      title={folder?.name}
      rightControls={(
        <>
          <ButtonSquare
            icon={SVGQuestion}
            disabled={showUserHelp}
            onClick={() => setShowUserHelp(true)}
          />

          <ButtonSquare
            icon={SVGBack}
            onClick={() => {
              if (folder) {
                router.push(`/private/folder/${folder?.id}`)
              }
            }}
          />
        </>
      )}
      footer={(
        <div className="flex w-full justify-center">
          <div className="flex gap-2 w-full max-w-96">
            {SimulatorMethod.FLASHCARD === cardMethod &&
              <>
                <Button
                  className="w-1/2"
                  skin={ButtonSkin.GREEN}
                  disabled={!folder || simulator?.status !== SimulatorStatus.PROCESSING}
                  onClick={() => {
                    if (folder) {
                      actionUpdateTracker({ folderId: folder.id, trackerAction: ProgressTrackerAction.success }, () => {
                        actionRememberSimulators({ folderId: folder.id })
                      })
                    }
                  }}
                >
                  {t('buttonRemember')}
                </Button>

                <Button
                  className="w-1/2"
                  skin={ButtonSkin.WHITE}
                  disabled={!folder || simulator?.status !== SimulatorStatus.PROCESSING}
                  onClick={() => {
                    if (folder) {
                      actionUpdateTracker({ folderId: folder.id, trackerAction: ProgressTrackerAction.error }, () => {
                        actionContinueSimulators({ folderId: folder.id })
                      })
                    }
                  }}
                >
                  {t('buttonContinue')}
                </Button>
              </>
            }

            {[SimulatorMethod.PICK, SimulatorMethod.INPUT].includes(cardMethod) &&
              <Button
                className="w-full"
                skin={ButtonSkin.WHITE}
                disabled={!folder || simulator?.status !== SimulatorStatus.PROCESSING || cardStatus === CardStatus.none}
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

                    const trackerAction = trackerActionMap[cardMethod]?.[cardStatus]
                    actionUpdateTracker({ folderId: folder.id, trackerAction }, () => {
                      if (cardStatus === CardStatus.success) {
                        actionRememberSimulators({ folderId: folder.id })
                      } else {
                        actionContinueSimulators({folderId: folder.id})
                      }
                    })
                  }
                }}
              >
                {t('buttonContinue')}
              </Button>
            }
          </div>
        </div>
      )}
    >
      <div
        className="w-full flex flex-col items-center"
      >
        <div className="flex flex-col">
          <PanelInfo
            simulator={simulator}
            process={folders.process}
            className="my-6"
          />

          <div className="flex gap-2">
            <div className="flex flex-col gap-4 w-72">

              {!simulator &&
                <CardStart
                  folder={folder}
                  process={folders.process}
                />
              }

              <div className="relative">
                {(folder && simulator) &&
                  <CardAggregator
                    folder={folder}
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
                      setSoundSelection({ type: 'selection', data: selection })
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
            </div>

            <div className="w-full">
              <PanelControls
                simulator={simulator}
                process={folders.process}
                options={{
                  sound: {
                    active: soundSelection.type === 'sound',
                    disabled: !speech || showHelp || !cardData?.helpData?.text || !cardData?.helpData?.lang
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
                      setStopFolderId(folder.id)
                      break
                    case 'back':
                      actionBackSimulators({folderId: folder.id})
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
                          setSoundSelection({ type: 'sound', data: { id: '', lang, text } as CardSelection })
                        }
                      }
                      break
                  }
                }}
              />
            </div>
          </div>
        </div>

        {showUserHelp &&
          <Dialog
            title={t('userHelpTitle')}
            text={(
              <div className="flex flex-col gap-4 text-gray-800">

                <div className="flex flex-col gap-1">
                  <div className="font-bold">{t('userHelpSection1Title')}</div>
                  {t('userHelpSection1Text')}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-bold">{t('userHelpSection2Title')}</div>
                  {t('userHelpSection2Text')}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-bold">{t('userHelpSection3Title')}</div>
                  {t('userHelpSection3Text')}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-bold">{t('userHelpSection4Title')}</div>
                  {t('userHelpSection4Text')}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-bold">{t('userHelpSection5Title')}</div>
                  {t('userHelpSection5Text')}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-bold">{t('userHelpSection6Title')}</div>
                  {t('userHelpSection6Text')}
                </div>
              </div>
            )}
          >
            <Button
              className="w-28"
              skin={ButtonSkin.GRAY}
              onClick={() => {
                setShowUserHelp(false)
              }}
            >
              {t('userHelpButtonClose')}
            </Button>
          </Dialog>
        }

        {stopFolderId &&
          <Dialog
            title={t('removeDialogTitle')}
            text={t('removeDialogText')}
            type={DialogType.warning}
          >
            <Button
              className="w-28"
              skin={ButtonSkin.GRAY}
              onClick={() => {
                actionDeactivateSimulators({folderId: stopFolderId}, () => {
                  setStopFolderId(null)
                })
              }}
            >
              {t('removeDialogButtonApprove')}
            </Button>

            <Button
              className="w-28"
              skin={ButtonSkin.WHITE}
              onClick={() => setStopFolderId(null)}
            >
              {t('removeDialogButtonCancel')}
            </Button>
          </Dialog>
        }
      </div>
    </ContentPage>
  )
}
