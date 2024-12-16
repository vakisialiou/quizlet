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
  id: number
  inverted: boolean
  method: SimulatorMethod

  constructor(settings?: Partial<ClientSettingsSimulatorData>) {
    this.id = settings?.id || 1
    this.inverted = settings?.inverted || false
    this.method = settings?.method || SimulatorMethod.PICK
  }

  setId(value: number) {
    this.id = value
    return this
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
