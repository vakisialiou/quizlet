import Flashcard from '@containers/Simulator/CardAggregator/MethodFlashcard/Flashcard'
import { SoundType } from '@containers/Simulator/CardAggregator/types'
import { getSimulatorNameById } from '@containers/Simulator/constants'
import { SimulatorData } from '@entities/Simulator'
import { useMemo, useState } from 'react'
import { TermData } from '@entities/Term'

export default function MethodFlashcard(
  {
    sound,
    active,
    onSound,
    simulator,
  }:
  {
    active: TermData,
    sound: SoundType
    simulator: SimulatorData,
    onSound?: (value: SoundType) => void,
  }
) {
  const [ isBackSide, setIsBackSide ] = useState(false)

  const { inverted } = simulator.settings

  const signature = useMemo(() => {
    return getSimulatorNameById(simulator.settings.id)
  }, [simulator.settings.id])

  return (
    <Flashcard
      term={active}
      sound={sound}
      onSound={onSound}
      inverted={inverted}
      className="w-72 h-96"
      signature={signature}
      isBackSide={isBackSide}
      onClick={() => {
        setIsBackSide((prevState) => !prevState)
      }}
    />
  )
}
