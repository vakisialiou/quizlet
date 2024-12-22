import Achievement, { DegreeEnum, MedalEnum } from '@entities/Achievement'
import { ClientFolderData } from '@entities/ClientFolder'
import { useMemo } from 'react'
import clsx from 'clsx'

const DegreeIconMap: Record<DegreeEnum, string>  = {
  [DegreeEnum.beginner]: '📝',
  [DegreeEnum.learner]: '📚',
  [DegreeEnum.researcher]: '🔬',
  [DegreeEnum.expert]: '🎓',
  [DegreeEnum.leader]: '💼',
  [DegreeEnum.honorary]: '🏆️',
}

const MedalIconMap: Record<MedalEnum, string>  = {
  [MedalEnum.bronze]: '🥉',
  [MedalEnum.silver]: '🥈',
  [MedalEnum.gold]: '🥇',
}

export enum AchievementsSize {
  xl = 'xl',
  sm = 'sm',
  xs = 'xs',
}

export default function AchievementIcon(
  {
    size,
    folder,
    className = '',
  }:
  {
    className?: string,
    size: AchievementsSize,
    folder?: ClientFolderData | null,
  }
) {
  const { degreeIcon, medalIcon } = useMemo(() => {
    const achievement = new Achievement().calculate(folder?.simulators || [])
    return {
      degreeIcon: achievement.degree ? DegreeIconMap[achievement.degree] : null,
      medalIcon: achievement.medal ? MedalIconMap[achievement.medal] : null
    }
  }, [folder])

  return (
    <div
      className={clsx('flex justify-center items-center text-white', {
        [className]: className,
        ['h-[64px] text-[56px] leading-[56px]']: size === AchievementsSize.xl,
        ['h-[24px] text-[16px] leading-[16px]']: size === AchievementsSize.sm,
        ['h-[20px] text-[12px] leading-[12px]']: size === AchievementsSize.xs,
      })}
    >
      {degreeIcon &&
        <div
          className={clsx('flex w-full h-full items-center')}
        >
          {degreeIcon}
        </div>
      }

      {medalIcon &&
        <div
          className={clsx('flex w-full h-full items-center')}
        >
          {medalIcon}
        </div>
      }

      {(!degreeIcon && !medalIcon) &&
        <div
          className={clsx('flex w-full h-full items-center')}
        >
          {'🔒'}
        </div>
      }

    </div>
  )
}
