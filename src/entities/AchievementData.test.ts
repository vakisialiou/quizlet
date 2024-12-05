import ClientSimulator, {ClientSimulatorData, SimulatorStatus} from '@entities/ClientSimulator'
import Achievement, { DegreeEnum, MedalEnum } from '@entities/Achievement'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import SimulatorTracker from '@entities/SimulatorTracker'

describe('Achievement', () => {
  describe(`Simulator method ${SimulatorMethod.PICK}`, () => {
    it('should return calculated error rate 1 simulator 100% errors', () => {
      const simulators = [
        createSimulatorError100(SimulatorMethod.PICK)
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({
        degree: DegreeEnum.beginner,
        degreeRate: 9.09090909090908,
        medal: null,
        medalRate: 9.090909090909065,
      })
    })
  })

  describe(`Simulator method ${SimulatorMethod.FLASHCARD}`, () => {
    it('should return calculated error rate 1 simulator 100% errors', () => {
      const simulators = [
        createSimulatorError100(SimulatorMethod.FLASHCARD)
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({
        degree: DegreeEnum.beginner,
        degreeRate: 21.73913043478261,
        medal: null,
        medalRate: 37.19806763285024,
      })
    })
  })

  describe(`Simulator method ${SimulatorMethod.INPUT}`, () => {
    it('should return calculated error rate 1 simulator 100% errors', () => {
      const simulators = [
        createSimulatorError100(SimulatorMethod.INPUT)
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({
        degree: DegreeEnum.beginner,
        degreeRate: 30.43478260869564,
        medal: MedalEnum.bronze,
        medalRate: 56.52173913043475,
      })
    })
  })

  describe(`Simulator mix`, () => {
    it('should return calculated error rate 3 simulators 100% errors', () => {
      const simulators = [
        createSimulatorError100(SimulatorMethod.PICK),
        createSimulatorError100(SimulatorMethod.FLASHCARD),
        createSimulatorError100(SimulatorMethod.INPUT),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({
        degree: DegreeEnum.beginner,
        degreeRate: 27.45515354211006,
        medal: null,
        medalRate: 49.90034120468903,
      })
    })

    it('should return calculated error rate 3 simulators 50% errors', () => {
      const simulators = [
        createSimulatorError50(SimulatorMethod.PICK),
        createSimulatorError50(SimulatorMethod.FLASHCARD),
        createSimulatorError50(SimulatorMethod.INPUT),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({
        degree: DegreeEnum.learner,
        degreeRate: 63.72757677105503,
        medal: MedalEnum.silver,
        medalRate: 91.51717847370018,
      })
    })

    it('should return calculated error rate 3 simulators 50% fixed errors', () => {
      const simulators = [
        createSimulatorError50Fix(SimulatorMethod.PICK),
        createSimulatorError50Fix(SimulatorMethod.FLASHCARD),
        createSimulatorError50Fix(SimulatorMethod.INPUT),
      ]

      expect(new Achievement().calculate(simulators)).toStrictEqual({
        degree: DegreeEnum.beginner,
        degreeRate: 41.182730313165095,
        medal: MedalEnum.silver,
        medalRate: 80.4060673625891,
      })
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

      expect(new Achievement().calculate(simulators)).toStrictEqual({
        degree: DegreeEnum.beginner,
        degreeRate: 34.318941927637574,
        medal: MedalEnum.bronze,
        medalRate: 65.15320428363906,
      })
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

      expect(new Achievement().calculate(simulators)).toStrictEqual({
        degree: DegreeEnum.beginner,
        degreeRate: 44.121820208776725,
        medal: MedalEnum.silver,
        medalRate: 86.93737824172607,
      })
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
