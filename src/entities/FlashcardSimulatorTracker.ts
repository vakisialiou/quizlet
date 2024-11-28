import { ClientSimulatorData } from '@entities/ClientSimulator'
import ProgressTracker from '@entities/ProgressTracker'

export default class FlashcardSimulatorTracker extends ProgressTracker {
  constructor(simulator: ClientSimulatorData) {
    super(simulator, {
      [FlashcardSimulatorTracker.actionContinue]: 1,
      [FlashcardSimulatorTracker.actionRemember]: -0.2,
    })
  }

  static actionContinue = 'continue'
  static actionRemember = 'remember'
}
