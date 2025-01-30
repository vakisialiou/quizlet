import { TermData } from '@entities/Term'
import { v4 } from 'uuid'

export type RelationTermData = {
  id: string,
  color: number
  order: number
  termId: string,
  folderId: string,
  moduleId: string,
  createdAt: Date
}

export type RelatedTermData = {
  term: TermData,
  relation: RelationTermData
}

export default class RelationTerm {
  id: string
  color: number
  order: number
  termId: string | null
  folderId: string | null
  moduleId: string | null
  createdAt: Date

  constructor() {
    this.id = v4()
    this.order = 0
    this.color = 0
    this.termId = null
    this.folderId = null
    this.moduleId = null
    this.createdAt = new Date()
  }

  setOrder(value: number): RelationTerm {
    this.order = value
    return this
  }

  setColor(value: number): RelationTerm {
    this.color = value
    return this
  }

  setCreatedAt(value: Date): RelationTerm {
    this.createdAt = value
    return this
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
