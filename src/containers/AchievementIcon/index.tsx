import SVGRubyOutline from '@public/svg/ruby/ruby-outline.svg'
import Levels, { EnumLevels } from '@entities/Levels'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function AchievementIcon(
  {
    size,
    degreeRate,
    single = false,
    showDefault = false,
    className = '',
  }:
  {
    size: number,
    single?: boolean,
    className?: string,
    degreeRate: number
    showDefault?: boolean,
  }
) {
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
