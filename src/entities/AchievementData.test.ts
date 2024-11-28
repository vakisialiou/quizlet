import ClientSimulator, { SimulatorStatus, SimulatorType } from '@entities/ClientSimulator'
import Achievement from '@entities/Achievement'

describe('Achievement', () => {
  it('should return calculate achievements 1', () => {
    const simulators = [
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(60)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(90)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(95)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(94)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(99)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.PICK)
        .setProgress(90)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(90)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(90)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(100)
        .serialize(),
    ]

    console.log(new Achievement().calculate(simulators))
    // expect(sum(2, 3)).toBe(5);
  })
})
