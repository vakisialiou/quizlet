import MethodFlashcard from '@containers/Simulator/CardAggregator/MethodFlashcard'
import MethodInputCard from '@containers/Simulator/CardAggregator/MethodInputCard'
import MethodPickCard from '@containers/Simulator/CardAggregator/MethodPickCard'
import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { HelpDataType } from '@containers/Simulator/CardAggregator/types'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import CardFinish from '@containers/Simulator/CardFinish'
import { ClientFolderData } from '@entities/ClientFolder'
import CardStart from '@containers/Simulator/CardStart'
import CardDone from '@containers/Simulator/CardDone'

export type OnChangeParamsType = {
  method: SimulatorMethod,
  helpData?: HelpDataType,
}

export type onChangeCallback = (params: OnChangeParamsType) => void

export default function CardAggregator(
  {
    folder,
    onChange,
    simulator,
  }:
  {
    isBack?: boolean
    folder: ClientFolderData,
    onChange: onChangeCallback,
    simulator: ClientSimulatorData,
  }
) {
  return (
    <div className="flex flex-col gap-2">
      {simulator.status === SimulatorStatus.WAITING &&
        <CardStart folder={folder} />
      }

      {simulator.status === SimulatorStatus.FINISHING &&
        <CardFinish
          folder={folder}
          simulator={simulator}
        />
      }

      {simulator.status === SimulatorStatus.DONE &&
        <CardDone
          folder={folder}
          particlesImage="/images/test-card-1.jpg"
        />
      }

      {simulator.status === SimulatorStatus.PROCESSING &&
        <>
          {SimulatorMethod.FLASHCARD === simulator.settings.method &&
            <MethodFlashcard
              folder={folder}
              simulator={simulator}
              onChange={(helpData) => onChange({ method: simulator.settings.method, helpData })}
            />
          }

          {SimulatorMethod.PICK === simulator.settings.method &&
            <MethodPickCard
              folder={folder}
              simulator={simulator}
              onChange={(helpData) => onChange({ method: simulator.settings.method, helpData })}
            />
          }

          {SimulatorMethod.INPUT === simulator.settings.method &&
            <MethodInputCard
              folder={folder}
              simulator={simulator}
              onSubmit={(helpData) => onChange({ method: simulator.settings.method, helpData })}
            />
          }
        </>
      }
    </div>
  )
}
