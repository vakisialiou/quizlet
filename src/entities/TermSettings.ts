import TermFilters, { TermFiltersData } from '@entities/TermFilters'
import { OrderEnum } from '@helper/sort'

export type TermSettingsData = {
  order: OrderEnum
  filter: TermFiltersData,
  answerLang: string | null
  questionLang: string | null
  associationLang: string | null
}

export default class TermSettings {
  order: OrderEnum
  filter: TermFiltersData
  answerLang: string | null
  questionLang: string | null
  associationLang: string | null

  constructor() {
    this.order = OrderEnum.customAsc
    this.answerLang = null
    this.questionLang = null
    this.associationLang = null
    this.filter = new TermFilters().serialize()
  }

  setOrder(value: OrderEnum): TermSettings {
    this.order = value
    return this
  }

  setFilter(value: TermFiltersData): TermSettings {
    this.filter = { ...this.filter, ...value }
    return this
  }

  setAnswerLang(value: string | null): TermSettings {
    this.answerLang = value
    return this
  }

  setQuestionLang(value: string | null): TermSettings {
    this.questionLang = value
    return this
  }

  setAssociationLang(value: string | null): TermSettings {
    this.associationLang = value
    return this
  }

  serialize(): TermSettingsData {
    return JSON.parse(JSON.stringify(this))
  }
}
