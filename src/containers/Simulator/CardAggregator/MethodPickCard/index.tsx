import PickCard from '@containers/Simulator/CardAggregator/MethodPickCard/PickCard'
import { CardStatus, SelectionType } from '@containers/Simulator/CardAggregator/types'
import { getSimulatorNameById } from '@containers/Simulator/constants'
import { SimulatorData } from '@entities/Simulator'
import { findTermsByIds } from '@helper/terms'
import { TermData } from '@entities/Term'
import { useMemo } from 'react'

export default function MethodPickCard(
  {
    terms,
    sound,
    active,
    onSound,
    selected,
    onSelect,
    simulator
  }:
  {
    terms: TermData[]
    active: TermData
    sound: TermData | null
    selected: SelectionType,
    simulator: SimulatorData
    onSound: (term: TermData) => void
    onSelect: (selected: SelectionType) => void
  }
) {
  const { inverted } = simulator.settings

  const selections = useMemo(() => {
    return findTermsByIds(terms, simulator.settings.extra.termIds || [])
  }, [terms, simulator.settings.extra.termIds])

  const signature = useMemo(() => {
    return getSimulatorNameById(simulator.settings.id)
  }, [simulator.settings.id])

  return (
    <PickCard
      term={active}
      sound={sound}
      onSound={onSound}
      inverted={inverted}
      className="w-72 h-96"
      signature={signature}
      selected={selected}
      selections={selections}
      onSelect={(term) => {
        onSelect({
          term,
          status: term.id === active?.id ? CardStatus.success : CardStatus.error
        })
      }}
    />
  )
}
