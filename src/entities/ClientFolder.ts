import ClientRelationTerm, { ClientRelationTermData } from '@entities/ClientRelationTerm'
import ClientFolderGroup, { ClientFolderGroupData } from './ClientFolderGroup'
import ClientSimulator, { ClientSimulatorData } from './ClientSimulator'
import ClientTerm, { ClientTermData } from './ClientTerm'
import { v4 } from 'uuid'

export type ClientFolderData = {
  id: string
  parentId: string | null
  name: string | null
  collapsed: boolean
  isModule: boolean
  order: number,
  terms: ClientTermData[]
  simulators: ClientSimulatorData[]
  folderGroups: ClientFolderGroupData[]
  relationTerms: ClientRelationTermData[]
  createdAt: Date
  updatedAt: Date
}

export default class ClientFolder {
  id: string
  parentId: string | null
  order: number
  collapsed: boolean
  isModule: boolean
  name: string | null
  terms: ClientTerm[]
  simulators: ClientSimulator[]
  folderGroups: ClientFolderGroup[]
  relationTerms: ClientRelationTerm[]
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = v4()
    this.order = 0
    this.parentId = null
    this.name = null
    this.isModule = true
    this.collapsed = true
    this.terms = []
    this.simulators = []
    this.folderGroups = []
    this.relationTerms = []
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setCollapsed(value: boolean): ClientFolder {
    this.collapsed = value
    return this
  }

  setIsModule(value: boolean): ClientFolder {
    this.isModule = value
    return this
  }

  setCreatedAt(value: Date): ClientFolder {
    this.createdAt = value
    return this
  }

  setUpdatedAt(value: Date): ClientFolder {
    this.updatedAt = value
    return this
  }

  setOrder(value: number): ClientFolder {
    this.order = value
    return this
  }

  addTerm(term: ClientTerm) {
    this.terms.push(term)
    return this
  }

  setTerms(terms: (ClientTerm)[]) {
    this.terms = terms
    return this
  }

  addSimulator(simulator: ClientSimulator) {
    this.simulators.push(simulator)
    return this
  }

  setSimulators(simulators: ClientSimulator[]) {
    this.simulators = simulators
    return this
  }

  setRelationTerms(simulators: ClientRelationTerm[]) {
    this.relationTerms = simulators
    return this
  }

  setFolderGroups(folderGroups: ClientFolderGroup[]): ClientFolder {
    this.folderGroups = folderGroups
    return this
  }

  setId(value: string): ClientFolder {
    this.id = value
    return this
  }

  setName(value: string | null): ClientFolder {
    this.name = value
    return this
  }

  setParentId(value: string | null): ClientFolder {
    this.parentId = value
    return this
  }

  serialize(): ClientFolderData {
    return JSON.parse(JSON.stringify(this))
  }
}
