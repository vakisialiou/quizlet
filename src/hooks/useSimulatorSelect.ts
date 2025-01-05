import { RelationSimulatorData } from '@entities/RelationSimulator'
import { SimulatorData } from '@entities/Simulator'
import { ConfigType } from '@store/initial-state'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

type TypeSimulatorSelect = { relationSimulators: RelationSimulatorData[], simulators: SimulatorData[] }

export function useSimulatorSelect(): TypeSimulatorSelect {
  const simulators = useSelector((state: ConfigType) => state.simulators)
  const relationSimulators = useSelector((state: ConfigType) => state.relationSimulators)

  return useMemo(() => {
    return { simulators, relationSimulators }
  }, [simulators, relationSimulators])
}

