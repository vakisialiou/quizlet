import ClientSimulator, { SimulatorStatus, SimulatorType } from '@entities/ClientSimulator'
import Achievement from '@entities/Achievement'

describe('Achievement', () => {
  it('should return calculate achievements 1', () => {
    const simulators = [
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(10)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(30)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(40)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(45)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(55)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(90)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(96)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.FLASHCARD)
        .setProgress(100)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.PICK)
        .setProgress(70)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.PICK)
        .setProgress(80)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.PICK)
        .setProgress(90)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(70)
        .serialize(),
      new ClientSimulator('1', SimulatorStatus.DONE)
        .setType(SimulatorType.INPUT)
        .setProgress(80)
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
