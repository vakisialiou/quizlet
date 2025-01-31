import SimulatorSettings, { SimulatorSettingsData } from '@entities/SimulatorSettings'
import { ORDER_DEFAULT, TERM_ORDER_DEFAULT, OrderEnum } from '@helper/sort'
import ModuleFilters, { ModuleFiltersData } from '@entities/ModuleFilters'
import { v4 } from 'uuid'

export type ModuleSettingsData = {
  order: OrderEnum
  filter: ModuleFiltersData,
}

export type TermSettingsData = {
  order: OrderEnum
}

export type SettingsData = {
  id: string
  terms: TermSettingsData,
  modules: ModuleSettingsData
  simulator: SimulatorSettingsData
}

export default class Settings {
  id: string
  terms: TermSettingsData
  modules: ModuleSettingsData
  simulator: SimulatorSettingsData

  constructor() {
    this.id = v4()
    this.terms = {
      order: TERM_ORDER_DEFAULT
    }
    this.modules = {
      order: ORDER_DEFAULT,
      filter: new ModuleFilters().serialize()
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

  setModules(value: ModuleSettingsData | null): Settings {
    this.modules = { ...this.modules, ...value }
    return this
  }

  setModulesOrder(order: OrderEnum): Settings {
    this.modules.order = order
    return this
  }

  setModulesFilter(filter: ModuleFiltersData): Settings {
    this.modules.filter = filter
    return this
  }

  setTerms(value: TermSettingsData | null): Settings {
    this.terms = { ...this.terms, ...value }
    return this
  }

  setTermsOrder(order: OrderEnum): Settings {
    this.terms.order = order
    return this
  }

  serialize(): SettingsData {
    return JSON.parse(JSON.stringify(this))
  }
}
