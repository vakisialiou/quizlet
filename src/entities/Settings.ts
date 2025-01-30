import SimulatorSettings, { SimulatorSettingsData } from '@entities/SimulatorSettings'
import { ORDER_DEFAULT, OrderEnum } from '@helper/sort'
import { MarkersEnum } from '@entities/Marker'
import { v4 } from 'uuid'

export type ModuleFilters = {
  marker: MarkersEnum | null
}

export type ModuleSettings = {
  order: OrderEnum
  filter: ModuleFilters,
}

export type SettingsData = {
  id: string
  modules: ModuleSettings
  simulator: SimulatorSettingsData
}

export default class Settings {
  id: string
  modules: ModuleSettings
  simulator: SimulatorSettingsData

  constructor() {
    this.id = v4()
    this.modules = {
      order: ORDER_DEFAULT,
      filter: { marker: null }
    }
    this.simulator = new SimulatorSettings().serialize()
  }

  setId(id: string): Settings {
    this.id = id
    return this
  }

  setSimulator(value: SimulatorSettingsData | null): Settings {
    this.simulator = { ...this.simulator, ...value }
    return this
  }

  setModules(value: ModuleSettings | null): Settings {
    this.modules = { ...this.modules, ...value }
    return this
  }

  setModulesOrder(order: OrderEnum): Settings {
    this.modules.order = order
    return this
  }

  setModulesFilter(filter: ModuleFilters): Settings {
    this.modules.filter = filter
    return this
  }

  serialize(): SettingsData {
    return JSON.parse(JSON.stringify(this))
  }
}
