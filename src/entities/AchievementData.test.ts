import ClientSimulator, {ClientSimulatorData, SimulatorStatus} from '@entities/ClientSimulator'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import SimulatorTracker from '@entities/SimulatorTracker'
import Achievement from '@entities/Achievement'

describe('Achievement methods', () => {
  describe(`Simulator method ${SimulatorMethod.PICK}`, () => {
    it('should return calculated error rate 1 simulator 100% errors', () => {
      const termIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

      const simulator = new ClientSimulator('1', SimulatorStatus.DONE, { method: SimulatorMethod.PICK })
        .setTermIds(termIds)

      const tracker = new SimulatorTracker(simulator)
      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')
      tracker.calculate(ProgressTrackerAction.error, '6')
      tracker.calculate(ProgressTrackerAction.error, '7')
      tracker.calculate(ProgressTrackerAction.error, '8')
      tracker.calculate(ProgressTrackerAction.error, '9')
      tracker.calculate(ProgressTrackerAction.error, '10')

      simulator.setTracker(tracker.serialize())

      const simulators = [
        simulator.serialize(),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({ degree: 'preschool', medal: null })
    })
  })

  describe(`Simulator method ${SimulatorMethod.FLASHCARD}`, () => {
    it('should return calculated error rate 1 simulator 100% errors', () => {
      const termIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

      const simulator = new ClientSimulator('1', SimulatorStatus.DONE, { method: SimulatorMethod.FLASHCARD })
        .setTermIds(termIds)

      const tracker = new SimulatorTracker(simulator)
      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')
      tracker.calculate(ProgressTrackerAction.error, '6')
      tracker.calculate(ProgressTrackerAction.error, '7')
      tracker.calculate(ProgressTrackerAction.error, '8')
      tracker.calculate(ProgressTrackerAction.error, '9')
      tracker.calculate(ProgressTrackerAction.error, '10')

      simulator.setTracker(tracker.serialize())

      const simulators = [
        simulator.serialize(),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({ degree: 'preschool', medal: 'silver' })
    })
  })

  describe(`Simulator method ${SimulatorMethod.INPUT}`, () => {
    it('should return calculated error rate 1 simulator 100% errors', () => {
      const termIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

      const simulator = new ClientSimulator('1', SimulatorStatus.DONE, { method: SimulatorMethod.INPUT })
        .setTermIds(termIds)

      const tracker = new SimulatorTracker(simulator)
      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')
      tracker.calculate(ProgressTrackerAction.error, '6')
      tracker.calculate(ProgressTrackerAction.error, '7')
      tracker.calculate(ProgressTrackerAction.error, '8')
      tracker.calculate(ProgressTrackerAction.error, '9')
      tracker.calculate(ProgressTrackerAction.error, '10')

      simulator.setTracker(tracker.serialize())

      const simulators = [
        simulator.serialize(),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({ degree: 'primary', medal: null })
    })
  })

  describe(`Simulator mix`, () => {
    it('should return calculated error rate 3 simulators 100% errors', () => {
      const simulators = [
        createSimulatorError100(SimulatorMethod.PICK),
        createSimulatorError100(SimulatorMethod.FLASHCARD),
        createSimulatorError100(SimulatorMethod.INPUT),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({ degree: 'primary', medal: null })
    })

    it('should return calculated error rate 3 simulators 50% errors', () => {
      const simulators = [
        createSimulatorError50(SimulatorMethod.PICK),
        createSimulatorError50(SimulatorMethod.FLASHCARD),
        createSimulatorError50(SimulatorMethod.INPUT),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({ degree: 'secondary', medal: 'gold' })
    })

    it('should return calculated error rate 3 simulators 50% fixed errors', () => {
      const simulators = [
        createSimulatorError50Fix(SimulatorMethod.PICK),
        createSimulatorError50Fix(SimulatorMethod.FLASHCARD),
        createSimulatorError50Fix(SimulatorMethod.INPUT),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({ degree: 'primary', medal: 'gold' })
    })

    it('should return calculated error rate 3 simulators 100% errors & 3 simulators 50% fixed errors', () => {
      const simulators = [
        createSimulatorError100(SimulatorMethod.PICK),
        createSimulatorError100(SimulatorMethod.FLASHCARD),
        createSimulatorError100(SimulatorMethod.INPUT),
        createSimulatorError50Fix(SimulatorMethod.PICK),
        createSimulatorError50Fix(SimulatorMethod.FLASHCARD),
        createSimulatorError50Fix(SimulatorMethod.INPUT),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({ degree: 'primary', medal: 'bronze' })
    })

    it('should return calculated error rate 3 simulators 100% errors & 3 simulators 50% fixed errors & 3 simulators 50% errors', () => {
      const simulators = [
        createSimulatorError100(SimulatorMethod.PICK),
        createSimulatorError100(SimulatorMethod.FLASHCARD),
        createSimulatorError100(SimulatorMethod.INPUT),
        createSimulatorError50Fix(SimulatorMethod.PICK),
        createSimulatorError50Fix(SimulatorMethod.FLASHCARD),
        createSimulatorError50Fix(SimulatorMethod.INPUT),
        createSimulatorError50(SimulatorMethod.PICK),
        createSimulatorError50(SimulatorMethod.FLASHCARD),
        createSimulatorError50(SimulatorMethod.INPUT),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({ degree: 'secondary', medal: null })
    })
  })
})

function createSimulator(method: SimulatorMethod, callback: (tracker: SimulatorTracker) => SimulatorTracker): ClientSimulatorData {
  const simulator = new ClientSimulator('1', SimulatorStatus.DONE, { method })
    .setTermIds(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])

  const tracker = new SimulatorTracker(simulator)

  simulator.setTracker(callback(tracker).serialize())
  return simulator.serialize()
}

function createSimulatorError100(method: SimulatorMethod): ClientSimulatorData {
  return createSimulator(method, (tracker) => {
    tracker.calculate(ProgressTrackerAction.error, '1')
    tracker.calculate(ProgressTrackerAction.error, '2')
    tracker.calculate(ProgressTrackerAction.error, '3')
    tracker.calculate(ProgressTrackerAction.error, '4')
    tracker.calculate(ProgressTrackerAction.error, '5')
    tracker.calculate(ProgressTrackerAction.error, '6')
    tracker.calculate(ProgressTrackerAction.error, '7')
    tracker.calculate(ProgressTrackerAction.error, '8')
    tracker.calculate(ProgressTrackerAction.error, '9')
    tracker.calculate(ProgressTrackerAction.error, '10')
    return tracker
  })
}

function createSimulatorError50(method: SimulatorMethod): ClientSimulatorData {
  return createSimulator(method, (tracker) => {
    tracker.calculate(ProgressTrackerAction.success, '1')
    tracker.calculate(ProgressTrackerAction.success, '2')
    tracker.calculate(ProgressTrackerAction.success, '3')
    tracker.calculate(ProgressTrackerAction.success, '4')
    tracker.calculate(ProgressTrackerAction.success, '5')

    tracker.calculate(ProgressTrackerAction.error, '6')
    tracker.calculate(ProgressTrackerAction.error, '7')
    tracker.calculate(ProgressTrackerAction.error, '8')
    tracker.calculate(ProgressTrackerAction.error, '9')
    tracker.calculate(ProgressTrackerAction.error, '10')
    return tracker
  })
}

function createSimulatorError50Fix(method: SimulatorMethod): ClientSimulatorData {
  return createSimulator(method, (tracker) => {
    tracker.calculate(ProgressTrackerAction.error, '1')
    tracker.calculate(ProgressTrackerAction.error, '2')
    tracker.calculate(ProgressTrackerAction.error, '3')
    tracker.calculate(ProgressTrackerAction.error, '4')
    tracker.calculate(ProgressTrackerAction.error, '5')

    // Fix
    tracker.calculate(ProgressTrackerAction.success, '1')
    tracker.calculate(ProgressTrackerAction.success, '2')
    tracker.calculate(ProgressTrackerAction.success, '3')
    tracker.calculate(ProgressTrackerAction.success, '4')
    tracker.calculate(ProgressTrackerAction.success, '5')

    tracker.calculate(ProgressTrackerAction.error, '6')
    tracker.calculate(ProgressTrackerAction.error, '7')
    tracker.calculate(ProgressTrackerAction.error, '8')
    tracker.calculate(ProgressTrackerAction.error, '9')
    tracker.calculate(ProgressTrackerAction.error, '10')
    return tracker
  })
}
