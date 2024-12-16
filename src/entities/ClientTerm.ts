import { v4 } from 'uuid'

export const DefaultAnswerLang = 'en'
export const DefaultQuestionLang = 'ru'
export const DefaultAssociationLang = 'en'

export const languages = [
  {"name":"English","id":"en"},
  {"name":"Русский","id":"ru"},
  {"name":"Polski","id":"pl"},
  {"name":"Deutsch","id":"de"},
  {"name":"Español","id":"es"},
  {"name":"Français","id":"fr"},
  {"name":"Indonesia","id":"id"},
  {"name":"Italiano","id":"it"},
  {"name":"Nederlands","id":"nl"},
  {"name":"Português do Brasil","id":"pt"},
  {"name":"हिन्दी","id":"hi"},
  {"name":"日本語","id":"ja"},
  {"name":"한국의","id":"ko"},
  {"name":"普通话（中国大陆）","id":"zh"},
]

export type ClientTermData = {
  id: string
  order: number
  folderId: string
  answer: string | null
  answerLang: string | null
  question: string | null
  questionLang: string | null
  association: string | null
  associationLang: string | null
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export default class ClientTerm {
  id: string
  order: number
  folderId: string
  answer: string | null
  answerLang: string | null
  question: string | null
  questionLang: string | null
  association: string | null
  associationLang: string | null
  deleted: boolean
  createdAt: Date
  updatedAt: Date

  constructor(folderId = '') {
    this.order = 0
    this.id = v4()
    this.folderId = folderId
    this.answer = null
    this.answerLang = null
    this.question = null
    this.questionLang = null
    this.association = null
    this.associationLang = null
    this.deleted = false
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setCreatedAt(value: Date): ClientTerm {
    this.createdAt = value
    return this
  }

  setUpdatedAt(value: Date): ClientTerm {
    this.updatedAt = value
    return this
  }

  setOrder(value: number): ClientTerm {
    this.order = value
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

  setAnswerLang(value: string | null): ClientTerm {
    this.answerLang = value
    return this
  }

  setQuestion(value: string | null): ClientTerm {
    this.question = value
    return this
  }

  setQuestionLang(value: string | null): ClientTerm {
    this.questionLang = value
    return this
  }

  setAssociation(value: string | null): ClientTerm {
    this.association = value
    return this
  }

  setAssociationLang(value: string | null): ClientTerm {
    this.associationLang = value
    return this
  }

  setDeleted(value: boolean): ClientTerm {
    this.deleted = value
    return this
  }

  serialize(): ClientTermData {
    return JSON.parse(JSON.stringify(this))
  }
}
