import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import SingleQueueFinish from '@containers/Simulator/SingleQueueFinish'
import SingleQueueStart from '@containers/Simulator/SingleQueueStart'
import SingleQueueDone from '@containers/Simulator/SingleQueueDone'
import Card, { onRollCallback } from '@containers/Simulator/Card'
import {ClientFolderData} from '@entities/ClientFolder'
import Button, { ButtonSkin } from '@components/Button'
import { useMemo, memo } from 'react'
import {
  actionContinueSimulators,
  actionRememberSimulators,
} from '@store/index'

function SingleQueue(
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

  const faceSide = {
    association: activeTerm?.association || null,
    text: simulator.settings.inverted ? activeTerm?.answer : activeTerm?.question,
    lang: simulator.settings.inverted ? activeTerm?.answerLang : activeTerm?.questionLang
  }

  const backSide = {
    association: activeTerm?.association || null,
    text: simulator.settings.inverted ? activeTerm?.question : activeTerm?.answer,
    lang: simulator.settings.inverted ? activeTerm?.questionLang : activeTerm?.answerLang
  }

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
          <Card
            onRoll={onRoll}
            key={activeTerm.id}
            faceSide={faceSide}
            backSide={backSide}
          />

          <div className="gap-2 flex justify-between">
            <Button
              className="w-36"
              skin={ButtonSkin.GREEN_500}
              onClick={() => {
                actionRememberSimulators({ folderId: folder.id })
              }}
            >
              Remember
            </Button>

            <Button
              className="w-36"
              skin={ButtonSkin.WHITE_100}
              onClick={() => {
                actionContinueSimulators({ folderId: folder.id })
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

export default memo(SingleQueue)
