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

export type TermData = {
  id: string
  answer: string | null
  answerLang: string | null
  question: string | null
  questionLang: string | null
  association: string | null
  associationLang: string | null
  deleted: boolean
  collapsed: boolean
  updatedAt: Date
  createdAt: Date
}

export default class Term {
  id: string
  answer: string | null
  answerLang: string | null
  question: string | null
  questionLang: string | null
  association: string | null
  associationLang: string | null
  deleted: boolean
  collapsed: boolean
  updatedAt: Date
  createdAt: Date

  constructor() {
    this.id = v4()
    this.answer = null
    this.answerLang = null
    this.question = null
    this.questionLang = null
    this.association = null
    this.associationLang = null
    this.deleted = false
    this.collapsed = false
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  setUpdatedAt(value: Date): Term {
    this.updatedAt = value
    return this
  }

  setCreatedAt(value: Date): Term {
    this.createdAt = value
    return this
  }

  setId(value: string): Term {
    this.id = value
    return this
  }

  setAnswer(value: string | null): Term {
    this.answer = value
    return this
  }

  setAnswerLang(value: string | null): Term {
    this.answerLang = value
    return this
  }

  setQuestion(value: string | null): Term {
    this.question = value
    return this
  }

  setQuestionLang(value: string | null): Term {
    this.questionLang = value
    return this
  }

  setAssociation(value: string | null): Term {
    this.association = value
    return this
  }

  setAssociationLang(value: string | null): Term {
    this.associationLang = value
    return this
  }

  setCollapsed(value: boolean): Term {
    this.collapsed = value
    return this
  }

  setDeleted(value: boolean): Term {
    this.deleted = value
    return this
  }

  serialize(): TermData {
    return JSON.parse(JSON.stringify(this))
  }
}
