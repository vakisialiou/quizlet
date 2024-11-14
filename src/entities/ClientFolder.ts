import ClientTerm from './ClientTerm'
import { v4 } from 'uuid'

export default class ClientFolder {
  id: string
  name: string | null
  terms: ClientTerm[]

  constructor() {
    this.id = v4()
    this.name = null
    this.terms = []
  }

  addTerm(term: ClientTerm) {
    this.terms.push(term)
    return this
  }

  setTerms(terms: ClientTerm[]) {
    this.terms = terms
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
