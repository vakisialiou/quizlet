import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'

export type SimulatorsInfo = {
  hasActive: boolean,
  countDone: number
}
export const getSimulatorsInfo = (simulators: ClientSimulatorData[]): SimulatorsInfo => {
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
