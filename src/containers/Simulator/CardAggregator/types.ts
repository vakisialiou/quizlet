import { SimulatorMethod } from '@entities/SimulatorSettings'
import { TermData } from '@entities/Term'

export enum CardStatus {
  none = 'none',
  error = 'error',
  success = 'success',
}

export type SelectionType = {
  term: TermData | null,
  status: CardStatus
}

export type ExtraFlashcardType = {
  method: SimulatorMethod.FLASHCARD
  status: CardStatus
}

export type ExtraPickCardType = {
  method: SimulatorMethod.PICK,
  status: CardStatus
}

export type ExtraInputCardType = {
  method: SimulatorMethod.INPUT,
  status: CardStatus
}

export type HelpDataType = {
  lang: string | null
  text?: string | null
  association?: string | null,
  extra: ExtraFlashcardType | ExtraPickCardType | ExtraInputCardType
}
