'use client'

import { DefaultAnswerLang, DefaultQuestionLang} from '@entities/ClientTerm'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { ClientSimulatorData } from '@entities/ClientSimulator'
import { RollbackData } from '@containers/Simulator/Card'
import Button, { ButtonSkin } from '@components/Button'
import Dialog, { DialogType } from '@components/Dialog'
import CardEmpty from '@containers/Simulator/CardEmpty'
import ButtonSquare from '@components/ButtonSquare'
import { FoldersType } from '@store/initial-state'
import TextToSpeech, { voices } from '@lib/speech'
import ContentPage from '@containers/ContentPage'
import SingleQueueStart from './SingleQueueStart'
import PanelControls from './PanelControls'
import SVGBack from '@public/svg/back.svg'
import { useSelector } from 'react-redux'
import { useRouter } from '@i18n/routing'
import SingleQueue from './SingleQueue'
import PanelInfo from './PanelInfo'
import {
  actionDeactivateSimulators,
  actionFetchSimulators,
  actionBackSimulators
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

  const [rollbackData, setRollbackData] = useState<RollbackData | null>(null)

  const updateVisibleSideCallback = useCallback((data: RollbackData) => {
    setRollbackData(data)
  }, [])

  const speech = useMemo(() => {
    return typeof(window) === 'object' ? new TextToSpeech() : null
  }, [])

  if (speech && !speech.hasVoice()) {
    speech.loadVoices()
  }

  const [stopFolderId, setStopFolderId] = useState<string | null>(null)

  const [showHelp, setShowHelp] = useState(false)

  const association = rollbackData?.backSide
      ? rollbackData?.backSide?.association
      : rollbackData?.faceSide?.association

  return (
    <ContentPage
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
                <SingleQueueStart
                  folder={folder}
                  process={folders.process}
                />
              }

              <div className="relative">
                {(folder && simulator) &&
                  <SingleQueue
                    folder={folder}
                    onRoll={updateVisibleSideCallback}
                    simulator={simulator as ClientSimulatorData}
                  />
                }

                {showHelp &&
                  <CardEmpty
                    active
                    className="absolute left-0 top-0 h-full cursor-pointer"
                    onClick={() => setShowHelp(false)}
                  >
                    <div className="text-gray-600 font-semibold text-sm">
                      {association}
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
                    disabled: !speech || !rollbackData || showHelp
                  },
                  help: {
                    disabled: !association,
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
                      if (simulator && rollbackData && speech) {

                        const text = rollbackData.isBackSide
                          ? rollbackData.backSide.text
                          : rollbackData.faceSide.text

                        const lang = rollbackData.isBackSide
                          ? (rollbackData.backSide.lang || DefaultAnswerLang)
                          : (rollbackData.faceSide.lang || DefaultQuestionLang)

                        const item = voices.find((item) => item.lang === lang)

                        if (text) {
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
              skin={ButtonSkin.GRAY_500}
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
              skin={ButtonSkin.WHITE_100}
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
