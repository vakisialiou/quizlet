export enum SimulatorMethod {
  PICK = 'pick',
  INPUT = 'input',
  FLASHCARD = 'flashcard',
}

export type ClientSettingsSimulatorData = {
  id: number
  inverted: boolean
  method: SimulatorMethod
}

export default class ClientSettingsSimulator {
  method: SimulatorMethod
  inverted: boolean

  constructor() {
    this.inverted = false
    this.method = SimulatorMethod.FLASHCARD
  }

  setInverted(value: boolean): ClientSettingsSimulator {
    this.inverted = value
    return this
  }

  setMethod(value: SimulatorMethod): ClientSettingsSimulator {
    this.method = value
    return this
  }

  serialize(): ClientSettingsSimulatorData {
    return JSON.parse(JSON.stringify(this))
  }
}
