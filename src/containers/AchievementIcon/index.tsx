import { ClientFolderData } from '@entities/ClientFolder'
import SVGRuby from '@public/svg/ruby/ruby.svg'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function AchievementIcon(
  {
    folder,
    size,
    single = false,
    className = '',
  }:
  {
    size: number,
    single?: boolean,
    className?: string,
    folder?: ClientFolderData | null,
  }
) {
  const degreeRate = useMemo(() => {
    return folder?.degreeRate || 0
  }, [folder?.degreeRate])

  return (
    <div
      className={clsx('flex items-center gap-1', {
        [className]: className,
      })}
    >
      {((degreeRate >= 70 && degreeRate < 80) || (!single && degreeRate >= 70)) &&
        <SVGRuby
          width={size}
          height={size}
          className={clsx(`min-w-[${size}px] text-orange-300`)}
        />
      }

      {((degreeRate >= 80 && degreeRate < 90) || (!single && degreeRate >= 80)) &&
        <SVGRuby
          width={size}
          height={size}
          className={clsx(`min-w-[${size}px] text-purple-300`)}
        />
      }

      {((degreeRate >= 90 && degreeRate < 100) || (!single && degreeRate >= 90)) &&
        <SVGRuby
          width={size}
          height={size}
          className={clsx(`min-w-[${size}px] text-rose-300`)}
        />
      }
    </div>
  )
}
