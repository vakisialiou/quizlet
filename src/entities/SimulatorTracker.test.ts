import SimulatorSettings, { SimulatorMethod } from '@entities/SimulatorSettings'
import Simulator, { SimulatorStatus } from '@entities/Simulator'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import SimulatorTracker from '@entities/SimulatorTracker'

describe('SimulatorTracker methods', () => {
  const termIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

  describe(`Simulator method ${SimulatorMethod.PICK}`, () => {
    const simulator = new Simulator(SimulatorStatus.PROCESSING)
    simulator.setTermIds(termIds)
    simulator.setSettings(
      new SimulatorSettings()
        .setMethod(SimulatorMethod.PICK)
        .serialize()
    )

    it(`should return calculated error rate 100% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.success, '1')
      tracker.calculate(ProgressTrackerAction.success, '2')
      tracker.calculate(ProgressTrackerAction.success, '3')
      tracker.calculate(ProgressTrackerAction.success, '4')
      tracker.calculate(ProgressTrackerAction.success, '5')

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(0)
    })

    it(`should return calculated error rate 50% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(45.45454545454545)
    })

    it(`should return calculated error rate 0% success`, () => {
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

      expect(tracker.getErrorRate()).toBe(90.90909090909092)
    })

    it(`should return calculated error rate 100% error 100% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')

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

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(81.81818181818186)
    })
  })

  describe(`Simulator type ${SimulatorMethod.FLASHCARD}`, () => {
    const simulator = new Simulator(SimulatorStatus.PROCESSING)
    simulator.setTermIds(termIds)
    simulator.setSettings(
      new SimulatorSettings()
        .setMethod(SimulatorMethod.FLASHCARD)
        .serialize()
    )

    it(`should return calculated error rate 100% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.success, '1')
      tracker.calculate(ProgressTrackerAction.success, '2')
      tracker.calculate(ProgressTrackerAction.success, '3')
      tracker.calculate(ProgressTrackerAction.success, '4')
      tracker.calculate(ProgressTrackerAction.success, '5')

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(0)
    })

    it(`should return calculated error rate 50% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(39.130434782608695)
    })

    it(`should return calculated error rate 0% success`, () => {
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

      expect(tracker.getErrorRate()).toBe(78.26086956521739)
    })

    it(`should return calculated error rate 100% error 100% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')

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

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(56.52173913043481)
    })
  })

  describe(`Simulator type ${SimulatorMethod.INPUT}`, () => {
    const simulator = new Simulator(SimulatorStatus.PROCESSING)
    simulator.setTermIds(termIds)
    simulator.setSettings(
      new SimulatorSettings()
        .setMethod(SimulatorMethod.INPUT)
        .serialize()
    )

    it(`should return calculated error rate 100% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.success, '1')
      tracker.calculate(ProgressTrackerAction.success, '2')
      tracker.calculate(ProgressTrackerAction.success, '3')
      tracker.calculate(ProgressTrackerAction.success, '4')
      tracker.calculate(ProgressTrackerAction.success, '5')

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(0)
    })

    it(`should return calculated error rate 50% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(34.78260869565217)
    })

    it(`should return calculated error rate 0% success`, () => {
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

      expect(tracker.getErrorRate()).toBe(69.56521739130436)
    })

    it(`should return calculated error rate 100% error 100% success`, () => {
      const tracker = new SimulatorTracker(simulator)

      tracker.calculate(ProgressTrackerAction.error, '1')
      tracker.calculate(ProgressTrackerAction.error, '2')
      tracker.calculate(ProgressTrackerAction.error, '3')
      tracker.calculate(ProgressTrackerAction.error, '4')
      tracker.calculate(ProgressTrackerAction.error, '5')

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

      tracker.calculate(ProgressTrackerAction.success, '6')
      tracker.calculate(ProgressTrackerAction.success, '7')
      tracker.calculate(ProgressTrackerAction.success, '8')
      tracker.calculate(ProgressTrackerAction.success, '9')
      tracker.calculate(ProgressTrackerAction.success, '10')

      expect(tracker.getErrorRate()).toBe(39.13043478260871)
    })
  })
})
