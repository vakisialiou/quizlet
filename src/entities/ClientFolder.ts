import ClientSimulator, { ClientSimulatorData } from './ClientSimulator'
import ClientTerm, { ClientTermData } from './ClientTerm'
import { v4 } from 'uuid'

export type ClientFolderData = {
  id: string
  name: string | null
  terms: ClientTermData[]
  simulators: ClientSimulatorData[]
}

export default class ClientFolder {
  id: string
  name: string | null
  terms: ClientTerm[]
  simulators: ClientSimulator[]

  constructor() {
    this.id = v4()
    this.name = null
    this.terms = []
    this.simulators = []
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

  serialize() {
    return JSON.parse(JSON.stringify(this))
  }
}
