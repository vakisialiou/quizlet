import ClientSettingsSimulator, { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import { v4 } from 'uuid'

export type ClientSettingsData = {
  id: string
  simulator: ClientSettingsSimulatorData
}

export default class ClientSettings {
  id: string
  simulator: ClientSettingsSimulatorData

  constructor() {
    this.id = v4()
    this.simulator = new ClientSettingsSimulator().serialize()
  }

  setId(id: string): ClientSettings {
    this.id = id
    return this
  }

  setSimulator(simulator: ClientSettingsSimulatorData | null): ClientSettings {
    this.simulator = { ...this.simulator, ...simulator }
    return this
  }

  serialize(): ClientSettingsData {
    return JSON.parse(JSON.stringify(this))
  }
}
