import { DegreeEnum, MedalEnum } from '@entities/Achievement'
import { AchievementData } from '@entities/Achievement'
import clsx from 'clsx'

const DegreeIconMap: Record<DegreeEnum, string> & { default: string }  = {
  [DegreeEnum.beginner]: '📝',
  [DegreeEnum.learner]: '📚',
  [DegreeEnum.researcher]: '🔬',
  [DegreeEnum.expert]: '🎓',
  [DegreeEnum.leader]: '💼',
  [DegreeEnum.honorary]: '🏆️',
  default: '🔲'
}

const MedalIconMap: Record<MedalEnum, string> & { default: string }  = {
  [MedalEnum.bronze]: '🥉',
  [MedalEnum.silver]: '🥈',
  [MedalEnum.gold]: '🥇',
  default: '⚪'
}

export enum AchievementsSize {
  xl = 'xl',
  sm = 'sm'
}

export default function AchievementIcon(
  {
    size,
    className = '',
    achievementData
  }:
  {
    className?: string,
    size: AchievementsSize,
    achievementData: AchievementData
  }
) {
  const degreeIcon = achievementData.degree ? DegreeIconMap[achievementData.degree] : DegreeIconMap.default
  const medalIcon = achievementData.medal ? MedalIconMap[achievementData.medal] : MedalIconMap.default

  return (
    <div
      className={clsx('relative flex gap-2', {
        [className]: className,
        ['h-[64px]']: size === AchievementsSize.xl,
        ['h-[24px]']: size === AchievementsSize.sm
      })}
    >
      <div
        className={clsx('flex w-full h-full items-start justify-start', {
          ['text-[56px] leading-[56px]']: size === AchievementsSize.xl,
          ['text-[16px] leading-[16px]']: size === AchievementsSize.sm,
        })}
      >
        {degreeIcon}
      </div>

      {medalIcon &&
        <div
          className={clsx('absolute rounded-full bg-gray-900 shadow-inner shadow-gray-500/50 flex items-center justify-center bottom-[0px]', {
            ['w-[24px] min-w-[24px] h-[24px] left-[calc(100%-12px)] text-[12px] leading-[24px]']: size === AchievementsSize.xl,
            ['w-[16px] min-w-[16px] h-[16px] left-[calc(100%-8px)] text-[8px] leading-[16px]']: size === AchievementsSize.sm,
          })}
        >
          {medalIcon}
        </div>
      }
    </div>
  )
}