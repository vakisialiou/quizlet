import { DegreeEnum, MedalEnum } from '@entities/Achievement'
import { ClientFolderData } from '@entities/ClientFolder'
import Achievement from '@entities/Achievement'
import clsx from "clsx";

const DegreeIconMap: Record<DegreeEnum, string> = {
  [DegreeEnum.preschool]: '🧸',
  [DegreeEnum.primary]: '✏️',
  [DegreeEnum.secondary]: '📚',
  [DegreeEnum.student]: '📖',
  [DegreeEnum.bachelor]: '🎓',
  [DegreeEnum.master]: '📜',
  [DegreeEnum.doctor]: '🔬',
  [DegreeEnum.professor]: '👩‍🏫',
}

const MedalIconMap: Record<MedalEnum, string> = {
  [MedalEnum.bronze]: '🥉',
  [MedalEnum.silver]: '🥈',
  [MedalEnum.gold]: '🥇',
}

export enum AchievementsSize {
  xl = 'xl',
  sm = 'sm'
}

export default function Achievements({ folder, size }: { folder?: ClientFolderData, size?: AchievementsSize }) {
  const achievements = new Achievement().calculate(folder?.simulators || [])

  const degreeIcon = achievements.degree ? DegreeIconMap[achievements.degree] : null
  if (!degreeIcon) {
    return
  }
  console.log(size)

  const medalIcon = achievements.medal ? MedalIconMap[achievements.medal] : null
  return (
    <div className="flex gap-2 items-center">
      <div
        className={clsx('relative flex gap-2', {

        })}
      >
        <div
          className={clsx('flex w-full h-full items-start justify-start', {
            ['text-[36px] leading-[48px]']: size === AchievementsSize.xl,
            ['text-[24px] leading-[24px]']: size === AchievementsSize.sm,
          })}
        >
          {degreeIcon}
        </div>

        {medalIcon &&
          <div
            className={clsx('absolute rounded-full bg-gray-900 shadow-inner shadow-gray-500/50 flex items-center justify-center', {
              ['w-[24px] min-w-[24px] h-[24px] left-[calc(100%-12px)] top-6 text-[12px] leading-[24px]']: size === AchievementsSize.xl,
              ['w-[16px] min-w-[16px] h-[16px] left-[calc(100%-8px)] top-2 text-[8px] leading-[16px]']: size === AchievementsSize.sm,
            })}
          >
            {medalIcon}
          </div>
        }
      </div>
    </div>
  )
}
