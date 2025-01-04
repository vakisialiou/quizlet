import { ClientFolderData } from '@entities/Folder'
import Levels, { EnumLevels } from '@entities/Levels'
import { useMemo, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { randomInt } from '@lib/random'
import clsx from 'clsx'

export default function AchievementText(
  {
    folder,
    className = '',
  }:
  {
    className?: string,
    folder?: ClientFolderData | null,
  }
) {
  const [ text, setText ] = useState<string | null>(null)

  const degreeRate = folder?.degreeRate || 0

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
  }, [folder?.degreeRate, levels, t])

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
