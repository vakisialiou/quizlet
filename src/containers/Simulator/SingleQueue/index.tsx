import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { filterFolderTerms } from '@containers/Simulator/helpers'
import { PAUSE_SECONDS } from '@containers/Simulator/constants'
import { ClientFolderData } from '@entities/ClientFolder'
import SVGLoopBack from '@public/svg/loop_back.svg'
import { useEffect, useMemo, useRef } from 'react'
import RoundInfo from '@components/RoundInfo'
import CardEmpty from '@components/CardEmpty'
import Button from '@components/Button'
import { getDuration } from '@lib/date'
import Card from '@components/Card'
import clsx from 'clsx'
import {
  actionContinueSimulators,
  actionRememberSimulators,
  actionRestartSimulators,
  actionStartSimulators,
  actionBackSimulators,
} from '@store/index'

export default function SingleQueue(
  {
    folder,
    simulator,
  }: {
    folder: ClientFolderData,
    simulator: ClientSimulatorData,
  }) {
  const ref = useRef<HTMLDivElement|null>(null)
  const refIntervalId = useRef<NodeJS.Timeout|number|undefined>(undefined)

  useEffect(() => {
    if (simulator.status === SimulatorStatus.FINISHING && simulator.continueIds.length > 0) {
      let i = 0
      refIntervalId.current = setInterval(() => {
        i++

        if (ref.current) {
          ref.current.innerText = `${PAUSE_SECONDS - i} sec`
        }

        if (i >= PAUSE_SECONDS) {
          clearInterval(refIntervalId.current)
          actionRestartSimulators({ folderId: folder.id })
        }
      }, 1000)
      return
    }

    clearInterval(refIntervalId.current)
    return () => clearInterval(refIntervalId.current)
  }, [folder.id, simulator.continueIds, simulator.status])

  const refTimer = useRef<HTMLDivElement|null>(null)
  const refTimerIntervalId = useRef<NodeJS.Timeout|number|undefined>(undefined)

  useEffect(() => {
    clearInterval(refTimerIntervalId.current)
    refTimerIntervalId.current = setInterval(() => {
      if (simulator.status === SimulatorStatus.WAITING) {
        return
      }

      if (simulator.status === SimulatorStatus.FINISHING) {
        return
      }

      if (!refTimer.current) {
        return
      }

      if (simulator.duration === 0) {
        refTimer.current.innerText = '00:00:00'
      } else {
        refTimer.current.innerText = getDuration(simulator.duration || 0)
      }
    }, 1000)

    return () => {
      clearInterval(refTimerIntervalId.current)
    }
  }, [simulator.status, simulator.duration])

  const activeTerm = useMemo(() => {
    return (folder?.terms || []).find(({ id }) => id === simulator.termId)
  }, [folder, simulator.termId])

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-center select-none gap-2">
          <RoundInfo
            title="Terms"
            value={simulator.termIds.length}
          />

          <RoundInfo
            title="Queue"
            value={Math.max(simulator.termIds.length - simulator.continueIds.length - simulator.rememberIds.length - 1, 0)}
          />

          <RoundInfo
            title="Done"
            value={simulator.rememberIds.length}
          />

          <RoundInfo
            title="Time"
            value={
              <span ref={refTimer}>
                {getDuration(simulator.duration)}
              </span>
            }
          />
        </div>
      </div>

      {simulator.status === SimulatorStatus.WAITING &&
        <div className="flex justify-center w-full">
          <CardEmpty>
            <div className="flex flex-col justify-center text-center gap-2">
              <div className="text-gray-300 text-lg">Time to learn!</div>

              <br/>

              <div className="text-gray-500 text-sm">Ready to get started?</div>

              <Button
                onClick={() => {
                  const terms = filterFolderTerms(folder)
                  if (terms.length > 0) {
                    const termIds = terms.map(({ id }) => id)
                    actionStartSimulators({ folderId: folder.id, termIds })
                  }
                }}
              >
                Start
              </Button>
            </div>
          </CardEmpty>
        </div>
      }

      {simulator.status === SimulatorStatus.FINISHING &&
        <div className="flex justify-center w-full">
          <CardEmpty>
            {simulator.continueIds.length === 0 &&
              <div className="flex flex-col justify-center text-center gap-2">
                <div className="text-gray-300 text-lg">Training completed!</div>

                <br/>

                <div className="text-gray-500 text-sm">Ready to get started?</div>

                <Button
                  onClick={() => {
                    const terms = filterFolderTerms(folder)
                    if (terms.length > 0) {
                      const termIds = terms.map(({ id }) => id)
                      actionStartSimulators({ folderId: folder.id, termIds })
                    }
                  }}
                >
                  Start
                </Button>
              </div>
            }

            {simulator.continueIds.length > 0 &&
              <div className="flex flex-col justify-center text-center gap-2">
                <div className="text-gray-300 text-lg">
                  Prepare yourself to move forward.
                </div>

                <div className="text-gray-500 text-lg" ref={ref}>
                  {PAUSE_SECONDS} sec
                </div>
              </div>
            }
          </CardEmpty>
        </div>
      }

      {simulator.status === SimulatorStatus.PROCESSING && activeTerm &&
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="flex flex-col gap-4">
            <Card
              key={activeTerm.id}
              answer={activeTerm.answer}
              question={activeTerm.question}
              association={activeTerm.association}
            />

            <div className="gap-2 flex justify-between">
              <Button
                disabled={simulator.historyIds.length === 0}
                onClick={() => {
                  actionBackSimulators({ folderId: folder.id })
                }}
              >
                <SVGLoopBack
                  width={24}
                  height={24}
                  className={clsx('text-gray-400', {
                    ['text-gray-600']: simulator.historyIds.length === 0
                  })}
                />
              </Button>

              <Button
                className="w-28"
                onClick={() => {
                  actionRememberSimulators({ folderId: folder.id })
                }}
              >
                Done
              </Button>

              <Button
                className="w-28"
                onClick={() => {
                  actionContinueSimulators({ folderId: folder.id })
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      }
    </>
  )
}
