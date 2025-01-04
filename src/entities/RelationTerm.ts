import { v4 } from 'uuid'

export type RelationTermData = {
  id: string,
  termId: string,
  folderId: string,
  moduleId: string,
}

export default class RelationTerm {
  id: string
  termId: string | null
  folderId: string | null
  moduleId: string | null

  constructor() {
    this.id = v4()
    this.termId = null
    this.folderId = null
    this.moduleId = null
  }

  setId(value: string): RelationTerm {
    this.id = value
    return this
  }

  setTermId(value: string | null): RelationTerm {
    this.termId = value
    return this
  }

  setFolderId(value: string | null): RelationTerm {
    this.folderId = value
    return this
  }

  setModuleId(value: string | null): RelationTerm {
    this.moduleId = value
    return this
  }

  serialize(): RelationTermData {
    return JSON.parse(JSON.stringify(this))
  }
}
