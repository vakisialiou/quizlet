import dayjs, { ConfigType } from 'dayjs'

import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const calcDuration = (timestampA: ConfigType, timestampB: ConfigType, formatStr = 'HH:mm:ss'): string => {
  timestampA = dayjs(timestampA)
  timestampB = dayjs(timestampB)
  return getDuration(timestampB.diff(timestampA), formatStr)
}

export const getDuration = (time: number, formatStr = 'HH:mm:ss'): string => {
  return dayjs.duration(time).format(formatStr)
}
