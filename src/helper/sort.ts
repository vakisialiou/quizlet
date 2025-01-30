
export enum OrderEnum {
  nameAsc = 'name-asc',
  nameDesc = 'name-desc',
  questionAsc = 'question-asc',
  questionDesc = 'question-desc',
  answerAsc = 'answer-asc',
  answerDesc = 'answer-desc',
  customAsc = 'custom-asc',
  customDesc = 'custom-desc',
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
  colorAsc = 'color-asc',
  colorDesc = 'color-desc',
}

export const ORDER_DEFAULT = OrderEnum.dateDesc
export const TERM_ORDER_DEFAULT = OrderEnum.customDesc

export function sortByNum(a: number, b: number, asc: boolean): number {
  return asc ? a - b : b - a
}

export function sortByStr(a: string | null, b: string | null, asc: boolean): number {
  const aa = a || ''
  const bb = b || ''
  return asc ? aa.localeCompare(bb) : bb.localeCompare(aa)
}

export function sortByDate(a: Date, b: Date, asc: boolean): number {
  const aa = new Date(a).getTime()
  const bb = new Date(b).getTime()
  return asc ? aa - bb : bb - aa
}
