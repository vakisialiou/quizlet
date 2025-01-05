import Levels, { EnumLevels } from '@entities/Levels'
import { useMemo, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { randomInt } from '@lib/random'
import clsx from 'clsx'

export default function AchievementText(
  {
    degreeRate,
    className = '',
  }:
  {
    className?: string,
    degreeRate: number,
  }
) {
  const [ text, setText ] = useState<string | null>(null)

  const levels = useMemo(() => {
    return new Levels(degreeRate, true)
  }, [degreeRate])

  const t = useTranslations('Simulators')

  useEffect(() => {
    const index = randomInt(0, 9)
    const level = levels.getLevel(0)
    switch (level) {
      default:
      case EnumLevels.beginner:
        setText(t(`textBeginner_${index}`))
        break
      case EnumLevels.middle:
        setText(t(`textMiddle_${index}`))
        break
      case EnumLevels.expert:
        setText(t(`textExpert_${index}`))
        break
    }
  }, [degreeRate, levels, t])

  return (
    <div
      className={clsx('flex items-center gap-1', {
        [className]: className,
      })}
    >
      {text}
    </div>
  )
}
