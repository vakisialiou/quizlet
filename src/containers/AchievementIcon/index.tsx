import SVGRubyOutline from '@public/svg/ruby/ruby-outline.svg'
import { ClientFolderData } from '@entities/ClientFolder'
import Levels, { EnumLevels } from '@entities/Levels'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function AchievementIcon(
  {
    folder,
    size,
    single = false,
    showDefault = false,
    className = '',
  }:
  {
    size: number,
    single?: boolean,
    showDefault?: boolean,
    className?: string,
    folder?: ClientFolderData | null,
  }
) {
  const degreeRate = folder?.degreeRate || 0

  const levels = useMemo(() => {
    return new Levels(degreeRate, single)
  }, [degreeRate, single])

  if (levels.hasNoLevels() && !showDefault) {
    return
  }

  return (
    <div
      className={clsx('flex items-center gap-1', {
        [className]: className,
      })}
    >
      {(levels.hasNoLevels() && showDefault) &&
        <SVGRubyOutline
          width={size}
          height={size}
          className={clsx(`min-w-[${size}px] text-gray-600`)}
        />
      }

      {levels.hasLevel(EnumLevels.beginner) &&
        <SVGRubyOutline
          width={size}
          height={size}
          className={clsx(`min-w-[${size}px] text-orange-600`)}
        />
      }

      {levels.hasLevel(EnumLevels.middle) &&
        <SVGRubyOutline
          width={size}
          height={size}
          className={clsx(`min-w-[${size}px] text-orange-600`)}
        />
      }

      {levels.hasLevel(EnumLevels.expert) &&
        <SVGRubyOutline
          width={size}
          height={size}
          className={clsx(`min-w-[${size}px] text-orange-600`)}
        />
      }
    </div>
  )
}
