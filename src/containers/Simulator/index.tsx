'use client'

import { DefaultAnswerLang, DefaultQuestionLang} from '@entities/ClientTerm'
import React, { useEffect, useMemo, useState, useCallback, } from 'react'
import { ClientSimulatorData } from '@entities/ClientSimulator'
import { RollbackData } from '@containers/Simulator/Card'
import Button, { ButtonSkin } from '@components/Button'
import Dialog, { DialogType } from '@components/Dialog'
import ButtonSquare from '@components/ButtonSquare'
import { FoldersType } from '@store/initial-state'
import TextToSpeech, { voices } from '@lib/speech'
import SingleQueueStart from './SingleQueueStart'
import HeaderPage from '@containers/HeaderPage'
import PanelControls from './PanelControls'
import { useRouter } from 'next/navigation'
import SVGBack from '@public/svg/back.svg'
import { useSelector } from 'react-redux'
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

  return (
    <div
      className="w-full flex flex-col px-2 md:px-4 gap-4 items-center"
    >
      <HeaderPage
        title={folder?.name}
        left={
          <ButtonSquare
            icon={SVGBack}
            onClick={() => router.back()}
          />
        }
      />

      <div className="grid grid-cols-7 gap-1">
        <div className="flex flex-col gap-4 w-72 col-span-6">
          <PanelInfo
            simulator={simulator}
            process={folders.process}
          />

          {!simulator &&
            <SingleQueueStart
              folder={folder}
              process={folders.process}
            />
          }

          {(folder && simulator) &&
            <SingleQueue
              folder={folder}
              simulator={simulator as ClientSimulatorData}
              onRoll={updateVisibleSideCallback}
            />
          }
        </div>
        <div className="w-full pt-16 mt-4">
          <PanelControls
            simulator={simulator}
            process={folders.process}
            options={{
              sound: {
                disabled: !speech || !rollbackData
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
                  actionBackSimulators({ folderId: folder.id })
                  break
                case 'sound':
                  if (simulator && rollbackData && speech) {
                    const text = rollbackData.isBackSide ? rollbackData.term.answer : rollbackData.term.question
                    const lang = rollbackData.isBackSide
                      ? (rollbackData.term.answerLang || DefaultAnswerLang)
                      : (rollbackData.term.questionLang || DefaultQuestionLang)

                    const item = voices.find((item) => item.lang === lang)

                    if (text) {
                      speech.stop().setLang(lang).setVoice(item?.name || lang).speak(text)
                    }
                  }
              }
            }}
          />
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
              actionDeactivateSimulators({ folderId: stopFolderId }, () => {
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
  )
}
