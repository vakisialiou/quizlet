export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export function seconds(number: number): number {
  return number * SECOND
}

export function minutes(number: number): number {
  return number * MINUTE
}

export function hours(number: number): number {
  return number * HOUR
}

export function days(number: number): number {
  return number * DAY
}

