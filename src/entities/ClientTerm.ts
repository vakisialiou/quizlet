import { v4 } from 'uuid'

export type ClientTermData = {
  id: string
  sort: number
  folderId: string
  answer: string | null
  question: string | null
  association: string | null
}

export default class ClientTerm {
  id: string
  sort: number
  folderId: string
  answer: string | null
  question: string | null
  association: string | null

  constructor(folderId = '') {
    this.sort = 0
    this.id = v4()
    this.folderId = folderId
    this.answer = null
    this.question = null
    this.association = null
  }

  setSort(value: number): ClientTerm {
    this.sort = value
    return this
  }

  setId(value: string): ClientTerm {
    this.id = value
    return this
  }

  setFolderId(value: string): ClientTerm {
    this.folderId = value
    return this
  }

  setAnswer(value: string | null): ClientTerm {
    this.answer = value
    return this
  }

  setQuestion(value: string | null): ClientTerm {
    this.question = value
    return this
  }

  setAssociation(value: string | null): ClientTerm {
    this.association = value
    return this
  }

  serialize() {
    return JSON.parse(JSON.stringify(this))
  }
}
