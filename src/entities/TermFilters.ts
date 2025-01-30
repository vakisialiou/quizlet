
export const DEFAULT_FILTER = -1

export type TermFiltersData = {
  color: number
}

export default class TermFilters {
  color: number

  constructor() {
    this.color = DEFAULT_FILTER
  }

  serialize(): TermFilters {
    return JSON.parse(JSON.stringify(this))
  }
}
