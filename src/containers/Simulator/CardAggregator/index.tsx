import { CardSelection } from '@containers/Simulator/CardAggregator/MethodPickCard/PickCard'
import MethodFlashcard from '@containers/Simulator/CardAggregator/MethodFlashcard'
import MethodInputCard from '@containers/Simulator/CardAggregator/MethodInputCard'
import MethodPickCard from '@containers/Simulator/CardAggregator/MethodPickCard'
import { HelpDataType } from '@containers/Simulator/CardAggregator/types'
import { SimulatorData, SimulatorStatus } from '@entities/Simulator'
import { SimulatorMethod } from '@entities/SimulatorSettings'
import CardFinish from '@containers/Simulator/CardFinish'
import { useMainSelector } from '@hooks/useMainSelector'
import CardStart from '@containers/Simulator/CardStart'
import CardDone from '@containers/Simulator/CardDone'
import { RelationProps } from '@helper/relation'
import { useMemo } from 'react'

export type OnChangeParamsType = {
  method: SimulatorMethod,
  helpData?: HelpDataType,
}

export default function CardAggregator(
  {
    relation,
    onSound,
    onChange,
    simulator,
    editable,
    soundSelection
  }:
  {
    isBack?: boolean
    editable: boolean
    relation: RelationProps
    simulator: SimulatorData
    soundSelection: CardSelection | null
    onChange: (params: OnChangeParamsType) => void
    onSound: (selection: CardSelection | null) => void
  }
) {
  const terms = useMainSelector(({ terms }) => terms)

  const activeTerm = useMemo(() => {
    return terms.find(({ id }) => id === simulator.termId)
  }, [terms, simulator.termId])

  return (
    <div className="flex flex-col gap-2">
      {simulator.status === SimulatorStatus.WAITING &&
        <CardStart
          editable={editable}
          relation={relation}
        />
      }

      {simulator.status === SimulatorStatus.FINISHING &&
        <CardFinish
          editable={editable}
          simulator={simulator}
        />
      }

      {simulator.status === SimulatorStatus.DONE &&
        <CardDone
          editable={editable}
          relation={relation}
          simulator={simulator}
          particlesImage="linear-gradient(180deg, rgba(230,233,233,1) 0%, rgba(230,233,233,1) 10%, rgba(34,139,34,1) 70%, rgba(34,139,34,1) 100%)"
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
