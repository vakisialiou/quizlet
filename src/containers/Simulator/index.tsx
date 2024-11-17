'use client'

import { PAUSE_SECONDS } from '@containers/Simulator/constants'
import { filterFolders } from '@containers/Simulator/filters'
import SVGLoopBack from '@public/svg/loop_back.svg'
import { useEffect, useMemo, useRef } from 'react'
import HeaderPage from '@containers/HeaderPage'
import CardEmpty from '@components/CardEmpty'
import RoundInfo from '@components/RoundInfo'
import { getDuration } from '@lib/date'
import {useSelector} from 'react-redux'
import Button from '@components/Button'
import { shuffle } from '@lib/array'
import Card from '@components/Card'
import {
  actionContinueSimulators,
  actionRememberSimulators,
  actionRestartSimulators,
  actionFetchSimulators,
  actionStartSimulators,
  actionBackSimulators,
} from '@store/index'
import {
  FoldersType,
  SimulatorsType,
  SimulatorStatus
} from '@store/initial-state'
import clsx from 'clsx'

export default function Simulator({ folderId }: { folderId: string }) {
  useEffect(actionFetchSimulators, [])

  const simulator = useSelector(({ simulators }: { simulators: SimulatorsType }) => simulators[folderId]) || {
    status: SimulatorStatus.WAITING,
    timestamp: null,
    termId: null,
    terms: [],
    historyIds: [],
    rememberIds: [],
    continueIds: []
  }

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders, folderId])

  const activeTerm = useMemo(() => {
    return (folder?.terms || []).find(({ id }) => id === simulator.termId)
  }, [folder, simulator.termId])

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
          actionRestartSimulators({ folderId })
        }
      }, 1000)
      return
    }

    clearInterval(refIntervalId.current)
    return () => {
      clearInterval(refIntervalId.current)
    }
  }, [folderId, simulator.continueIds.length, simulator.status])

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

      if (simulator.timestamp) {
        refTimer.current.innerText = getDuration(simulator.timestamp, Date.now())
      } else {
        refTimer.current.innerText = '00:00:00'
      }
    }, 1000)

    return () => {
      clearInterval(refTimerIntervalId.current)
    }
  }, [simulator.status, simulator.timestamp])

  return (
    <div
      className="flex flex-col px-2 md:px-4 gap-4"
    >
      <HeaderPage
        breadcrumbs={[
          {id: 1, name: 'Home', href: '/'},
          {id: 2, name: 'Folders', href: '/private'},
          {id: 3, name: folder?.name},
        ]}
      />

      <div className="flex flex-col w-full">
        <div className="flex items-center justify-center select-none gap-2">
          <RoundInfo
            title="Terms"
            value={simulator.terms.length}
          />

          <RoundInfo
            title="Queue"
            value={Math.max(simulator.terms.length - simulator.continueIds.length - simulator.rememberIds.length - 1, 0)}
          />

          <RoundInfo
            title="Done"
            value={simulator.rememberIds.length}
          />

          <RoundInfo
            title="Time"
            value={<span ref={refTimer}>00:00:00</span>}
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
                  const items = filterFolders(folder)
                  if (items.length > 0) {
                    actionStartSimulators({folderId, items: shuffle(items)})
                  }
                }}
              >
                Ready
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
                    const items = filterFolders(folder)
                    if (items.length > 0) {
                      actionStartSimulators({folderId, items: shuffle(items)})
                    }
                  }}
                >
                  Ready
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
              answer={activeTerm.answer || ''}
              question={activeTerm.question || ''}
            />

            <div className="gap-2 flex justify-between">
              <Button
                disabled={simulator.historyIds.length === 0}
                onClick={() => {
                  actionBackSimulators({folderId})
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
                  actionRememberSimulators({folderId})
                }}
              >
                Done
              </Button>

              <Button
                className="w-28"
                onClick={() => {
                  actionContinueSimulators({folderId})
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
