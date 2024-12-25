import { ClientFolderData } from '@entities/ClientFolder'
import Achievement from '@entities/Achievement'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function AchievementDegree(
  {
    className = '',
    hideRate,
    hideDegree,
    disableTruncate,
    folder,
  }:
  {
    className?: string,
    hideRate?: boolean
    hideDegree?: boolean
    disableTruncate?: boolean
    folder?: ClientFolderData | null,
  }
) {
  const achievement = useMemo(() => {
    return new Achievement().calculateByDegreeRate(folder?.degreeRate || 0)
  }, [folder?.degreeRate])

  return (
    <div
      className={clsx('flex gap-2', {
        [className]: className,
        ['truncate ...']: !disableTruncate
      })}
    >
      {!hideRate &&
        <span>
          {achievement.degreeRate.toFixed(1)}%
        </span>
      }

      {!hideDegree &&
        <span>
          {achievement.degree} {achievement.medal}
        </span>
      }
    </div>
  )
}
