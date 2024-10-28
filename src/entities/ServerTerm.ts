import { v4 } from 'uuid'

export type ServerTermType = {
  id: number
  userId: number
  folderId: number
  sort: number
  uuid: string
  question: string
  answer: string,
  createdAt: Date
  updatedAt: Date
}

export default class ServerTerm {
  id: number | null
  userId: number | null
  folderId: number | null
  sort: number
  uuid: string
  question: string
  answer: string
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = null
    this.userId = null
    this.folderId = null
    this.sort = 0
    this.uuid = v4()
    this.question = ''
    this.answer = ''
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: number): ServerTerm {
    this.id = value
    return this
  }

  setUserId(value: number): ServerTerm {
    this.userId = value
    return this
  }

  setFolderId(value: number): ServerTerm {
    this.folderId = value
    return this
  }

  setSort(value: number): ServerTerm {
    this.sort = value
    return this
  }

  setUUID(value: string): ServerTerm {
    this.uuid = value
    return this
  }

  setQuestion(value: string): ServerTerm {
    this.question = value
    return this
  }

  setAnswer(value: string): ServerTerm {
    this.answer = value
    return this
  }

  setCreatedAt(value: Date | string): ServerTerm {
    this.createdAt = new Date(value)
    return this
  }

  setUpdatedAt(value: Date | string): ServerTerm {
    this.updatedAt = new Date(value)
    return this
  }
}
