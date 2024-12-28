import { ClientFolderData } from '@entities/ClientFolder'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function AchievementDegree(
  {
    className = '',
    disableTruncate,
    folder,
  }:
  {
    className?: string,
    disableTruncate?: boolean
    folder?: ClientFolderData | null,
  }
) {
  const degreeRate = useMemo(() => {
    return folder?.degreeRate || 0
  }, [folder?.degreeRate])

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
