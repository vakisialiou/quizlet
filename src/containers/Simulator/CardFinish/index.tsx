import { actionUpdateSimulator } from '@store/action-main'
import { actionRestart } from '@helper/simulators/actions'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { SimulatorData } from '@entities/Simulator'
import Button from '@components/Button'

export default function SingleQueueFinish(
  {
    editable,
    simulator
  }:
  {
    editable: boolean,
    simulator: SimulatorData,
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
            onClick={() => {
              actionUpdateSimulator({
                editable,
                simulator: actionRestart(simulator)
              })
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </CardEmpty>
  )
}
