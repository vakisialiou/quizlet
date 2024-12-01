'use client'

import CardAggregator, {OnChangeParamsType} from '@containers/Simulator/CardAggregator'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import TextToSpeech, {TextToSpeechEvents, voices} from '@lib/speech'
import {SimulatorMethod} from '@entities/ClientSettingsSimulator'
import {SimulatorStatus} from '@entities/ClientSimulator'
import Button, {ButtonSkin} from '@components/Button'
import Dialog, {DialogType} from '@components/Dialog'
import CardEmpty from '@containers/Simulator/CardEmpty'
import CardStart from '@containers/Simulator/CardStart'
import PanelInfo from '@containers/Simulator/PanelInfo'
import ButtonSquare from '@components/ButtonSquare'
import {FoldersType} from '@store/initial-state'
import ContentPage from '@containers/ContentPage'
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

import {SimulatorTrackerAction} from '@entities/SimulatorTracker'
import {CardStatus} from '@containers/Simulator/CardAggregator/types'

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
    console.log(params)
    setCardData(params)
  }, [])

  const speech = useMemo(() => {
    return typeof(window) === 'object' ? new TextToSpeech() : null
  }, [])

  const [ soundPlaying, setSoundPlaying ] = useState(false)

  useEffect(() => {
    if (speech) {
      const onEndCallback = () => setSoundPlaying(false)
      speech.addEventListener(TextToSpeechEvents.end, onEndCallback)
      return () => {
        speech.removeEventListener(TextToSpeechEvents.end, onEndCallback)
      }
    }
  }, [speech, setSoundPlaying])

  const [stopFolderId, setStopFolderId] = useState<string | null>(null)

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

  return (
    <ContentPage
      showHeader
      showFooter
      title={folder?.name}
      rightControls={(
        <ButtonSquare
          icon={SVGBack}
          onClick={() => {
            if (folder) {
              router.push(`/private/folder/${folder?.id}`)
            }
          }}
        />
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
                      actionUpdateTracker({ folderId: folder.id, trackerAction: SimulatorTrackerAction.actionFlashcardRemember }, () => {
                        actionRememberSimulators({ folderId: folder.id })
                      })
                    }
                  }}
                >
                  Remember
                </Button>

                <Button
                  className="w-1/2"
                  skin={ButtonSkin.WHITE}
                  disabled={!folder || simulator?.status !== SimulatorStatus.PROCESSING}
                  onClick={() => {
                    if (folder) {
                      actionUpdateTracker({ folderId: folder.id, trackerAction: SimulatorTrackerAction.actionFlashcardContinue }, () => {
                        actionContinueSimulators({ folderId: folder.id })
                      })
                    }
                  }}
                >
                  Continue
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
                        [CardStatus.error]: SimulatorTrackerAction.actionPickError,
                        [CardStatus.success]: SimulatorTrackerAction.actionPickSuccess
                      },
                      [SimulatorMethod.INPUT]: {
                        [CardStatus.error]: SimulatorTrackerAction.actionInputError,
                        [CardStatus.success]: SimulatorTrackerAction.actionInputSuccess
                      }
                    } as Record<SimulatorMethod, Record<CardStatus, SimulatorTrackerAction>>

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
                Continue
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
                    active: soundPlaying,
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
                        if (soundPlaying) {
                          speech.stop()
                          return
                        }

                        const text = cardData?.helpData?.text
                        const lang = cardData?.helpData?.lang

                        if (lang && text) {
                          setSoundPlaying(true)
                          const item = voices.find((item) => item.lang === lang)
                          speech.stop().setLang(lang).setVoice(item?.name || lang).speak(text)
                        }
                      }
                      break
                  }
                }}
              />
            </div>
          </div>
        </div>

        {stopFolderId &&
          <Dialog
            title="Stopping"
            text="Are you sure you want to stop?"
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
              Approve
            </Button>

            <Button
              className="w-28"
              skin={ButtonSkin.WHITE}
              onClick={() => setStopFolderId(null)}
            >
              Cancel
            </Button>
          </Dialog>
        }
      </div>
    </ContentPage>
  )
}
