import ClientSimulator, { ClientSimulatorData } from './ClientSimulator'
import ClientTerm, { ClientTermData } from './ClientTerm'
import { v4 } from 'uuid'

export type ClientFolderData = {
  id: string
  name: string | null
  order: number,
  terms: ClientTermData[]
  simulators: ClientSimulatorData[]
  createdAt: Date
  updatedAt: Date
}

export default class ClientFolder {
  id: string
  order: number
  name: string | null
  terms: ClientTerm[]
  simulators: ClientSimulator[]
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = v4()
    this.order = 0
    this.name = null
    this.terms = []
    this.simulators = []
    this.createdAt = new Date()
    this.updatedAt = new Date()
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

  setTerms(terms: ClientTerm[]) {
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

  setId(value: string): ClientFolder {
    this.id = value
    return this
  }

  setName(value: string | null): ClientFolder {
    this.name = value
    return this
  }

  serialize(): ClientFolderData {
    return JSON.parse(JSON.stringify(this))
  }
}
