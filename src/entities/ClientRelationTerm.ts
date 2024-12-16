import { v4 } from 'uuid'

export type ClientRelationTermData = {
  id: string,
  termId: string,
  folderId: string,
  createdAt: Date,
}

export default class ClientRelationTerm {
  id: string
  termId: string | null
  folderId: string | null
  createdAt: Date

  constructor() {
    this.id = v4()
    this.termId = null
    this.folderId = null
    this.createdAt = new Date()
  }

  setCreatedAt(value: Date): ClientRelationTerm {
    this.createdAt = value
    return this
  }

  setId(value: string): ClientRelationTerm {
    this.id = value
    return this
  }

  setTermId(value: string | null): ClientRelationTerm {
    this.termId = value
    return this
  }

  setFolderId(value: string | null): ClientRelationTerm {
    this.folderId = value
    return this
  }

  serialize(): ClientRelationTermData {
    return JSON.parse(JSON.stringify(this))
  }
}
