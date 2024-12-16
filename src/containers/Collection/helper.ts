import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'

export const getSimulatorsInfo = (simulators: ClientSimulatorData[]): { hasActive: boolean, countDone: number } => {
  let countDone = 0
  let hasActive = false
  for (const {active, status} of simulators) {
    if (active) {
      hasActive = true
    }
    if (!active && status === SimulatorStatus.DONE) {
      countDone++
    }
  }
  return { countDone, hasActive }
}
