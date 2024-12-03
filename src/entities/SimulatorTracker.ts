import ProgressTracker, { ProgressTrackerAction } from '@entities/ProgressTracker'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import { ClientSimulatorData } from '@entities/ClientSimulator'

const weights = {
  [SimulatorMethod.PICK]: {
    [ProgressTrackerAction.error]: 100,
    [ProgressTrackerAction.success]: -10,
  },
  [SimulatorMethod.FLASHCARD]: {
    [ProgressTrackerAction.error]: 90,
    [ProgressTrackerAction.success]: -25,
  },
  [SimulatorMethod.INPUT]: {
    [ProgressTrackerAction.error]: 80,
    [ProgressTrackerAction.success]: -35,
  }
}

export default class SimulatorTracker extends ProgressTracker {
  constructor(simulator: Partial<ClientSimulatorData>) {
    super(weights[simulator?.settings?.method || SimulatorMethod.FLASHCARD], simulator)
  }
}
