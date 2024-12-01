import { ClientSimulatorData } from '@entities/ClientSimulator'
import ProgressTracker from '@entities/ProgressTracker'

export enum SimulatorTrackerAction {
  actionPickSuccess = 'pick-success',
  actionPickError = 'pick-error',

  actionFlashcardContinue = 'flashcard-continue',
  actionFlashcardRemember = 'flashcard-remember',

  actionInputSuccess = 'input-success',
  actionInputError = 'input-error',
}

export default class SimulatorTracker extends ProgressTracker {
  constructor(simulator: ClientSimulatorData) {
    super(simulator, {
      [SimulatorTrackerAction.actionPickError]: 0.5,
      [SimulatorTrackerAction.actionPickSuccess]: -0.05,

      [SimulatorTrackerAction.actionFlashcardContinue]: 1,
      [SimulatorTrackerAction.actionFlashcardRemember]: -0.2,

      [SimulatorTrackerAction.actionInputError]: 2,
      [SimulatorTrackerAction.actionInputSuccess]: -0.5,
    })
  }
}
