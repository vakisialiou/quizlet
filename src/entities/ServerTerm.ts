import { v4 } from 'uuid'

export type ServerTermType = {
  id: number
  userId: number | null
  folderId: number | null
  sort: number
  uuid: string
  question: string | null
  answer: string | null,
  createdAt: Date
  updatedAt: Date
}

export default class ServerTerm {
  id: number | null
  userId: number | null
  folderId: number | null
  sort: number
  uuid: string
  question: string | null
  answer: string | null
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = null
    this.userId = null
    this.folderId = null
    this.sort = 0
    this.uuid = v4()
    this.answer = null
    this.question = null
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: number): ServerTerm {
    this.id = value
    return this
  }

  setUserId(value: number | null): ServerTerm {
    this.userId = value
    return this
  }

  setFolderId(value: number | null): ServerTerm {
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

  setQuestion(value: string | null): ServerTerm {
    this.question = value
    return this
  }

  setAnswer(value: string | null): ServerTerm {
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
