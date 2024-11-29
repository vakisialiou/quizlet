import { v4 } from 'uuid'

export const DefaultAnswerLang = 'en-GB'
export const DefaultQuestionLang = 'ru-RU'
export const DefaultAssociationLang = 'en-GB'

export type ClientTermData = {
  id: string
  sort: number
  folderId: string
  answer: string | null
  answerLang: string | null
  question: string | null
  questionLang: string | null
  association: string | null
  associationLang: string | null
}

export default class ClientTerm {
  id: string
  sort: number
  folderId: string
  answer: string | null
  answerLang: string | null
  question: string | null
  questionLang: string | null
  association: string | null
  associationLang: string | null

  constructor(folderId = '') {
    this.sort = 0
    this.id = v4()
    this.folderId = folderId
    this.answer = null
    this.answerLang = null
    this.question = null
    this.questionLang = null
    this.association = null
    this.associationLang = null
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

  serialize(): ClientTermData {
    return JSON.parse(JSON.stringify(this))
  }
}
