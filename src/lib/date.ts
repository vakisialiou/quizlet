import dayjs, { ConfigType } from 'dayjs'

import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const getDuration = (timestampA: ConfigType, timestampB: ConfigType, formatStr = 'HH:mm:ss'): string => {
  timestampA = dayjs(timestampA)
  timestampB = dayjs(timestampB)
  return dayjs.duration(timestampB.diff(timestampA)).format(formatStr)
}
