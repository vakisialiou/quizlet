import { ClientSimulatorData } from '@entities/Simulator'
import { ClientFolderData } from '@entities/Folder'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { actionRestartSimulators } from '@store/index'
import Button from '@components/Button'

export default function SingleQueueFinish(
  {
    folder,
    editable,
    simulator
  }:
  {
    editable: boolean,
    folder: ClientFolderData,
    simulator: ClientSimulatorData,
  }
) {
  return (
    <CardEmpty>
      <div className="flex flex-col justify-center text-center gap-2">
        <h3 className="text-gray-300 text-lg">
          Good job!
        </h3>

        <h3 className="text-gray-500 text-sm">
          {simulator.continueIds.length} terms left to learn
        </h3>

        <div className="text-gray-500 text-lg">
          <Button
            onClick={() => actionRestartSimulators({ folderId: folder.id, editable })}
          >
            Continue
          </Button>
        </div>
      </div>
    </CardEmpty>
  )
}
