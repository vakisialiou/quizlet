import { TermData } from '@entities/Term'

export enum CardStatus {
  none = 'none',
  error = 'error',
  success = 'success',
}

export enum CardSide {
  front = 'front',
  back = 'back',
}

export type SelectionType = {
  term: TermData | null,
  status: CardStatus
}

export type SoundType = {
  term: TermData | null,
  side: CardSide | null
}

