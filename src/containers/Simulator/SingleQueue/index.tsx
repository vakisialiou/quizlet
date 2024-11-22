import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import SingleQueueFinish from '@containers/Simulator/SingleQueueFinish'
import SingleQueueStart from '@containers/Simulator/SingleQueueStart'
import SingleQueueDone from '@containers/Simulator/SingleQueueDone'
import Card, { onRollCallback } from '@containers/Simulator/Card'
import {ClientFolderData} from '@entities/ClientFolder'
import Button, { ButtonSkin } from '@components/Button'
import { useMemo } from 'react'
import {
  actionContinueSimulators,
  actionRememberSimulators,
} from '@store/index'

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

  const activeTerm = useMemo(() => {
    return (folder?.terms || []).find(({ id }) => id === simulator.termId)
  }, [folder, simulator.termId])

  return (
    <div className="flex flex-col gap-2">

      {simulator.status === SimulatorStatus.WAITING &&
        <SingleQueueStart folder={folder} />
      }

      {simulator.status === SimulatorStatus.FINISHING &&
        <SingleQueueFinish
          folder={folder}
          simulator={simulator}
        />
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
