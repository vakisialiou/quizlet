import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import {PAUSE_SECONDS} from '@containers/Simulator/constants'
import {ClientFolderData} from '@entities/ClientFolder'
import Button, { ButtonSkin } from '@components/Button'
import { useEffect, useMemo, useRef } from 'react'
// import { getDuration } from '@lib/date'
import {
  actionContinueSimulators,
  actionRememberSimulators,
  actionRestartSimulators,
} from '@store/index'

import SingleQueueFinish from '@containers/Simulator/SingleQueueFinish'
import SingleQueueStart from '@containers/Simulator/SingleQueueStart'
import SingleQueueDone from '@containers/Simulator/SingleQueueDone'
import Card, { onRollCallback } from '@containers/Simulator/Card'

export default function SingleQueue(
  {
    onRoll,
    folder,
    simulator
  }: {
    onRoll: onRollCallback
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

  // const refTimer = useRef<HTMLDivElement|null>(null)
  // const refTimerIntervalId = useRef<NodeJS.Timeout|number|undefined>(undefined)
  //
  // useEffect(() => {
  //   clearInterval(refTimerIntervalId.current)
  //   refTimerIntervalId.current = setInterval(() => {
  //     if (simulator.status === SimulatorStatus.WAITING) {
  //       return
  //     }
  //
  //     if (simulator.status === SimulatorStatus.FINISHING) {
  //       return
  //     }
  //
  //     if (!refTimer.current) {
  //       return
  //     }
  //
  //     if (simulator.duration === 0) {
  //       refTimer.current.innerText = '00:00:00'
  //     } else {
  //       refTimer.current.innerText = getDuration(simulator.duration || 0)
  //     }
  //   }, 1000)
  //
  //   return () => {
  //     clearInterval(refTimerIntervalId.current)
  //   }
  // }, [simulator.status, simulator.duration])

  const activeTerm = useMemo(() => {
    return (folder?.terms || []).find(({ id }) => id === simulator.termId)
  }, [folder, simulator.termId])

  return (
    <div className="flex flex-col gap-2">

      {simulator.status === SimulatorStatus.WAITING &&
        <SingleQueueStart folder={folder} />
      }

      {simulator.status === SimulatorStatus.FINISHING &&
        <SingleQueueFinish>
          <div className="text-gray-500 text-lg" ref={ref}>
            {PAUSE_SECONDS} sec
          </div>
        </SingleQueueFinish>
      }

      {simulator.status === SimulatorStatus.DONE &&
        <SingleQueueDone folder={folder} />
      }

      {simulator.status === SimulatorStatus.PROCESSING && activeTerm &&
        <>
          <Card onRoll={onRoll} key={activeTerm.id} term={activeTerm} />

          <div className="gap-2 flex justify-between">
            <Button
              className="w-36"
              skin={ButtonSkin.GREEN_500}
              onClick={() => {
                actionRememberSimulators({folderId: folder.id})
              }}
            >
              Remember
            </Button>

            <Button
              className="w-36"
              skin={ButtonSkin.WHITE_100}
              onClick={() => {
                actionContinueSimulators({folderId: folder.id})
              }}
            >
              Continue
            </Button>
          </div>
        </>
      }
    </div>
  )
}
