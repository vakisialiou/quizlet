import SimulatorSettings, { SimulatorSettingsData } from '@entities/SimulatorSettings'
import { v4 } from 'uuid'

export type SettingsData = {
  id: string
  simulator: SimulatorSettingsData
}

export default class Settings {
  id: string
  simulator: SimulatorSettingsData

  constructor() {
    this.id = v4()
    this.simulator = new SimulatorSettings().serialize()
  }

  setId(id: string): Settings {
    this.id = id
    return this
  }

  setSimulator(simulator: SimulatorSettingsData | null): Settings {
    this.simulator = { ...this.simulator, ...simulator }
    return this
  }

  serialize(): SettingsData {
    return JSON.parse(JSON.stringify(this))
  }
}
