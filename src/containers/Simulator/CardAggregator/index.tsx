import { CardSelection } from '@containers/Simulator/CardAggregator/MethodPickCard/PickCard'
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
import { useMemo } from 'react'

export type OnChangeParamsType = {
  method: SimulatorMethod,
  helpData?: HelpDataType,
}

export default function CardAggregator(
  {
    folder,
    onSound,
    onChange,
    simulator,
    soundSelection
  }:
  {
    isBack?: boolean
    folder: ClientFolderData,
    simulator: ClientSimulatorData,
    soundSelection: CardSelection | null
    onChange: (params: OnChangeParamsType) => void,
    onSound: (selection: CardSelection | null) => void,
  }
) {
  const terms = useMemo(() => [...folder?.terms || []], [folder?.terms])

  const activeTerm = useMemo(() => {
    return terms.find(({ id }) => id === simulator.termId)
  }, [terms, simulator.termId])

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
              key={activeTerm?.id}
              simulator={simulator}
              activeTerm={activeTerm}
              onChange={(helpData) => onChange({ method: simulator.settings.method, helpData })}
            />
          }

          {SimulatorMethod.PICK === simulator.settings.method &&
            <MethodPickCard
              terms={terms}
              onSound={onSound}
              key={activeTerm?.id}
              simulator={simulator}
              activeTerm={activeTerm}
              soundSelection={soundSelection}
              onChange={(helpData) => onChange({ method: simulator.settings.method, helpData })}
            />
          }

          {SimulatorMethod.INPUT === simulator.settings.method &&
            <MethodInputCard
              terms={terms}
              key={activeTerm?.id}
              simulator={simulator}
              activeTerm={activeTerm}
              onSubmit={(helpData) => onChange({ method: simulator.settings.method, helpData })}
            />
          }
        </>
      }
    </div>
  )
}
