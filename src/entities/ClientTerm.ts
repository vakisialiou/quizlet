import { v4 } from 'uuid'

export type ClientTermType = {
  sort: number
  uuid: string
  folderUUID: string
  question: string
  answer: string,
}

export default class ClientTerm {
  sort: number
  uuid: string
  folderUUID: string
  question: string | null
  answer: string | null

  constructor(folderUUID = '') {
    this.sort = 0
    this.uuid = v4()
    this.folderUUID = folderUUID
    this.question = null
    this.answer = null
  }

  setSort(value: number): ClientTerm {
    this.sort = value
    return this
  }

  setUUID(value: string): ClientTerm {
    this.uuid = value
    return this
  }

  setFolderUUID(value: string): ClientTerm {
    this.folderUUID = value
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
