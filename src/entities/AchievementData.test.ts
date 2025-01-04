import Simulator, { SimulatorData, SimulatorStatus} from '@entities/Simulator'
import { SimulatorMethod } from '@entities/SimulatorSettings'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import SimulatorTracker from '@entities/SimulatorTracker'
import Achievement from '@entities/Achievement'

describe('Achievement', () => {
  it('should calculate different rates for each method. 100% errors', function () {
    expect(new Achievement().getRate([
      createSimulatorError100(SimulatorMethod.PICK, true),
    ])).toStrictEqual(1.5151515151515134)

    expect(new Achievement().getRate([
      createSimulatorError100(SimulatorMethod.FLASHCARD, true),
    ])).toStrictEqual(3.623188405797102)

    expect(new Achievement().getRate([
      createSimulatorError100(SimulatorMethod.INPUT, true),
    ])).toStrictEqual(5.072463768115941)
  })

  it('should calculate same rates for each method. 100% success', function () {
    expect(new Achievement().getRate([
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
    ])).toStrictEqual(16.666666666666668)

    expect(new Achievement().getRate([
      createSimulatorSuccess100(SimulatorMethod.FLASHCARD, true),
    ])).toStrictEqual(16.666666666666668)

    expect(new Achievement().getRate([
      createSimulatorSuccess100(SimulatorMethod.INPUT, true),
    ])).toStrictEqual(16.666666666666668)

    expect(new Achievement().getRate([
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, false),
      createSimulatorSuccess100(SimulatorMethod.FLASHCARD, true),
      createSimulatorSuccess100(SimulatorMethod.FLASHCARD, false),
      createSimulatorSuccess100(SimulatorMethod.INPUT, true),
      createSimulatorSuccess100(SimulatorMethod.INPUT, false),
    ])).toStrictEqual(100)
  })

  it('should calculate rate. 100% errors', function () {
    expect(new Achievement().getRate([
      createSimulatorError100(SimulatorMethod.PICK, true),
    ])).toStrictEqual(1.5151515151515134)

    expect(new Achievement().getRate([
      createSimulatorError100(SimulatorMethod.PICK, true),
      createSimulatorError100(SimulatorMethod.PICK, true),
      createSimulatorError100(SimulatorMethod.PICK, true),
      createSimulatorError100(SimulatorMethod.PICK, true),
      createSimulatorError100(SimulatorMethod.PICK, true),
      createSimulatorError100(SimulatorMethod.PICK, true),
      createSimulatorError100(SimulatorMethod.PICK, true),
      createSimulatorError100(SimulatorMethod.PICK, true),
    ])).toStrictEqual(1.7803030303030278)

    expect(new Achievement().getRate([
      createSimulatorError100(SimulatorMethod.FLASHCARD, true),
    ])).toStrictEqual(3.623188405797102)

    expect(new Achievement().getRate([
      createSimulatorError100(SimulatorMethod.INPUT, true),
    ])).toStrictEqual(5.072463768115941)
  })

  it('should calculate rate. 50% errors', function () {
    expect(new Achievement().getRate([
      createSimulatorError50(SimulatorMethod.PICK, true),
    ])).toStrictEqual(9.090909090909092)

    expect(new Achievement().getRate([
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorError50(SimulatorMethod.PICK, true),
    ])).toStrictEqual(10.681818181818183)
  })

  it('should calculate rate. 100% success', function () {
    expect(new Achievement().getRate([
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
    ])).toStrictEqual(16.666666666666668)

    expect(new Achievement().getRate([
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, true),
    ])).toStrictEqual(16.666666666666668)
  })

  it('should calculate rate. Mix', function () {
    expect(new Achievement().getRate([
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, false),
    ])).toStrictEqual(25.757575757575758)

    expect(new Achievement().getRate([
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, false),
      createSimulatorError50(SimulatorMethod.FLASHCARD, true),
      createSimulatorError50(SimulatorMethod.FLASHCARD, false),
    ])).toStrictEqual(46.04743083003953)

    expect(new Achievement().getRate([
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, false),
      createSimulatorError50(SimulatorMethod.FLASHCARD, true),
      createSimulatorError50(SimulatorMethod.FLASHCARD, false),
      createSimulatorSuccess100(SimulatorMethod.INPUT, true),
      createSimulatorSuccess100(SimulatorMethod.INPUT, false),
    ])).toStrictEqual(79.38076416337287)

    expect(new Achievement().getRate([
      createSimulatorError50(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.PICK, false),
      createSimulatorError50(SimulatorMethod.FLASHCARD, true),
      createSimulatorError50(SimulatorMethod.FLASHCARD, false),
      createSimulatorSuccess100(SimulatorMethod.INPUT, true),
      createSimulatorSuccess100(SimulatorMethod.INPUT, false),

      createSimulatorSuccess100(SimulatorMethod.PICK, true),
      createSimulatorSuccess100(SimulatorMethod.FLASHCARD, true),
      createSimulatorSuccess100(SimulatorMethod.FLASHCARD, false),
    ])).toStrictEqual(91.10704874835312)
  })

})

function createSimulator(method: SimulatorMethod, inverted: boolean, callback: (tracker: SimulatorTracker) => SimulatorTracker): SimulatorData {
  const simulator = new Simulator('1', SimulatorStatus.DONE, { method, inverted })
    .setTermIds(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])

  const tracker = new SimulatorTracker(simulator)

  simulator.setTracker(callback(tracker).serialize())
  return simulator.serialize()
}

function createSimulatorSuccess100(method: SimulatorMethod, inverted: boolean, ): SimulatorData {
  return createSimulator(method, inverted, (tracker) => {
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
    return tracker
  })
}

function createSimulatorError100(method: SimulatorMethod, inverted: boolean): SimulatorData {
  return createSimulator(method, inverted, (tracker) => {
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

function createSimulatorError50(method: SimulatorMethod, inverted: boolean): SimulatorData {
  return createSimulator(method, inverted, (tracker) => {
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
