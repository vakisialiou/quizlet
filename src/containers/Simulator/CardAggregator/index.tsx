import { SelectionType, SoundType } from '@containers/Simulator/CardAggregator/types'
import MethodFlashcard from '@containers/Simulator/CardAggregator/MethodFlashcard'
import MethodInputCard from '@containers/Simulator/CardAggregator/MethodInputCard'
import MethodPickCard from '@containers/Simulator/CardAggregator/MethodPickCard'
import { SimulatorData, SimulatorStatus } from '@entities/Simulator'
import { SimulatorMethod } from '@entities/SimulatorSettings'
import CardFinish from '@containers/Simulator/CardFinish'
import CardStart from '@containers/Simulator/CardStart'
import CardDone from '@containers/Simulator/CardDone'
import CardFix from '@containers/Simulator/CardFix'
import { RelationProps } from '@helper/relation'
import { TermData } from '@entities/Term'

export default function CardAggregator(
  {
    sound,
    terms,
    active,
    onSkip,
    onSound,
    selected,
    editable,
    relation,
    simulator,
    onSelect
  }:
  {
    isBack?: boolean
    editable: boolean
    sound: SoundType
    terms: TermData[]
    onSkip: () => void
    active: TermData | null
    selected: SelectionType
    relation: RelationProps
    simulator: SimulatorData
    onSound: (value: SoundType) => void
    onSelect: (selected: SelectionType) => void
  }
) {
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

      {!active && simulator.status === SimulatorStatus.PROCESSING &&
        <CardFix
          editable={editable}
          simulator={simulator}
        />
      }

      {active && simulator.status === SimulatorStatus.PROCESSING &&
        <>
          {SimulatorMethod.FLASHCARD === simulator.settings.method &&
            <>
              <MethodFlashcard
                sound={sound}
                key={active.id}
                active={active}
                onSound={onSound}
                simulator={simulator}
              />
            </>
          }

          {SimulatorMethod.PICK === simulator.settings.method &&
            <MethodPickCard
              terms={terms}
              sound={sound}
              key={active.id}
              active={active}
              onSound={onSound}
              selected={selected}
              onSelect={onSelect}
              simulator={simulator}
            />
          }

          {SimulatorMethod.INPUT === simulator.settings.method &&
            <>
              <MethodInputCard
                sound={sound}
                key={active.id}
                active={active}
                onSkip={onSkip}
                onSound={onSound}
                selected={selected}
                onSelect={onSelect}
                simulator={simulator}
              />
            </>
          }
        </>
      }
    </div>
  )
}
