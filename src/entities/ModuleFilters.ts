import { MarkersEnum } from '@entities/Marker'

export type ModuleFiltersData = {
  marker: MarkersEnum | null
}

export default class ModuleFilters {
  marker: MarkersEnum | null

  constructor() {

    this.marker = null
  }

  serialize(): ModuleFiltersData {
    return JSON.parse(JSON.stringify(this))
  }
}
