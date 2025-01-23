import AchievementDegree from '@containers/AchievementDegree'
import AchievementIcon from '@containers/AchievementIcon'
import { ModuleData } from '@entities/Module'
import { useTranslations } from 'next-intl'
import React from 'react'
import clsx from 'clsx'

export default function TitleModule(
  {
    module,
    className = '',
  }:
  {
    className?: string
    module: ModuleData | null,
  }
) {
  const t = useTranslations('Module')

  return (
    <div
      className={clsx('flex items-center justify-between p-2 h-12 border-b border-white/10', {
        [className]: className,
      })}
    >
      <div className="text-white/50 text-base font-bold truncate ...">
        {module?.name || t('moduleNoName')}
      </div>

      <div
        className="flex gap-2 items-center uppercase"
      >
        <div className="flex gap-2 items-center">
          <AchievementDegree
            degreeRate={module?.degreeRate || 0}
            className="text-white/50 text-xs font-bold"
          />
          <AchievementIcon
            degreeRate={module?.degreeRate || 0}
            showDefault
            size={16}
          />
        </div>
      </div>
    </div>
  )
}
