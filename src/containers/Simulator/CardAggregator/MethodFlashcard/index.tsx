import Flashcard from '@containers/Simulator/CardAggregator/MethodFlashcard/Flashcard'
import { getSimulatorNameById } from '@containers/Simulator/constants'
import { SimulatorData } from '@entities/Simulator'
import { useMemo, useState } from 'react'
import { TermData } from '@entities/Term'

export default function MethodFlashcard(
  {
    active,
    simulator,
  }:
  {
    active: TermData,
    simulator: SimulatorData,
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
