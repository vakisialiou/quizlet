import SimulatorSettings, { SimulatorSettingsData } from '@entities/SimulatorSettings'
import { ORDER_DEFAULT, OrderEnum } from '@helper/sort-modules'
import { ModuleMarkersEnum } from '@entities/Module'
import { v4 } from 'uuid'

export type ModuleFilter = {
  marker: ModuleMarkersEnum | null
}

export type ModuleSettings = {
  order: OrderEnum
  filter: ModuleFilter,
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

  setSimulator(simulator: SimulatorSettingsData | null): Settings {
    this.simulator = { ...this.simulator, ...simulator }
    return this
  }

  setModules(modules: ModuleSettings | null): Settings {
    this.modules = { ...this.modules, ...modules }
    return this
  }

  setModulesOrder(order: OrderEnum): Settings {
    this.modules.order = order
    return this
  }

  setModulesFilter(filter: ModuleFilter): Settings {
    this.modules.filter = filter
    return this
  }

  serialize(): SettingsData {
    return JSON.parse(JSON.stringify(this))
  }
}
