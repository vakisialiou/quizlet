import { v4 } from 'uuid'

export type RelationSimulatorData = {
  id: string,
  simulatorId: string,
  folderId: string,
  moduleId: string,
}

export default class RelationSimulator {
  id: string
  simulatorId: string | null
  folderId: string | null
  moduleId: string | null

  constructor() {
    this.id = v4()
    this.simulatorId = null
    this.folderId = null
    this.moduleId = null
  }

  setId(value: string): RelationSimulator {
    this.id = value
    return this
  }

  setSimulatorId(value: string | null): RelationSimulator {
    this.simulatorId = value
    return this
  }

  setFolderId(value: string | null): RelationSimulator {
    this.folderId = value
    return this
  }

  setModuleId(value: string | null): RelationSimulator {
    this.moduleId = value
    return this
  }

  serialize(): RelationSimulatorData {
    return JSON.parse(JSON.stringify(this))
  }
}
