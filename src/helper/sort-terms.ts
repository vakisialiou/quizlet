import { OrderEnum, sortByStr, sortByNum } from '@helper/sort'
import { RelatedTermData } from '@entities/RelationTerm'
import { TermData } from '@entities/Term'

export const sortTerms = (items: TermData[], order: OrderEnum): TermData[] => {
  return [...items].sort((a, b) => {

    switch (order) {
      default:
      case OrderEnum.customAsc:
        return sortByNum(a.order, b.order, true)
      case OrderEnum.questionAsc:
        return sortByStr(a.question, b.question, true)
      case OrderEnum.answerAsc:
        return sortByStr(a.answer, b.answer, true)
      case OrderEnum.customDesc:
        return sortByNum(a.order, b.order, false)
      case OrderEnum.questionDesc:
        return sortByStr(a.question, b.question, false)
      case OrderEnum.answerDesc:
        return sortByStr(a.answer, b.answer, false)
    }
  })
}

export const sortRelatedTerms = (items: RelatedTermData[], order: OrderEnum): RelatedTermData[] => {
  return [...items].sort((a, b) => {
    switch (order) {
      default:
      case OrderEnum.customAsc:
        return sortByNum(a.relation.order, b.relation.order, true)
      case OrderEnum.questionAsc:
        return sortByStr(a.term.question, b.term.question, true)
      case OrderEnum.answerAsc:
        return sortByStr(a.term.answer, b.term.answer, true)
      case OrderEnum.colorAsc:
        return sortByNum(a.relation.color, b.relation.color, true)
      case OrderEnum.customDesc:
        return sortByNum(a.relation.order, b.relation.order, false)
      case OrderEnum.questionDesc:
        return sortByStr(a.term.question, b.term.question, false)
      case OrderEnum.answerDesc:
        return sortByStr(a.term.answer, b.term.answer, false)
      case OrderEnum.colorDesc:
        return sortByNum(a.relation.color, b.relation.color, false)
    }
  })
}
