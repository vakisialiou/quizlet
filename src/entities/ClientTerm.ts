import { v4 } from 'uuid'

export default class ClientTerm {
  id: string
  sort: number
  folderId: string
  question: string | null
  answer: string | null

  constructor(folderId = '') {
    this.sort = 0
    this.id = v4()
    this.folderId = folderId
    this.question = null
    this.answer = null
  }

  setSort(value: number): ClientTerm {
    this.sort = value
    return this
  }

  setId(value: string): ClientTerm {
    this.id = value
    return this
  }

  setFolderUUID(value: string): ClientTerm {
    this.folderId = value
    return this
  }

  setQuestion(value: string | null): ClientTerm {
    this.question = value
    return this
  }

  setAnswer(value: string | null): ClientTerm {
    this.answer = value
    return this
  }

  serialize() {
    return JSON.parse(JSON.stringify(this))
  }
}
