import clsx from 'clsx'

export default function AchievementDegree(
  {
    className = '',
    disableTruncate,
    degreeRate,
  }:
  {
    className?: string,
    degreeRate: number,
    disableTruncate?: boolean
  }
) {

  return (
    <div
      className={clsx('flex gap-2', {
        [className]: className,
        ['truncate ...']: !disableTruncate
      })}
    >
      <span>
          {degreeRate.toFixed(1)}%
        </span>
    </div>
  )
}
