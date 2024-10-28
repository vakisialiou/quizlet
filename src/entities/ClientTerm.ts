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
  question: string
  answer: string

  constructor(folderUUID: string) {
    this.sort = 0
    this.uuid = v4()
    this.folderUUID = folderUUID
    this.question = ''
    this.answer = ''
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

  setQuestion(value: string): ClientTerm {
    this.question = value
    return this
  }

  setAnswer(value: string): ClientTerm {
    this.answer = value
    return this
  }

  serialize() {
    return JSON.parse(JSON.stringify(this))
  }
}
