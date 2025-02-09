'use client'

import {
  actionBack,
  actionContinue,
  actionRemember,
  actionSkip,
  actionTracker
} from '@helper/simulators/actions'
import {
  CardSide,
  CardStatus,
  SelectionType,
  SoundType
} from '@containers/Simulator/CardAggregator/types'
import { DefaultAnswerLang, DefaultQuestionLang } from '@entities/Term'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import CardAggregator from '@containers/Simulator/CardAggregator'
import {ProgressTrackerAction} from '@entities/ProgressTracker'
import {findActiveSimulators} from '@helper/simulators/general'
import PanelControls from '@containers/Simulator/PanelControls'
import {SimulatorMethod} from '@entities/SimulatorSettings'
import {actionUpdateSimulator} from '@store/action-main'
import Button, {ButtonVariant} from '@components/Button'
import {useMainSelector} from '@hooks/useMainSelector'
import CardStart from '@containers/Simulator/CardStart'
import PanelInfo from '@containers/Simulator/PanelInfo'
import {SimulatorStatus} from '@entities/Simulator'
import {RelationProps} from '@helper/relation'
import {useSpeech} from '@hooks/useSpeech'
import {useTranslations} from 'next-intl'

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
  const terms = useMainSelector(({ terms }) => terms)
  const simulators = useMainSelector(({ simulators }) => simulators)
  const relationSimulators = useMainSelector(({ relationSimulators }) => relationSimulators)

  const simulator = useMemo(() => {
    const activeSimulators = findActiveSimulators(relationSimulators, simulators, relation)
    return activeSimulators.length > 0 ? activeSimulators[0] : null
  }, [relationSimulators, simulators, relation])

  const active = useMemo(() => {
    return terms.find(({ id }) => id === simulator?.termId) || null
  }, [terms, simulator?.termId])

  const { speech, soundInfo, setSoundInfo } = useSpeech<SoundType>({ term: null, side: null })

  const [selected, setSelected] = useState<SelectionType>({ term: null, status: CardStatus.none })

  useEffect(() => {
    if (selected.term && simulator?.status !== SimulatorStatus.PROCESSING) {
      setSelected({ term: null, status: CardStatus.none })
    }
  }, [simulator?.status, selected.term])

  const onSoundCallback = useCallback((value: SoundType) => {
    if (!speech) {
      return
    }

    if (value.term?.id === soundInfo.term?.id) {
      speech.stop()
      setSoundInfo({ term: null, side: null })
      return
    }

    const text = (value.side === CardSide.back ? value.term?.answer : value.term?.question) || null
    const lang = value.side === CardSide.back ? value.term?.answerLang || DefaultAnswerLang : value.term?.questionLang || DefaultQuestionLang
    if (!text) {
      return
    }

    const voice = speech.selectVoice(lang)
    speech
      .stop()
      .setLang(lang)
      .setVoice(voice)
      .speak(text)

    setSoundInfo(value)
  }, [speech, setSoundInfo, soundInfo.term?.id])

  const t = useTranslations('Simulators')

  return (
    <div className="flex flex-col gap-2 h-full justify-center items-center">
      <PanelControls
        simulator={simulator}
        className="w-72 mb-2 border-b border-white/15 py-2"
        options={{
          deactivate: {
            disabled: disableDeactivate
          },
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
              actionUpdateSimulator({simulator: actionBack(simulator), editable}, () => {
                setSelected({term: null, status: CardStatus.none})
              })
              break
          }
        }}
      />

      <PanelInfo
        className="mb-2"
        relation={relation}
        simulator={simulator}
      />

      <div className="flex flex-col gap-2 w-72 h-[440px]">

        {!simulator &&
          <CardStart
            relation={relation}
            editable={editable}
          />
        }

        <div className="relative">
          {simulator &&
            <CardAggregator
              terms={terms}
              active={active}
              sound={soundInfo}
              selected={selected}
              relation={relation}
              editable={editable}
              simulator={simulator}
              onSound={onSoundCallback}
              onSelect={(selected) => setSelected(selected)}
              onSkip={() => {
                actionUpdateSimulator({simulator: actionSkip(simulator), editable}, () => {
                  setSelected({term: null, status: CardStatus.none})
                })
              }}
            />
          }
        </div>

        {(SimulatorStatus.PROCESSING !== simulator?.status) &&
          <div className="w-full h-12"/>
        }

        {active && simulator?.status === SimulatorStatus.PROCESSING &&
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
                    }, () => {
                      setSelected({term: null, status: CardStatus.none})
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
                    }, () => {
                      setSelected({term: null, status: CardStatus.none})
                    })
                  }}
                >
                  {t('buttonRepeat')}
                </Button>
              </>
            }

            {[SimulatorMethod.PICK, SimulatorMethod.INPUT].includes(simulator.settings.method) &&
              <Button
                className="w-full"
                variant={ButtonVariant.WHITE}
                disabled={selected.status === CardStatus.none}
                onClick={() => {
                  const {status} = selected
                  setSelected({term: null, status: CardStatus.none})

                  if (status === CardStatus.success) {
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
  )
}
