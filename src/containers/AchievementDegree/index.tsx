import { AchievementData } from '@entities/Achievement'
import clsx from 'clsx'

export default function AchievementDegree(
  {
    className = '',
    hideRate,
    hideDegree,
    disableTruncate,
    achievementData,
  }:
  {
    className?: string,
    hideRate?: boolean
    hideDegree?: boolean
    disableTruncate?: boolean
    achievementData: AchievementData
  }
) {
  return (
    <div
      className={clsx('gap-2', {
        [className]: className,
        ['truncate ...']: !disableTruncate
      })}
    >
      {!hideRate &&
        <span>
          {achievementData.degreeRate.toFixed(1)}%
        </span>
      }

      {!hideDegree &&
        <span>
          {achievementData.degree} {achievementData.medal}
        </span>
      }
    </div>
  )
}
