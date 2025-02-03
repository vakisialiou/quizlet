import InputCard from '@containers/Simulator/CardAggregator/MethodInputCard/InputCard'
import { getSimulatorNameById } from '@containers/Simulator/constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SimulatorData } from '@entities/Simulator'
import { TermData } from '@entities/Term'
import {
  CardStatus, SelectionType, SoundType,
} from '@containers/Simulator/CardAggregator/types'

export default function MethodInputCard(
  {
    sound,
    active,
    onSkip,
    onSound,
    selected,
    onSelect,
    simulator,
  }:
  {
    active: TermData
    sound: SoundType
    onSkip: () => void
    selected: SelectionType
    simulator: SimulatorData
    onSound?: (value: SoundType) => void
    onSelect: (selected: SelectionType) => void
  }
)
{
  const { inverted } = simulator.settings

  const signature = useMemo(() => {
    return getSimulatorNameById(simulator.settings.id)
  }, [simulator.settings.id])

  const [value, setValue] = useState('')

  useEffect(() => {
    setValue('')
  }, [active.id])

  const check = useCallback((inputValue: string, originValue: string) => {
    let normalizedInput = inputValue.toLowerCase()
    let normalizedOrigin = originValue.toLowerCase()

    normalizedInput = normalizedInput.trim()
    normalizedOrigin = normalizedOrigin.trim()

    return normalizedInput === normalizedOrigin ? CardStatus.success : CardStatus.error
  }, [])

  return (
    <InputCard
      sound={sound}
      term={active}
      value={value}
      onSkip={onSkip}
      onSound={onSound}
      inverted={inverted}
      className="w-72 h-96"
      signature={signature}
      simulator={simulator}
      status={selected.status}
      onChange={(e) => setValue(e.target.value)}
      onApprove={() => {
        const originValue = (inverted ? active.question : active.answer) || ''
        onSelect({ term: active, status: check(value, originValue) })
      }}
    />
  )
}
