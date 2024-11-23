export enum SimulatorMethod {
  single = 'single',
}

export type ClientSettingsSimulatorData = {
  method: SimulatorMethod,
  inverted: boolean
}

export default class ClientSettingsSimulator {
  method: SimulatorMethod
  inverted: boolean

  constructor() {
    this.inverted = false
    this.method = SimulatorMethod.single
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
